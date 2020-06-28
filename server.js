var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
const pool = require("./dbconfig/dbconfig.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const nodemailerSmtpTransport = require("nodemailer-smtp-transport");
const nodemailerDirectTransport = require("nodemailer-direct-transport");

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

var app = express();
app.use(
  session({
    secret: "secret",
    resave: false,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/auth/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email + " " + password);

  if (email && password) {
    const results = await getUser(email);
    if (results[0][0]) {
      if (results[0][0].verified) {
        bcrypt
          .compare(password, results[0][0].password)
          .then(function (response) {
            if (response == true) {
              req.session.loggedin = true;
              req.session.email = email;
              return res.json(req.session);
            } else {
              return res.json({ message: "Incorrect Password!" });
            }
          });
      } else {
        return res.json({ message: "User not verified" });
      }
    } else {
      return res.json({ message: "User not found" });
    }
  } else {
    return res.json({ message: "Please enter email and Password!" });
  }
});

async function getUser(email) {
  try {
    const results = await pool.query(
      `SELECT * FROM users WHERE email='${email}';`
    );
    return results;
  } catch (e) {
    console.error(e);
  }
}

/*
app.get("/home", function (req, res) {
  if (req.session.loggedin) {
    res.send("Welcome back, " + req.session.email + "!");
  } else {
    res.send("Please login to view this page!");
  }
  res.end();
});
*/

///////////////////////////////////////////////////////////////
// API for registration

app.post("/auth/signup", async (req, res) => {
  const email = req.body.email + "@u.nus.edu";
  const password = req.body.password;
  const username = req.body.username;
  console.log(email + "  " + password + " " + username);

  if (email && password && username) {
    bcrypt.hash(password, saltRounds).then(async function (hash) {
      const results = await addUser(email, hash, username);
      if (results && results.length > 0) {
        bcrypt.hash(email + hash, saltRounds).then(function (hash) {
          sendVerificationEmail(
            email,
            "http://" +
              req.headers.host +
              "/auth/verify?email=" +
              email +
              "&hash=" +
              hash
          );
        });
        return res.json({ email: email });
      } else {
        console.log("email exists already!!!");
        return res.json({ message: "User already exists with email " + email });
      }
    });
  } else {
    return res.json({ message: "Please enter email, Password and username!" });
  }
});

async function addUser(email, password, username) {
  try {
    const results = await pool.query(
      `INSERT INTO users (email, password, username) VALUES ("${email}", "${password}", "${username}");`
    );
    return results;
  } catch (e) {
    console.error(e);
  }
}

function sendVerificationEmail(email, url) {
  nodemailer.createTransport(nodemailerTransport).sendMail(
    {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "NUSCommunity Verification",
      text: `Thank you for your interest in NUSCommunity. Click on this link to verify:\n\n${url}\n\n`,
      html: `<p>Click on this link to verify:</p><p>${url}</p>`,
    },
    (err) => {
      if (err) {
        console.error("Error sending email to " + email, err);
      }
    }
  );
}

app.get("/auth/verify", async (req, res) => {
  var email = req.query.email;
  var hash = req.query.hash;
  if (email && hash) {
    const results = await getUser(email);
    if (results.length > 0) {
      bcrypt
        .compare(email + results[0][0].password, hash)
        .then(async function (response) {
          if (response == true) {
            const results = await verifyUsers(email);
            if (results.length > 0) {
              res.sendFile(
                path.join(
                  __dirname + "/client/public/success-verification.html"
                )
              );
              app.use(express.static(path.join(__dirname, "client/public")));
              return;
              //return res.json({ message: "Email verified successfully. You can sign in now." });
              //return res.redirect(`/callback?message=Email verified successfully. You can sign in now.`)
            } else {
              return res.redirect(
                `/callback?message=Email already verified. You can sign in now.`
              );
            }
          }
        });
    } else {
      return res.redirect(
        `/callback?message=User not found with email ` + email
      );
    }
  } else {
    return res.redirect(`/callback?message=Wrong query params.`);
  }
});

async function verifyUsers(email) {
  try {
    const results = await pool.query(
      `UPDATE users SET verified=true WHERE email='${email}';`
    );
    return results;
  } catch (e) {
    console.error(e);
  }
}

app.post("/auth/reset", async (req, res) => {
  const email = req.body.email + "@u.nus.edu";
  const password = req.body.password;
  console.log(email + " " + password);
  if (email && password) {
    bcrypt.hash(password, saltRounds).then(async function (hash) {
      const results = await updateUser(email, hash);
      if (results && results.length > 0) {
        bcrypt.hash(email + hash, saltRounds).then(function (hash) {
          sendVerificationEmail(
            email,
            "http://" +
              req.headers.host +
              "/auth/verify?email=" +
              email +
              "&hash=" +
              hash
          );
        });
        return res.json({ email: email });
      } else {
        return res.json({ message: "User does not exist with email " + email });
      }
    });
  } else {
    return res.json({ message: "Please enter email and Password!" });
  }
});

async function updateUser(email, password) {
  try {
    const results = await pool.query(
      `UPDATE users SET password = "${password}" WHERE email = "${email}"`
    );
    return results;
  } catch (e) {
    console.error(e);
  }
}
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
