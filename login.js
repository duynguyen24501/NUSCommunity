var mysql = require('mysql');

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

//////////////////////////////////////////////////////////////////
const pool = require('./dbconfig/dbconfig.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const nodemailer = require('nodemailer')
const nodemailerSmtpTransport = require('nodemailer-smtp-transport')
const nodemailerDirectTransport = require('nodemailer-direct-transport')

let nodemailerTransport = nodemailerDirectTransport()
if (process.env.EMAIL_SERVER && process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
  nodemailerTransport = nodemailerSmtpTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT || 25,
    secure: process.env.EMAIL_SECURE || true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

//////////////////////////////////////////////////////////////////
// Connect mySQL server
/*
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'duynguyen24501',
    database : 'users'
  });

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
*/

var app = express();
app.use(session({
	secret: 'secret',
	resave: false,
	cookie: { maxAge: 8*60*60*1000 },  // 8 hours
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

/////////////////////////////////////////////////////////////////////
// API for Login main page

// Get the login main page
app.get('/', function(req, res) {
    //res.sendFile(path.join(__dirname + '/login.html'));
    res.sendFile(path.join(__dirname + '/public/login.html'));
    app.use(express.static(path.join(__dirname, 'public')));
});

// Fill in users' information
/*
app.post('/auth', function(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	if (email && password) {
		connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
                req.session.email = email;
				res.redirect('/home');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Email and Password!');
		res.end();
	}
});
*/

app.post('/auth/login', async (req, res) => {
    const email = req.body.email;
	const password = req.body.password;
	
    if (email && password) {
      const results = await getUser(email)
      if (results[0][0]) {
        if (results[0][0].verified) {
          bcrypt.compare(password, results[0][0].password).then(function(response) {
            if (response == true) {
              req.session.loggedin = true
              req.session.email = email
              return res.json(req.session)
            } else {
              return res.json({message: 'Incorrect Password!'})
            }
          })
        } else {
          return res.json({message: 'User not verified'})
        }
      } else {
        return res.json({message: 'User not found'})
      }
    } else {
      return res.json({message: 'Please enter email and Password!'})
    }
  })

  async function getUser(email) {
    try {
      const results = await pool.query(`SELECT * FROM users WHERE email='${email}';`)
      return results
    } catch (e) {
      console.error(e)
    }
  }
///////////////////////////////////////////////////////////////////

// If login successfully
app.get('/home', function(req, res) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.email + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});

///////////////////////////////////////////////////////////////
// API for registration 
/*
app.get('/register', function(req,res) {
	res.send('Registration page');
	res.end();
})

app.post('/signup', function(req, res) {
	var newUser = {
		username : req.body.username,
		password : req.body.password,
		email : req.body.email,
	}

	connection.query("INSERT INTO users SET ?", newUser, function(err,result,fields) {
		if (err) throw err;
		res.send("Register successfully");
		res.end();
	});
})
*/

app.post('/auth/sign-up', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
	  const username = req.body.username;
	  console.log(email + "  " + password + " " + username);

    if (email && password && username) {
      bcrypt.hash(password, saltRounds).then(async function(hash) {
        const results = await addUser(email, hash, username)
        if (results && results.length > 0) {
          bcrypt.hash(email + hash, saltRounds).then(function(hash) {
            sendVerificationEmail(email, "http://" + req.headers.host + "/auth/verify?email=" + email + "&hash=" + hash)
          })
          return res.json({email: email})
        } else {
          return res.json({message: 'User already exists with email ' + email})
        }
      })
    } else {
      return res.json({message: 'Please enter email, Password and username!'})
    }
  })

  async function addUser(email, password, username) {
    try {
      const results = await pool.query(`INSERT INTO users (email, password, username) VALUES ("${email}", "${password}", "${username}");`)
      return results
    } catch (e) {
      console.error(e)
    }
  }

  function sendVerificationEmail(email, url) {
    nodemailer
    .createTransport(nodemailerTransport)
    .sendMail({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Verification',
      text: `Click on this link to verify:\n\n${url}\n\n`,
      html: `<p>Click on this link to verify:</p><p>${url}</p>`
    }, (err) => {
      if (err) {
        console.error('Error sending email to ' + email, err)
      }
    })
  }

  app.get('/auth/verify', async (req, res) => {
    var email = req.query.email
    var hash = req.query.hash
    if (email && hash) {
      const results = await getUser(email)
      if (results.length > 0) {
        bcrypt.compare(email + results[0][0].password, hash).then(async function(response) {
          if (response == true) {
            const results = await verifyUsers(email)
            if (results.length > 0) {
              res.sendFile(path.join(__dirname + '/public/success-verification.html'));
              app.use(express.static(path.join(__dirname, 'public')));
              return;
              //return res.redirect(`/callback?message=Email verified successfully. You can sign in now.`)
            } else {
              return res.redirect(`/callback?message=Email already verified. You can sign in now.`)
            }
          }
        })
      } else {
        return res.redirect(`/callback?message=User not found with email ` + email)
      }
    } else {
      return res.redirect(`/callback?message=Wrong query params.`)
    }
  })

  async function verifyUsers(email) {
    try {
      const results = await pool.query(`UPDATE users SET verified=true WHERE email='${email}';`)
      return results
    }catch(e){
      console.error(e)
    }
  }

////////////////////////////////////////////////////////////////
// API for forget-password
/*
app.get('/forgetpassword', function(req,res) {
	res.send('Forget-password page');
	res.end();
})

app.put('/forgetpw', function(req,res) {
	var email = req.body.email;
	var newPassword = req.body.new_password;

	if (email) {
		connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, results, fields) {
			if (err) throw err;
			if (results.length > 0) {
				req.session.email = email;
				console.log("This email exists in the database");
			} else {
				console.log("Here");
				res.send("The email is not found");
			}			
		});
	} else {
		return res.send('Please enter Email and New Password');
		//res.end();
	}

	let updateSql = "UPDATE users SET password = ? WHERE email = ?";
	let data = [newPassword, email];

	connection.query(updateSql, data, function(err,result,fields) {
		if (err) throw err;
		res.send("Changed password successfully");
		res.end();
	})
})
*/

app.post('/auth/forget-password', async (req,res) => {
	const email = req.body.email;
	const password = req.body.password;
	console.log(email + " " + password);
	if (email && password) {
		bcrypt.hash(password, saltRounds).then(async function(hash) {
		  const results = await updateUser(email, hash)
		  if (results && results.length > 0) {
			bcrypt.hash(email + hash, saltRounds).then(function(hash) {
			  sendVerificationEmail(email, "http://" + req.headers.host + "/auth/verify?email=" + email + "&hash=" + hash)
			})
			return res.json({email: email})
		  } else {
			return res.json({message: 'User does not exist with email ' + email})
		  }
		})
	  } else {
		return res.json({message: 'Please enter email and Password!'})
	  }
})

async function updateUser(email, password) {
    try {
	  const results = await pool.query(`UPDATE users SET password = "${password}" WHERE email = "${email}"`);
      return results
    } catch (e) {
      console.error(e)
    }
}

app.listen(3000);
