// Simple email service using a free email API
// For production, you would use services like SendGrid, Resend, or AWS SES

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailData): Promise<boolean> {
  try {
    // For now, we'll just log the email content
    // In production, replace this with actual email service
    console.log('📧 Email would be sent:', {
      to,
      subject,
      html: html.substring(0, 100) + '...',
    });

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export function generateWelcomeEmail(name: string, email: string) {
  return {
    to: email,
    subject: 'Welcome to ReportSonic! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to ReportSonic!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">AI-Powered Reports in Minutes</p>
        </div>
        
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining ReportSonic! We're excited to help you transform your data into stunning, professional reports.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Upload CSV files and get instant insights</li>
              <li>Connect to Google Sheets for real-time data</li>
              <li>Generate beautiful reports with AI</li>
              <li>Export reports in PDF, Word, or other formats</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'https://report-sonic.vercel.app'}/dashboard" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Get Started Now
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If you have any questions, feel free to reach out to our support team.
          </p>
        </div>
        
        <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 ReportSonic. All rights reserved.</p>
          <p>This email was sent to ${email}</p>
        </div>
      </div>
    `,
    text: `
Welcome to ReportSonic!

Hi ${name}!

Thank you for joining ReportSonic! We're excited to help you transform your data into stunning, professional reports.

What you can do now:
- Upload CSV files and get instant insights
- Connect to Google Sheets for real-time data
- Generate beautiful reports with AI
- Export reports in PDF, Word, or other formats

Get started: ${process.env.NEXTAUTH_URL || 'https://report-sonic.vercel.app'}/dashboard

If you have any questions, feel free to reach out to our support team.

© 2024 ReportSonic. All rights reserved.
    `
  };
}
