"use client";

import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const getToken = (): string | null => {
  return cookies.get("token") || null;
};

export const setToken = (token: string): void => {
  cookies.set("token", token);
};

export const logout = (): void => {
  cookies.remove("token", { path: "/" });
};

export const loginUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    setToken(data.token);
    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
};
