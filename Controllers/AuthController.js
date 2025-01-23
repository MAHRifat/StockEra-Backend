const User = require("../model/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');

// Generate random verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000); // 6 digits
}

async function sendVerificationEmail(email, verificationCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'stockeratrade@gmail.com', // Your email
      pass: 'ysxo nagq aflk tgxy',   // Your email password or app password
    },
  });

  const mailOptions = {
    from: 'stockeratrade@gmail.com',
    to: email,
    subject: 'Email Verification Code',
    text: `Your verification code is: ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const verificationCode = generateVerificationCode();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(existingUser.isVerified);
      if (existingUser.isVerified) {
        return res.json({ message: "User already exists", verified: true });
      }
      else {
        return res.json({ message: "User already exists", verified: false });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hash pass signup: " + hashedPassword);
    const user = await User.create({ email, password: hashedPassword, verificationCode: verificationCode, username, createdAt });
    console.log(user);
    await sendVerificationEmail(email, verificationCode);
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};


module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: 'All fields are required' })
    }
    const user = await User.findOne({ email });
    if (user.isVerified == false) {
      return res.json({ message: "Email not verified!", verified: false });
    }

    if (!user) {
      return res.json({ message: 'Incorrect password or email' });
    }

    console.log("Stored Hashed Password:", user.password);  // Log the stored hashed password in DB

    // bcrypt.compare will compare the plain password with the stored hash
    const auth = await bcrypt.compare(password, user.password);
    console.log("Auth Result:", auth);  // Log the result of the comparison (true or false)

    if (!auth) {
      return res.json({ message: 'Incorrect password or email' });
    }

    console.log(user.username, user.password, user.email);

    const token = createSecretToken(user._id, user.username, user.email);
    console.log("genereate token ", token);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      secure: true,
      domain: ".web.app", // Shared across subdomains
      sameSite: "None",  // Required for cross-site cookies
    });
    console.log("Cookie set successfully");
    res.status(201).json({ 
      message: "User logged in successfully", 
      success: true,
      user: {
        name: user.username,
        email: user.email,
      },
     });
    next();

  } catch (error) {
    console.error(error);
  }
};