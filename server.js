// Declare necessary modules/packages/libraries
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

// Check MySQL connection
var db_connected = true;
pool.getConnection(function (err, connection) {
  if (connection.state === "disconnected") {
    db_connected = false;
  }
});

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

// Calling express to write APIs
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

// Check 8080 server
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

/////////////////////////////////////////////
// Login APIs
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

// Get particular user in database
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

///////////////////////////////////////////////////////////////
// Registration APIs
app.post("/auth/signup", async (req, res) => {
  const email = req.body.email + "@u.nus.edu";
  const password = req.body.password;
  const username = req.body.username;
  if (password.length < 6)
    return res.json({ message: "Password has to be as least 6 characters" });
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
      } else if (db_connected) {
        console.log("email exists already!!!");
        return res.json({ message: "User already exists with email " + email });
      } else {
        return res.json({ message: "Database server not connected" });
      }
    });
  } else {
    return res.json({ message: "Please enter email, Password and username!" });
  }
});

// Add particular user in database
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

// Sending email verification function
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

/////////////////////////////////////////////
// Verification APIs
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
              return res.json({
                message: "Email already verified. You can sign in now.",
              });
            }
          }
        });
    } else {
      return res.json({ message: "User not found with email `" + email });
      //return res.redirect(`/callback?message=User not found with email ` + email);
    }
  } else {
    return res.json({ message: "Wrong query params." });
    //return res.redirect(`/callback?message=Wrong query params.`);
  }
});

// Verify user for authentication
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

/////////////////////////////////////////////
// Reset password APIs
app.post("/auth/reset", async (req, res) => {
  const email = req.body.email + "@u.nus.edu";
  const password = req.body.password;
  if (password.length < 6)
    return res.json({ message: "Password has to be as least 6 characters" });
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

        try {
          const results = await pool.query(
            `UPDATE users SET verified=false WHERE email='${email}';`
          );
        } catch (e) {
          console.error(e);
        }

        return res.json({ email: email });
      } else {
        return res.json({ message: "User does not exist with email " + email });
      }
    });
  } else {
    return res.json({ message: "Please enter email and Password!" });
  }
});

// Update particular user's password in database
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

////////////////////////////////////////
// Sign-out APIs
app.get("/auth/signout", (req, res) => {
  if (req.session && req.session.loggedin) {
    req.session.destroy();
    return res.json({ message: "Logout successfully!" });
    //res.redirect(`/callback?message=Successfully signed out.`)
  } else {
    return res.json({ message: "You need to login first!" });
    //res.redirect(`/callback?message=You need to login first.`)
  }
});

////////////////////////////////////////
// All users' session APIs
app.get("/auth/session", (req, res) => {
  if (req.session) {
    return res.json(req.session);
  } else {
    return res.status(403);
  }
});

/////////////////////////////////////////////
// Necessary users' session APIs
app.get("/auth/check-session", async (req, res) => {
  if (req.session && req.session.loggedin) {
    const results = await getUser(req.session.email);
    if (results[0][0]) {
      return res.json({
        loggedin: true,
        email: req.session.email,
        username: results[0][0].username,
        points: results[0][0].points,
        bio: results[0][0].bio || "",
      });
    }
  } else {
    return res.json({
      loggedin: false,
    });
  }
});

//////////////////////////////////////////////
// PROFILE APIs
app.get("/auth/profile", async (req, res) => {
  if (req.session && req.session.loggedin) {
    const results = await getUser(req.session.email);
    if (results[0][0]) {
      return res.json({
        username: results[0][0].username || "",
        // address: results[0][0].address || ''
      });
    } else {
      return res.status(500);
    }
  } else {
    return res.status(403);
  }
});

/////////////////////////////////////////////////////
// Update new information of the user
app.post("/auth/updateProfile", async (req, res) => {
  if (req.session && req.session.loggedin) {
    const results = await updateUserProfile(req.body, req.session.email);
    if (results && results.length > 0) {
      return res.json({ ok: true });
    } else {
      return res.status(500);
    }
  } else {
    return res.status(403);
  }
});

async function updateUserProfile(body, email) {
  try {
    const results = await pool.query(
      `UPDATE users SET bio='${body.bio}' WHERE email='${email}';`
    );
    return results;
  } catch (e) {
    console.error(e);
  }
}

////////////////////////////////////////////////////
// Delete account
app.get("/auth/deleteAccount", async (req, res) => {
  if (req.session && req.session.loggedin) {
    //console.log("delete account backend here!")
    const results = await deleteUsers(req.session.email);
    if (results.length > 0) {
      req.session.destroy();
      return res.json({ message: "Account deleted successfully." });
      //res.redirect(`/callback?message=Account deleted successfully.`)
    } else {
      return res.json({
        message: "There was some problem deleting your account.",
      });
      //res.redirect(`/callback?message=There was some problem deleting your account.`)
    }
  } else {
    return res.json({ message: "First Sign in to delete your account." });
    //res.redirect(`/callback?message=First Sign in to delete your account.`)
  }
});

async function deleteUsers(email) {
  try {
    const results = await pool.query(
      `DELETE FROM users WHERE email='${email}';`
    );
    return results;
  } catch (e) {
    console.error(e);
  }
}


////////////////////////////////////////////////////////////////
// FORUM APIs

// Add posts
app.post('/forum/add-post', async (req,res) => {
  const web_id = req.body.id;
  const title = req.body.title;
  const content = req.body.msg;
  const email = req.session.email;
  const time_start = req.body.time;
  const tags = req.body.tags;

  var user_id;
  var check_add_post;
  var check_add_hashtag;

  if (email) {
    const userResult = await getUsernameBasedOnEmail(email);
    if (userResult && userResult.length > 0) {
      user_id = userResult[0][0].id;
    }
  }

  if (web_id && title && content && user_id && time_start) {
    const addPostResult = await addPost(web_id,title,content,user_id,time_start);
    if (addPostResult && addPostResult.length > 0) {
      //var post_id = results[0][0].post_id;
      check_add_post = true;
    } else {
      check_add_post = false;
    }
  }

  if (tags) {
    const addHashtagResult = await addHashtag(web_id, tags);
    if (addHashtagResult && addHashtagResult.length > 0) {
      check_add_hashtag = true;
    } else {
      check_add_hashtag = false;
    }
  }

  if (check_add_post && check_add_hashtag) {
    return res.json({message: "Success"});
  } else {
    return res.json({message: "Fail"});
  }
})

async function getUsernameBasedOnEmail(email) {
  try {
    const result = await pool.query(
      `SELECT id FROM users WHERE email = "${email}";`
    );
    return result;
  } catch (e) {
    console.error(e);
  }
}

async function addPost(web_id, title, content, user_id, time_start) {
  try {
    console.log("inside addPost function");
    const result = await pool.query(
      `INSERT INTO post (web_id, user_id, title, content, time_start) VALUES 
      ("${web_id}",
      "${user_id}",
      "${title}",
      "${content}", 
      "${time_start}"
      );`
    );
    return result;
  } catch (e) {
    console.error(e);
  }
}

async function addHashtag(web_id, tags) {
  try {
    var result;
    for(var i=0; i<tags.length; i++) {
      result = await pool.query(
        `INSERT INTO hashtag (web_id, hashtag_name) VALUES ("${web_id}","${tags[i]}");`
      )
    }
    return result;
  } catch (e) {
    console.error(e);
  }
}


// Edit posts
app.post('/forum/edit-post', async (req, res) => {
  const web_id = req.body.id;
  const title = req.body.title;
  const content = req.body.msg;
  const email = req.session.email;
  const time_start = req.body.time;
  const tags = req.body.tags;

  var user_id;
  var check_update_post;
  var check_update_hashtag;

  // check username is the same as the ones who post
  // if (web_id && username) {
  //   const usernameResult = await getUsernameBasedOnWebID(web_id);
  //   if (usernameResult[0][0].username != username) {
  //     return res.json({message: "You are not allowed to edit this post!"})
  //   }
  // } else {
  //   return res.json({message: "Error!"})
  // }

  if (email) {
    const userResult = await getUsernameBasedOnEmail(email);
    if (userResult && userResult.length > 0) {
      user_id = userResult[0][0].id;
    }
  }

  // update if it's the same (post and hashtags table)
  if (web_id && title && content) {
    const updatePostResult = await updatePost(web_id, title, content);
    if (updatePostResult.length > 0) {
      check_update_post = true;
    } else {
      check_update_post = false;
    }
  }

  if (tags) {
    const deleteOldTagsResult = await deleteOldTags(web_id);
    const updateHashtagResult = await addHashtag(web_id, tags);
    if (deleteOldTagsResult.length > 0 && updateHashtagResult.length > 0) {
      check_update_hashtag = true;
    } else {
      check_update_hashtag = false;
    }
  }
  
  if (check_update_post && check_update_hashtag) {
    return res.json({message: "Success"})
  }
  return res.json({message: "Fail"})
})

async function getUsernameBasedOnWebID(web_id) {
  try {
    const results = await pool.query(
      `SELECT username FROM users WHERE id = 
                                      (SELECT user_id 
                                      FROM post
                                      WHERE web_id = "${web_id}");`);
    return results;
  } catch (e) {
    console.error(e);
  }
}

async function updatePost(web_id, title, content) {
  try {
    const results = await pool.query(
      `UPDATE post SET title = "${title}", content = "${content}" WHERE web_id = "${web_id}";`
    );
    return results;
  } catch (e) {
    console.error(e);
  }
}

async function deleteOldTags(web_id) {
  try {
    const results = await pool.query(
      `DELETE FROM hashtag WHERE web_id="${web_id}";`
    );
    return results;
  } catch (e) {
    console.error(e);
  }
}

// Add comment
app.post('/forum/add-comment', async (req, res) => {
  const post_web_id = req.body.post_web_id;
  const comment_web_id = req.body.comment_web_id;
  const username = req.body.username;
  const value = req.body.value;
  const time = req.body.time;

  if (post_web_id && username && comment_web_id && value && time) {
    const addCommentResult = await addComment(post_web_id, comment_web_id, username, value, time);
    if (addCommentResult.length>0) {
      return res.json({message: 'Success'})
    } else {
      return res.json({message: 'Fail'})
    }
  }
}) 

async function addComment(post_web_id, comment_web_id, username, value, time) {
  try {
    const results = await pool.query(
      `INSERT INTO comment (post_web_id,comment_web_id,username,value,time) VALUES 
      ("${post_web_id}",
        "${comment_web_id}",
        "${username}",
        "${value}",
        "${time}");`
    )
    return results;
  } catch (e) {
      console.error(e);
  }
}

// Delete comment
app.post('/forum/delete-comment', async (req, res) => {
  const post_web_id = req.body.post_web_id;
  const comment_web_id = req.body.comment_web_id;
  
  console.log("post_web_id: " + post_web_id);
  console.log("comment_web_id: " + comment_web_id)
  if (post_web_id && comment_web_id) {
    const deleteCommentResult = await deleteComment(post_web_id, comment_web_id);
    if (deleteCommentResult.length>0) {
      return res.json({message: 'Success'})
    } else {
      return res.json({message: 'Fail'})
    }
  }
}) 

async function deleteComment(post_web_id, comment_web_id) {
  try {
    const results = await pool.query(
      `DELETE FROM comment WHERE post_web_id = "${post_web_id}" and comment_web_id = "${comment_web_id}";`
    )
    return results;
  } catch (e) {
      console.error(e);
  }
}

// Get all comments
app.post('/forum/display-comment', async (req, res) => {
  const post_web_id = req.body.id.id;
  const getCommentResult = await getComments(post_web_id);
  if (getCommentResult.length > 0) {
    return res.json(getCommentResult[0]);
  } else {
    return res.json({message: 'Fail'});
  }
})

async function getComments(post_web_id) {
  try {
    const results =  await pool.query(
      `SELECT * FROM comment WHERE post_web_id = ${post_web_id};`
    )
    return results;
  } catch (e) {
    console.log(e);
  }
}

// DELETE post
app.post('/forum/delete-post', async(req, res) => {
  const web_id = req.body.id;
  if (web_id) {
    const deletePostResult = await deletePost(web_id);
    if (deletePostResult.length > 0) {
      return res.json({message: "Success"});
    } else {
      return res.json({message: "Fail"})
    }
  } else {
    return res.json({message: "Fail"})
  }
})

async function deletePost(web_id) {
  try {
    const result1 = await pool.query(
      `DELETE FROM post WHERE web_id = "${web_id}";`, 
      //`DELETE FROM hashtag WHERE web_id = "${web_id}";`, 
      //`DELETE FROM comment WHERE post_web_id = "${web_id}";`
    );
    const result2 = await pool.query(
      `DELETE FROM hashtag WHERE web_id = "${web_id}";`
    );
    const result3 = await pool.query(
      `DELETE FROM comment WHERE post_web_id = "${web_id}";`
    )
    return result1;
  } catch (e) {
    console.error(e);
  }
}

// Display number of likes
app.post('/forum/display-like', async (req, res) => {
  const post_web_id = req.body.id.id;
  const getLikesResult = await getLikes(post_web_id);
  if (getLikesResult.length > 0) {
    return res.json({num_likes: getLikesResult[0][0].num_likes});
  } else {
    return res.json({message: 'Fail'});
  }
})

async function getLikes(post_web_id) {
  try {
    const results =  await pool.query(
      `SELECT num_likes FROM post WHERE web_id = ${post_web_id};`
    )
    return results;
  } catch (e) {
    console.log(e);
  }
}

app.post('/forum/display-state-like', async (req, res) => {
  const post_web_id = req.body.id.id;
  const email = req.session.email;
  const getStateLikeResult = await getStateLike(post_web_id,email);
  if (getStateLikeResult[0][0]) {
    if (getStateLikeResult[0][0].liked === 1) {
      return res.json({message: "Liked"});
    } else {
      return res.json({message: 'No'});
    }
  } else {
    return res.json({message: 'No'});
  }
})

async function getStateLike(post_web_id,email) {
  try {
    const results =  await pool.query(
      `SELECT liked FROM react WHERE post_web_id = "${post_web_id}" and email="${email}";`
    )
    return results;
  } catch (e) {
    console.log(e);
  }
}

app.post('/forum/add-state-like', async (req, res) => {
const post_web_id = req.body.web_id;
const liked = !req.body.liked;
const email = req.session.email;
const num_likes = req.body.num_likes;
console.log("num_likes: " +  num_likes);

const updateNumLikeResult = await updateNumLike(post_web_id, num_likes);
// if (updateNumLikeResult.length > 0) {
//   console.log("Update success");
// }

const getStateLikeResult = await getStateLike(post_web_id,email);
if (getStateLikeResult[0][0]) {
  console.log("Update here");
  const updateStateLikeResult = await updateStateLike(post_web_id,email,liked ? 1 : 0);
  // if (updateStateLikeResult.length > 0) {
  //   return res.json({message: 'Success'});
  // } else {
  //   return res.json({message: 'Fail'});
  // }
} else {
  const addStateLikeResult = await addStateLike(post_web_id,email,liked ? 1 : 0);
  // if (addStateLikeResult.length > 0) {
  //   return res.json({message: 'Success'});
  // } else {
  //   return res.json({message: 'Fail'});
  // }
}
})

async function updateNumLike(post_web_id, num_likes) {
  try {
    const result = await pool.query(
      `UPDATE post SET num_likes="${num_likes}" WHERE web_id = "${post_web_id}";`
    )
    return result;
  } catch (e) {
    console.error(e);
  }
}

async function addStateLike(post_web_id,email,liked) {
  try {
    const result = await pool.query(
      `INSERT INTO react (post_web_id,email,liked) VALUES 
      ("${post_web_id}","${email}","${liked}");`
    )
    return result;
  } catch (e) {
    console.error(e);
  }
}

async function updateStateLike(post_web_id,email,liked) {
  try {
    const result = await pool.query(
      `UPDATE react SET liked = "${liked}" 
      WHERE post_web_id = "${post_web_id}" and email = "${email}";`
    )
    return result;
  } catch (e) {
    console.error(e);
  }
}

////////////////////////////////////////
// Keep APIs
app.post('/keep/add-note', async(req,res) => {
  const email = req.session.email;
  const title = req.body.title;
  const content = req.body.content;
  console.log(email);
  console.log(title);
  console.log(content);
  const addNoteResult = await addNote(email, title, content);
  if (addNoteResult.length>0){
    return res.json({message: 'Success'});
  } else {
    return res.json({message:'Fail'});
  }
})


async function addNote(email,title,content) {
  try {
    const result = await pool.query(
      `INSERT INTO keep (email,title,content) VALUES("${email}","${title}","${content}"); `
    )
    return result;
  } catch (e) {
    console.error(e);
  }
}


app.post('/keep/delete-note', async(req,res) => {
  const email = req.session.email;
  const title = req.body.title;
  const content = req.body.content;
  console.log(email);
  console.log(title);
  console.log(content);
  const deleteNoteResult = await deleteNote(email, title, content);
  if (deleteNoteResult.length>0){
    return res.json({message: 'Success'});
  } else {
    return res.json({message:'Fail'});
  }
})


async function deleteNote(email,title,content) {
  try {
    const result = await pool.query(
      `DELETE FROM keep WHERE email="${email}" and title="${title}" and content="${content}";`
    )
    return result;
  } catch (e) {
    console.error(e);
  }
}

app.get("/keep/display-notes", async (req, res) => {
  const email = req.session.email;
  if (email) {
    const getNotesResult = await getNotes(email);
    if (getNotesResult[0]) {
      return res.json(getNotesResult[0]);
    } else {
      return res.json({message:'Fail'})
    }
  }
})

async function getNotes(email) {
  try {
    const result = await pool.query(
      `SELECT * FROM keep WHERE email="${email}";`
    )
    return result;
  } catch (e) {
    console.error(e);
  }
}


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
