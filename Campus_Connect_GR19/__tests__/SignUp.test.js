import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Signup from "../app/(auth)/signup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { router } from "expo-router";

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("../firebase", () => ({
  auth: {},
  db: {},
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

describe("Signup Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields and buttons", () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);

    expect(getByPlaceholderText("First Name")).toBeTruthy();
    expect(getByPlaceholderText("Last Name")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByPlaceholderText("Confirm Password")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it("shows error when fields are empty", () => {
    const { getByText } = render(<Signup />);

    fireEvent.press(getByText("Sign Up"));

    expect(getByText("All fields are required.")).toBeTruthy();
  });

  it("shows error for invalid first name", () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText("First Name"), "A1");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Smith");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "123456");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "123456");

    fireEvent.press(getByText("Sign Up"));

    expect(
      getByText("First name must contain only letters and no numbers.")
    ).toBeTruthy();
  });

  it("shows error when passwords do not match", () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText("First Name"), "John");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "123456");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "12345");

    fireEvent.press(getByText("Sign Up"));

    expect(getByText("Passwords do not match.")).toBeTruthy();
  });

  it("shows loading text while creating account", async () => {
    createUserWithEmailAndPassword.mockImplementation(
      () => new Promise(() => {})
    );

    const { getByPlaceholderText, getByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText("First Name"), "John");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "123456");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "123456");

    fireEvent.press(getByText("Sign Up"));

    expect(getByText("Creating account...")).toBeTruthy();
  });

  it("creates user and shows success modal", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "123", email: "test@test.com" },
    });

    const { getByPlaceholderText, getByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText("First Name"), "John");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "123456");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "123456");

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(getByText("Account Created 🎉")).toBeTruthy();
    });

    expect(setDoc).toHaveBeenCalled();
  });

  it("navigates to login when Continue is pressed", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "123", email: "test@test.com" },
    });

    const { getByPlaceholderText, getByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText("First Name"), "John");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "123456");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "123456");

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(getByText("Continue")).toBeTruthy();
    });

    fireEvent.press(getByText("Continue"));

    expect(router.replace).toHaveBeenCalledWith("/login");
  });

  it("shows error when email already exists", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/email-already-in-use",
    });

    const { getByPlaceholderText, getByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText("First Name"), "John");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "123456");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "123456");

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(getByText("Email already exists.")).toBeTruthy();
    });
  });

  it("navigates to login when Log In link is pressed", () => {
    const { getByText } = render(<Signup />);

    fireEvent.press(getByText(/Log In/i));

    expect(router.push).toHaveBeenCalledWith("/login");
  });
});
