const nodemailer = require("nodemailer");
const nodemailerSmtpTransport = require("nodemailer-smtp-transport");
const nodemailerDirectTransport = require("nodemailer-direct-transport");

// Send email verification preprocess
let nodemailerTransport = nodemailerDirectTransport();
if (
  process.env.EMAIL_SERVER &&
  process.env.EMAIL_USERNAME &&
  process.env.EMAIL_PASSWORD
) {
  nodemailerTransport = nodemailerSmtpTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT || 25,
    secure: process.env.EMAIL_SECURE || true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

function sendVerificationEmail(email, url) {
    nodemailer.createTransport(nodemailerTransport).sendMail(
      {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: "NUSCommunity Verification",
        text: `Click on this link to verify:\n\n${url}\n\n`,
        html: `<p>Thank you for your interest in NUSCommunity. Click on this link to verify:</p><p>${url}</p>`,
      },
      (err) => {
        if (err) {
          console.error("Error sending email to " + email, err);
        }
      }
    );
  }

  sendVerificationEmail('e0313562@u.nus.edu', 'google.com');
  console.log('done');