import * as nodemailer from "nodemailer";
import * as path from "path";
import * as bluebird from "bluebird";
import { promisify } from "promisify";
import * as tp from "typed-promisify";
import * as sgMail from "@sendgrid/mail";
import * as mailgun from "mailgun-js";
import * as xoauth2 from "xoauth2";

// var API_KEY = 'YOUR_API_KEY';
// var DOMAIN = 'YOUR_DOMAIN_NAME';
// var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

// const data = {
//   from: 'Excited User <me@samples.mailgun.org>',
//   to: 'foo@example.com, bar@example.com',
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomeness!'
// };

// mailgun.messages().send(data, (error, body) => {
//   console.log(body);
// });

export class Mail {
	public static SENDGRID_API_KEY;
	/**
	 *
	 */
	public transporter;
	// // public EmailTemplate = EmailTemp.EmailTemplate;

	constructor() {
		this.transporter = nodemailer.createTransport({
			
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				type: "OAuth2",
				user: "cashgiftcode@gmail.com",
				clientId:
					"224685128971-rbeo8kds2jof0lsr848gud345088mi2r.apps.googleusercontent.com",
				clientSecret: "neR0RlBzRIO3a6yaUuUEKb_W",
				refreshToken:
					"1//04KJMSBtiQFvJCgYIARAAGAQSNwF-L9IrA5kIC95TMPPP8WBHMMu4VMVN-fxJ77hwjFGDjrk84hV07ohJrq4BA6IWGquL--_UZnw",
				accessToken:
					"ya29.Il-wB2kOCAimo9T8HXDCDKHp-IAPx-gGq-nJYAjMfkfWSoh_F-mJe_YKwGXvurN8Lcun_2-mtEQJs-Y60dzfX3szNQQaX9wL1O8iqPLYOBHjOkZj1mg13Q0oWBULvCrzXg",
				expires: 3600
			}
		});
	}

	public async send(options: any): Promise<any> {
		const mailOptions: any = {
			from: "Cashgiftcode@gmail.com",
			to: options.user.email,
			subject: options.subject,
			html: options.htmlContent,
			text: options.textContent
		};

		return this.transporter.sendMail(mailOptions);
	}

	// constructor() {
	// 	Mail.SENDGRID_API_KEY =
	// 		"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";
	// 	sgMail.setApiKey(Mail.SENDGRID_API_KEY);
	// }

	// public send(options: any): any {
	// 	const msg = {
	// 		from: "Cash GiftCode <noreply@gccode.com>",
	// 		to: options.user.email,
	// 		subject: options.subject,
	// 		html: options.htmlContent,
	// 		text: options.textContent
	// 	};
	// 	sgMail.send(msg);
	// }
}
