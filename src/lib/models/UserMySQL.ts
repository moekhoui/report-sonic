import { query } from '../mysql';
import bcrypt from 'bcryptjs';

export interface IUser {
  id?: number;
  email: string;
  name: string;
  password?: string;
  image?: string;
  provider?: string;
  subscription_plan?: 'free' | 'starter' | 'professional';
  subscription_status?: 'active' | 'canceled' | 'past_due';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_end?: Date;
  monthly_cells_used?: number;
  monthly_reports_used?: number;
  total_cells_used?: number;
  last_reset_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class UserMySQL {
  static async create(userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser> {
    const { 
      email, 
      name, 
      password, 
      image, 
      provider = 'credentials', 
      subscription_plan = 'free', 
      subscription_status = 'active',
      monthly_cells_used = 0,
      monthly_reports_used = 0,
      total_cells_used = 0
    } = userData;
    
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const sql = `
      INSERT INTO users (email, name, password, image, provider, subscription_plan, subscription_status, monthly_cells_used, monthly_reports_used, total_cells_used)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [email.toLowerCase().trim(), name, hashedPassword, image, provider, subscription_plan, subscription_status, monthly_cells_used, monthly_reports_used, total_cells_used]);
    
    const newUser = await this.findById((result as any).insertId);
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    return newUser;
  }

  static async findById(id: number): Promise<IUser | null> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const users = await query(sql, [id]) as IUser[];
    return users.length > 0 ? users[0] : null;
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email.toLowerCase().trim()]) as IUser[];
    return users.length > 0 ? users[0] : null;
  }

  static async update(id: number, updates: Partial<IUser>): Promise<IUser | null> {
    const fields: string[] = [];
    const values: any[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return this.findById(id);
    
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    await query(sql, values);
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await query(sql, [id]) as any;
    return result.affectedRows > 0;
  }

  static async findAll(): Promise<IUser[]> {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    return await query(sql) as IUser[];
  }

  static async findByProvider(provider: string): Promise<IUser[]> {
    const sql = 'SELECT * FROM users WHERE provider = ? ORDER BY created_at DESC';
    return await query(sql, [provider]) as IUser[];
  }

  static async verifyPassword(email: string, password: string): Promise<IUser | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  static async clearAll(): Promise<void> {
    await query('DELETE FROM users');
  }

  static async resetMonthlyUsage(): Promise<void> {
    const sql = `
      UPDATE users 
      SET monthly_cells_used = 0, 
          monthly_reports_used = 0, 
          last_reset_date = CURRENT_DATE
      WHERE last_reset_date < DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
    `;
    await query(sql);
  }

  static async incrementUsage(userId: number, cellsUsed: number, reportsUsed: number = 1): Promise<void> {
    const sql = `
      UPDATE users 
      SET monthly_cells_used = monthly_cells_used + ?,
          monthly_reports_used = monthly_reports_used + ?,
          total_cells_used = total_cells_used + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await query(sql, [cellsUsed, reportsUsed, cellsUsed, userId]);
  }

  static async logUsage(userId: number, reportId: number | null, actionType: 'report_generated' | 'cells_used' | 'limit_reached', cellsUsed: number = 0, reportsUsed: number = 0, details: any = null): Promise<void> {
    const sql = `
      INSERT INTO usage_logs (user_id, report_id, action_type, cells_used, reports_used, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await query(sql, [userId, reportId, actionType, cellsUsed, reportsUsed, JSON.stringify(details)]);
  }
}

export default UserMySQL;
