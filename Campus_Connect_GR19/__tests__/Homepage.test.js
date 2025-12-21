import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Homepage from "../app/(tabs)/Home.jsx"; 
import FlashCard from "../components/Homepage/flashcards.jsx";
import { Text } from "react-native";

jest.mock("../context/AuthContext.js", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../firebase", () => ({
  db: {},
  auth: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  orderBy: jest.fn(),
  query: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock("../app/notifications", () => ({
  registerLocalNotifications: jest.fn(),
  newEventAdded: jest.fn(),
}));

import { useAuth } from "../context/AuthContext";
import { onSnapshot } from "firebase/firestore";
import { registerLocalNotifications } from "../app/notifications";

const mockUser = {
  id: "user123",
  firstname: "Filan",
  lastname: "Fisteku",
  email:"filan@gmail.com"
};

const mockEvents = [
  {
    publisherId: "user123",
    createdAt: { toDate: () => new Date() },
    description: "A cool event",
    title: "Hackathon",
    date: { toDate: () => new Date("2025-01-01") },
    time: { toDate: () => new Date("2025-01-01T10:00:00") },
    location: "Prishtina",
  },
];


describe("Homepage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("Shows loading state", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    const { getByText } = render(<Homepage />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("Shows welcome screen when user is not logged in", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    const { getByText } = render(<Homepage />);
    expect(getByText("Welcome, User")).toBeTruthy();
  });


  it("Interaction: Registers local notifications on mount", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(<Homepage />);
    expect(registerLocalNotifications).toHaveBeenCalled();
  });
});
