import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";

import { SafeAreaView } from "react-native-safe-area-context";


jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));


jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" }) // mock as granted
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({ coords: { latitude: 0, longitude: 0 } })
  ),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));


jest.mock("../firebase.js", () => ({
  db: {},
  auth: {
    onAuthStateChanged: (cb) => {
      cb({ uid: "user-123" });
      return jest.fn();
    },
  },
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

jest.mock("../components/MyMap", () => {
  return ({ onLocationSelect }) => null;
});

jest.mock("../components/ConfirmModal.jsx", () => {
  const { Text } = require("react-native"); // require inside
  return ({ visible, message }) => (visible ? <Text>{message}</Text> : null);
});


jest.mock("expo-image-picker", () => ({}));
jest.mock("expo-image-manipulator", () => ({}));

import { addDoc } from "firebase/firestore";
import { Text } from "react-native";

describe("AddEvent screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders form fields", () => {
    const { getByText, getByPlaceholderText } = render(<AddEvent />);

    expect(getByText("Emri Eventit")).toBeTruthy();
    expect(getByPlaceholderText("p.sh Coding Workshop")).toBeTruthy();
    expect(getByText("Shto Eventin")).toBeTruthy();
  });

  it("Shows validation error if required fields are missing", async () => {
    const { getByText } = render(<AddEvent />);

    fireEvent.press(getByText("Shto Eventin"));

    await waitFor(() => {
      expect(
        getByText("Ju lutemi plotesoni te gjitha fushat!")
      ).toBeTruthy();
    });
  });

  it("Creates event when form is valid", async () => {
    addDoc.mockResolvedValueOnce({ id: "event123" });

    const { getByPlaceholderText, getByText } = render(<AddEvent />);

    fireEvent.changeText(
      getByPlaceholderText("p.sh Coding Workshop"),
      "React Meetup"
    );
    fireEvent.changeText(
      getByPlaceholderText("p.sh FIEK, Prishtine"),
      "Prishtina"
    );
    fireEvent.changeText(
      getByPlaceholderText(
        "Pershkruaj detajet e eventit, agjenden, dhe speakers."
      ),
      "Meetup for React devs"
    );

    fireEvent.press(getByText("Shto Eventin"));

    await waitFor(() => {
        expect(addDoc).toHaveBeenCalled();
    });
  });


  it("locks event creation if date is in the past", async () => {
    const { getByText, getByPlaceholderText } = render(<AddEvent />);

    fireEvent.changeText(
      getByPlaceholderText("p.sh Coding Workshop"),
      "Old Event"
    );
    fireEvent.changeText(
      getByPlaceholderText("p.sh FIEK, Prishtine"),
      "Prishtina"
    );
    fireEvent.changeText(
      getByPlaceholderText(
        "Pershkruaj detajet e eventit, agjenden, dhe speakers."
      ),
      "Past event"
    );

    fireEvent.press(getByText("Shto Eventin"));

    await waitFor(() => {
      expect(addDoc).not.toHaveBeenCalled();
    });
  });
});
