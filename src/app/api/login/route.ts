import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { LoginInput, UserResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: LoginInput = await request.json();
    const { email, password } = body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Kiểm tra JWT_SECRET
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1h" }
    );

    // Trả về thông tin user (không bao gồm password)
    const userResponse: UserResponse = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar || undefined,
      role: user.role,
      token,
    };

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}