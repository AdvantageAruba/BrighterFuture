/**
 * Email service for sending invitation emails
 * This is a mock implementation - in production, you would integrate with a real email service
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface InvitationEmailData {
  recipientName: string;
  recipientEmail: string;
  invitationLink: string;
  organizationName: string;
  senderName: string;
  role: string;
}

/**
 * Generate invitation email template
 */
export const generateInvitationEmail = (data: InvitationEmailData): EmailTemplate => {
  const { recipientName, recipientEmail, invitationLink, organizationName, senderName, role } = data;
  
  const subject = `Welcome to ${organizationName} - Your Account Details`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${organizationName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .password-box { background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .password { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ${organizationName}!</h1>
          <p>Your account has been created</p>
        </div>
        
        <div class="content">
          <h2>Hello ${recipientName},</h2>
          
          <p>Welcome to ${organizationName}! Your account has been created with the role of <strong>${role}</strong>.</p>
          
          <p>To get started, click the button below to set up your account and create your password:</p>
          
          <a href="${invitationLink}" class="button">Access Your Account</a>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${invitationLink}</p>
          
          <h3>What's Next?</h3>
          <ul>
            <li>Click the invitation link above</li>
            <li>Create a secure password for your account</li>
            <li>Complete your profile setup</li>
            <li>Explore the platform features</li>
          </ul>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          ${senderName}<br>
          ${organizationName}</p>
        </div>
        
        <div class="footer">
          <p>This email was sent to ${recipientEmail}</p>
          <p>If you didn't expect this email, please contact your administrator.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Welcome to ${organizationName}!

Hello ${recipientName},

Welcome to ${organizationName}! Your account has been created with the role of ${role}.

To get started, visit: ${invitationLink}

What's Next?
- Click the invitation link above
- Create a secure password for your account
- Complete your profile setup
- Explore the platform features

If you have any questions or need assistance, please don't hesitate to contact us.

Best regards,
${senderName}
${organizationName}

---
This email was sent to ${recipientEmail}
If you didn't expect this email, please contact your administrator.
  `;
  
  return { subject, html, text };
};

/**
 * Mock email sending function
 * In production, this would integrate with services like:
 * - SendGrid
 * - AWS SES
 * - Mailgun
 * - Nodemailer with SMTP
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Mock email sending - in production, replace with actual email service
    console.log('📧 Sending email...');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML Length:', html.length);
    console.log('Text Length:', text.length);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    console.log('✅ Email sent successfully:', messageId);
    
    return {
      success: true,
      messageId
    };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Send invitation email
 */
export const sendInvitationEmail = async (data: InvitationEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const template = generateInvitationEmail(data);
    
    const result = await sendEmail(
      data.recipientEmail,
      template.subject,
      template.html,
      template.text
    );
    
    return result;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send invitation email'
    };
  }
};

/**
 * Generate invitation link
 */
export const generateInvitationLink = (token: string, baseUrl: string = window.location.origin): string => {
  return `${baseUrl}/invite/${token}`;
};
