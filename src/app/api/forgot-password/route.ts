import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { ForgotPasswordInput } from "@/types";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: ForgotPasswordInput = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Email does not exist" },
        { status: 404 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const resetToken = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
 html: `
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return NextResponse.json(
      { message: "Password reset link sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}