"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
class Mail {
    constructor() {
        this.apiKey =
            '2763A8E885EB551BA0119A3A96FE1F40D760BC9807419611319DA1D3E56A4577C9BCD5D6EEB45E89963D018B82753766';
    }
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `https://api.elasticemail.com/v2/email/send?apikey=${this.apiKey}&subject=${options.subject}&from=${options.from}&fromName=${options.fromName}&sender=${options.from}&to=${options.to}&bodyHtml=${options.bodyHtml}&bodyText=${options.bodyText}`;
            axios({
                url,
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then(function (response) {
                console.log(response);
            })
                .catch(function (error) {
                console.log(error);
            });
        });
    }
}
exports.Mail = Mail;
//# sourceMappingURL=mail.js.map