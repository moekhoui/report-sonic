import { query } from '../mysql';
import bcrypt from 'bcryptjs';

export interface IUser {
  id?: number;
  email: string;
  name: string;
  password?: string;
  image?: string;
  provider?: string;
  subscription_plan?: 'free' | 'pro' | 'enterprise';
  subscription_status?: 'active' | 'canceled' | 'past_due';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_end?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class UserMySQL {
  static async create(userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser> {
    const { email, name, password, image, provider = 'credentials', subscription_plan = 'free', subscription_status = 'active' } = userData;
    
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const sql = `
      INSERT INTO users (email, name, password, image, provider, subscription_plan, subscription_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [email.toLowerCase().trim(), name, hashedPassword, image, provider, subscription_plan, subscription_status]);
    
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
}

export default UserMySQL;
