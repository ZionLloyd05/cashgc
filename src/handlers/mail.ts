import * as path from 'path';
import * as bluebird from 'bluebird';
import { promisify } from 'promisify';
import * as tp from 'typed-promisify';
import config from '../config';
import * as postmark from 'postmark';

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
    this.client = new postmark.ServerClient(
      '4181dd98-f429-448e-9be6-a419a64eafa3'
    );
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

    // return this.transporter.sendMail(mailOptions);
    console.log(mailOptions);
    return this.client.sendEmail(mailOptions);
  }
}
