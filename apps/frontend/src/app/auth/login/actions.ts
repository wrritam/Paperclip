"use server";

import { cookies } from 'next/headers';

interface LoginResponse {
  exists: boolean;
  success: boolean;
  message: string;
  token: string | null;
}

export async function loginAction(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();

    if (response.ok && data.success && data.token) {
      (await cookies()).set('paperclip_login', data.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 });
    }


    return data;

  } catch (error) {
    console.error("Login failed in server action:", error);
    return {
      exists: false,
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      token: null,
    };
  }
}
