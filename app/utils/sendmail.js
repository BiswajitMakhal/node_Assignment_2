const transporter = require("../config/emailConfig");

const sendMail = async (user,generatedPassword) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Welcome to the Dashboard:your credentials",
      html: `
                <h3>Welcome! You have been added as a ${user.role}.</h3>
                <p>Your login credentials are:</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Password:</strong> ${generatedPassword}</p>
                <p>Please log in and change your password.</p>
            `,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMail;
