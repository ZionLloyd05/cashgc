import * as nodemailer from "nodemailer";
import * as path from "path";
import * as bluebird from "bluebird";
import { promisify } from "promisify";
import * as tp from "typed-promisify";
import * as sgMail from "@sendgrid/mail";

export class Mail {
	public static SENDGRID_API_KEY;
	/**
	 *
	 */
	// public transporter;
	// // public EmailTemplate = EmailTemp.EmailTemplate;

	// constructor() {
	// 	this.transporter = nodemailer.createTransport({
	// 		host: process.env.MAIL_HOST,
	// 		port: process.env.MAIL_PORT,
	// 		auth: {
	// 			user: process.env.user,
	// 			pass: process.env.pass
	// 		}
	// 	});
	// }

	// public async send(options: any): Promise<any> {
	// 	const mailOptions: any = {
	// 		from: "Cash GiftCode <noreply@gccode.com>",
	// 		to: options.user.email,
	// 		subject: options.subject,
	// 		html: options.htmlContent,
	// 		text: options.textContent
	// 	};

	// 	return this.transporter.sendMail(mailOptions);
	// }

	constructor() {
		Mail.SENDGRID_API_KEY =
			"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";
		sgMail.setApiKey(Mail.SENDGRID_API_KEY);
	}

	public send(options: any): any {
		const msg = {
			from: "Cash GiftCode <noreply@gccode.com>",
			to: options.user.email,
			subject: options.subject,
			html: options.htmlContent,
			text: options.textContent
		};
		sgMail.send(msg);
	}
}
