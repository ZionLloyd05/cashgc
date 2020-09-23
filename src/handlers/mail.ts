import * as path from 'path';
import * as bluebird from 'bluebird';
import { promisify } from 'promisify';
import * as tp from 'typed-promisify';
import config from '../config';
import * as postmark from 'postmark';
import * as nodemailer from 'nodemailer';

export class Mail {
  public static SENDGRID_API_KEY;
  /**
   *
   */
  public transporter;
  public client;
  // // public EmailTemplate = EmailTemp.EmailTemplate;

  constructor() {
    // console.log(config.postmark_token);
    this.transporter = nodemailer.createTransport({
      Host: 'smtp.elasticemail.com',
      Port: 2525,
      auth: {
        Username: 'admin@topratetransfer.com.au',
        Password: '91A58B2D6D5E8BDFE809350B192FCF087111',
      },
      secure: false,
      logger: true,
      debug: true,
      ignoreTLS: true,
    });
    // this.transporter = nodemailer.createTransport({
  }

  public async send(options: any): Promise<any> {
    const mailOptions: any = {
      From: 'support@cashgiftcode.com',
      To: options.user.email,
      Subject: options.subject,
      HtmlBody: options.htmlContent,
      TextBody: options.textContent,
    };

    return this.transporter.sendMail(mailOptions);
    //console.log(mailOptions);
    //return this.client.sendEmail(mailOptions);
  }
}
