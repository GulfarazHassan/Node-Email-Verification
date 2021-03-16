const express = require("express");
const firebase = require("./firebase");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());
var port = process.env.PORT || 8080;

app.post("/getcode", async (req, res) => {
  let email = req.body.email;
  if (!email) {
    res.json({ success: false, message: "Please provide an email" });
    return;
  }
  let code = Math.floor(1000 + Math.random() * 9000);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: "promptedly@gmail.com",
      pass: "Promptedly123",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  transporter
    .sendMail({
      from: "promptedly@gmail.com", // sender address
      to: `${email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>Thank you for registration on Promptedly.</b><b>Your verification code is ${code}</b>`, // html body
    })
    .then((e) => {
      firebase
        .firestore()
        .collection("VerificationCode")
        .doc(email)
        .set({ verificationCode: code }, { merge: true })
        .then((data) => {
          res.json({ success: true, verificationCode: code });
        });
    })

    .catch((e) => res.json({ success: false }));
});

app.post("/verify", async (req, res) => {
  let code = req.body.code;
  let email = req.body.email;
  if (!email) {
    res.json({ success: false, message: "Please provide an email" });
    return;
  }
  if (!code) {
    res.json({ success: false, message: "Please provide an code" });
    return;
  }

  const getCode = await firebase
    .firestore()
    .collection("VerificationCode")
    .doc(email)
    .get();
  let details = getCode.data();
  if (details) {
    if (details.verificationCode === code) {
      res.json({ success: true, message: "Code matched successfully" });
    } else {
      res.json({ success: false, message: "Code did not match" });
    }
  } else {
    res.json({ success: false, message: "Record didnot exist" });
  }
});

app.listen(port, () => console.log(`App is connected ... ${port}`));
