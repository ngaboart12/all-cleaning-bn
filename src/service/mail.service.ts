import nodemailer from "nodemailer";

type emailProps = {
  to: string;
  subject: string;
  body: string;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ngabosevelin@gmail.com",
    pass: "zpfx qisa azei pnki",
  },
});

export const sendOtp = async ({ to, subject, body }: emailProps) => {
  const mailOptions = {
    from: "ngabosevelin@gmail.com",
    to: to,
    subject: subject,
    text: body,
  };
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log("Error occurred:", error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

