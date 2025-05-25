import nodemailer from "nodemailer";

export const sendMail = async (
  email: string,
  mailSubject: string,
  content: string
) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "ritamislive9@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "Test",
      to: email,
      subject: mailSubject,
      html: content,
    };
    const info = await transport.sendMail(mailOptions);
    console.log("Mail sent successfully! ", info.response);
  } catch (error: any) {
    console.log("Error sending email: ", error.message);
  }
};
