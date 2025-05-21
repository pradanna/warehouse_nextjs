// src/app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Gantilah logika berikut dengan pemeriksaan database yang sesuai
  const isValidUser =
    email === "admin@example.com" && password === "password123";

  if (isValidUser) {
    return NextResponse.json({ message: "Login successful", status: "ok" });
  } else {
    return NextResponse.json(
      { message: "Invalid credentials", status: "error" },
      { status: 401 }
    );
  }
}
