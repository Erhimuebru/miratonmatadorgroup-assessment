import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailVerificationService  {
  async sendEmail(email: string, text?: string, html?: string, subject?: string) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, 
      },

    });

    let info = await transporter.sendMail({
      from: '"Miratonmatadorgroup " <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: subject,
      text: text,
      html: html,
    });
  }

  async sendConfirmationEmail(email: string, confirmationLink: string) {
    const  subject ='Account Verification'
    const text = `Click the following link to verify your account: ${confirmationLink}`;
    const html = `Click the following link to verify your account: <a href="${confirmationLink}">${confirmationLink}</a>`;

    await this.sendEmail(email, text, html, subject);
  }


  async sendLoginNotificationEmail(email: string) {
    const  subject ='Account Notification'
    const text = 'You have successfully logged in to your account.';
    const html = '<p>You have successfully logged in to your account.</p>';

    await this.sendEmail(email, text, html, subject);
  }
  
}