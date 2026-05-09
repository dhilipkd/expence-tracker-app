import { auth } from "../config/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";

import {
  LoginPayload,
  SignupPayload,
  ForgotPasswordPayload,
} from "../types/auth.types";

/* ------------------------------------------ */
/* Response Type */
/* ------------------------------------------ */

export type ServiceResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

/* ------------------------------------------ */
/* Firebase Error Mapping */
/* ------------------------------------------ */

const firebaseErrorMap: Record<string, string> = {
  "auth/email-already-in-use": "Email already exists",
  "auth/invalid-email": "Invalid email address",
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Incorrect password",
  "auth/weak-password": "Password must be at least 6 characters",
  "auth/too-many-requests": "Too many attempts. Try again later",
  "auth/network-request-failed": "Network error. Check internet connection",
  "auth/invalid-credential": "Invalid email or password",
  "auth/missing-password": "Password is required",
  "auth/missing-email": "Email is required",
};

/* ------------------------------------------ */
/* Error Handler */
/* ------------------------------------------ */

const handleFirebaseError = (error: any): string => {
  if (!error?.code) {
    return "Something went wrong";
  }

  return (
    firebaseErrorMap[error.code] ||
    "Authentication failed"
  );
};

/* ------------------------------------------ */
/* Signup */
/* ------------------------------------------ */

export const signupUser = async (
  payload: SignupPayload
): Promise<ServiceResponse<User>> => {
  try {
    const { name, email, password } = payload;

    const response =
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
      });
    }

    return {
      success: true,
      message: "Account created successfully",
      data: response.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: handleFirebaseError(error),
    };
  }
};

/* ------------------------------------------ */
/* Login */
/* ------------------------------------------ */

export const loginUser = async (
  payload: LoginPayload
): Promise<ServiceResponse<User>> => {
  try {
    const { email, password } = payload;

    const response =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    return {
      success: true,
      message: "Login successful",
      data: response.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: handleFirebaseError(error),
    };
  }
};

/* ------------------------------------------ */
/* Forgot Password */
/* ------------------------------------------ */

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ServiceResponse> => {
  try {
    const { email } = payload;

    await sendPasswordResetEmail(
      auth,
      email.trim()
    );

    return {
      success: true,
      message: "Password reset email sent",
    };
  } catch (error: any) {
    return {
      success: false,
      message: handleFirebaseError(error),
    };
  }
};

/* ------------------------------------------ */
/* Logout */
/* ------------------------------------------ */

export const logoutUser = async (): Promise<ServiceResponse> => {
  try {
    await signOut(auth);

    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error: any) {
    return {
      success: false,
      message: handleFirebaseError(error),
    };
  }
};