import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import { RegisterInput } from "@/types";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body: RegisterInput = await request.json();
    const { username, email, password, fullName } = body;

    // Kiểm tra các trường bắt buộc
    if (!username || !email || !password || !fullName) {
      return NextResponse.json(
        { error: "All fields (username, email, password, fullName) are required" },
        { status: 400 }
      );
    }

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }

    // Tạo user mới (mật khẩu sẽ được mã hóa tự động bởi pre-save hook trong UserSchema)
    const user = new User({ username, email, password, fullName });
    await user.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}