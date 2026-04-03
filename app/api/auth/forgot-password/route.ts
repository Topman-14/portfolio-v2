import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import {
  isPasswordResetEmailConfigured,
  sendPasswordResetEmail,
} from "@/lib/email";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === "string" ? body.email : "";

    if (!rawEmail.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!isPasswordResetEmailConfigured()) {
      return NextResponse.json(
        {
          error:
            "Password reset email is not configured on this server. Contact the administrator.",
        },
        { status: 503 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: { equals: rawEmail.trim(), mode: "insensitive" },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account exists for this email address." },
        { status: 404 }
      );
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      },
    });

    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (sendError) {
      await prisma.passwordResetToken.delete({ where: { token } });
      console.error("Forgot password send mail error:", sendError);
      return NextResponse.json(
        {
          error:
            "We could not send the reset email. Try again later or contact support.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        message:
          "We sent a password reset link to your email. Check your spam folder if you do not see it.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

