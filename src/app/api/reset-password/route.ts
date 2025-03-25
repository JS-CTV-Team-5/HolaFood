import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ResetPasswordInput } from "@/types";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: ResetPasswordInput = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET missing" },
        { status: 500 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret) as { id: string; email: string };
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);
    if (!user || user.email !== decoded.email) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log("New hashed password:", hashedPassword);

    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    const updatedUser = await User.findById(decoded.id);
    console.log("Updated user password:", updatedUser.password);

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset-password:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}