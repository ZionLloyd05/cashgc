const axios = require('axios');

export class Mail {
  public apiKey;

  constructor() {
    this.apiKey =
      '2763A8E885EB551BA0119A3A96FE1F40D760BC9807419611319DA1D3E56A4577C9BCD5D6EEB45E89963D018B82753766';
  }

  public async send(options: any): Promise<any> {
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
  }
}
