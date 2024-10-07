import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

import { config } from "dotenv";
import { Prisma } from "@prisma/client";
import { json } from "stream/consumers";
import { createProvider, createServiceData } from "../service/provider.service";
import { sendOtp } from "../service/mail.service";
const prisma = require("../../prisma/prisma");

config();

const router = express.Router();

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const send_otp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const send = await prisma.otps.create({
      data: {
        email: email,
        code: otpCode.toString(),
        expires: expiresAt,
      },
    });
    if (!send) {
      return res.status(400).json({ message: "Failed to send OTP" });
    }
    await sendOtp({
      to: email,
      subject: "Verification code",
      body: `${otpCode}`,
    });

    return res.status(200).json({ message: "Otp sent successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verify_otp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const otpCode = Array.isArray(otp) ? otp.join('') : otp;
    const otps = await prisma.otps.findUnique({ where: { email: email } });
    if (!otps) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpCode !== otps.code) {
      return res.status(400).json({ message: "Incorrect otp" });
    }
    if( otps.expires < new Date()){
      await prisma.otps.delete({ where: { email: email } });
      return res.status(400).json({ message: "OTP was expired" });

    }
    await prisma.otps.delete({ where: { email: email } });
    return res.status(200).json({ message: "Otp verifcation sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, phone_number, password, role, state, city } = req.body;
  const {
    companyName,
    companyBio,
    companyLogo,
    companyEmail,
    files,
    servicesData,
  } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone_number,
        password: hashedPassword,
        role,
        state,
        city,
      },
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    if (role === "PROVIDER") {
      const provider = await createProvider({
        companyName,
        companyBio,
        companyLogo,
        companyEmail,
        files,
        userId: user.id,
      });

      await createServiceData({ servicesData, provider });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      });
    }

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err: any) {
    console.log(err)
    switch (err.code) {
      default:
        return res.status(500).json({ message: "Something get wrong" });
    }
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out successfully." });
};

export default router;
