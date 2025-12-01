import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Nodemailer 設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 簡単な送信用フォーム（テスト用）
app.get("/", (req, res) => {
  res.send(`
    <form method="POST" action="/send">
      <input name="to" placeholder="送信先メール" required />
      <input name="subject" placeholder="件名" required />
      <textarea name="text" placeholder="本文" required></textarea>
      <button type="submit">送信</button>
    </form>
  `);
});

app.post("/send", async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    res.send("メール送信成功！");
  } catch (err) {
    console.error(err);
    res.send("送信エラー: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
