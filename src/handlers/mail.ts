import * as nodemailer from "nodemailer";
import * as path from "path";
import * as bluebird from "bluebird";
import { promisify } from "promisify";
import * as tp from "typed-promisify";

export class Mail {
	/**
	 *
	 */
	public transporter;
	// public EmailTemplate = EmailTemp.EmailTemplate;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			auth: {
				user: process.env.user,
				pass: process.env.pass
			}
		});
	}

	public async send(options: any): Promise<any> {
		const mailOptions: any = {
			from: "Cash GiftCode <noreply@gccode.com>",
			to: options.user.email,
			subject: options.subject,
			html: options.htmlContent,
			text: options.textContent
		};

		return this.transporter.sendMail(mailOptions);
	}
}
