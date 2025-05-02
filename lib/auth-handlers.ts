"use client";

import { Cookies } from "react-cookie";

const cookies = new Cookies();

// Get the authentication token from cookies
export const getToken = (): string | null => {
  return cookies.get("token") || null;
};

// Set the authentication token in cookies
export const setToken = (token: string): void => {
  cookies.set("token", token);
};

// Remove the authentication token from cookies (logout)
export const logout = (): void => {
  cookies.remove("token", { path: "/" });
};

// Send login request and store token if successful
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

// Send registration request
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
