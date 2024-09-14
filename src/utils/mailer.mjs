import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '889850b98f4819',
    pass: 'd032e52fa64ffb',
  },
});

export default transport;
