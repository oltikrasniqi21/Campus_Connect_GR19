jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  arrayRemove: jest.fn(),
}));

jest.mock("../firebase", () => ({
  auth: {
    currentUser: { uid: "test-user-123" },
  },
  db: {},
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import renderer, { act } from "react-test-renderer";
import QnACard from "../components/Homepage/Q&ACard";
const mockItem = {
  id: "q1",
  question: "Si mund te kontaktoj me administraten?",
  answers: [],
  upvotes: [],
  userId: "user1234",
  createdAt: Date.now(),
};

describe("Testimet per faqen Q&A", () => {
  it("Snapshot: Karta e pyetjeve duhet te dukej njesoj", () => {
    const tree = render(
      <QnACard
        item={mockItem}
        selectedQuestionId={null}
        newAnswer=""
        setSelectedQuestionId={jest.fn()}
        setNewAnswer={jest.fn()}
        handleAddAnswer={jest.fn()}
        editingId={null}
        editingText=""
        startEditing={jest.fn()}
        setEditingText={jest.fn()}
        saveEdit={jest.fn()}
        deleteQuestion={jest.fn()}
        handleUpvote={jest.fn()}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("Interaction: Duhet te therritet handleUpvote kur shtypet Like", () => {
    const mockUpvote = jest.fn();

    const { getByTestId } = render(
      <QnACard item={mockItem} handleUpvote={mockUpvote} />
    );

    fireEvent.press(getByTestId("upvote-btn"));
    expect(mockUpvote).toHaveBeenCalled();
  });

  it("Validation: Inputi i pergjigjes duhet te jete i qasshem vetem pas klikimit", () => {
    const { queryByPlaceholderText, getByText, rerender } = render(
      <QnACard
        item={mockItem}
        selectedQuestionId={null}
        setSelectedQuestionId={jest.fn()}
      />
    );

    expect(queryByPlaceholderText("Shkruaj Pergjigjen...")).toBeNull();

    fireEvent.press(getByText("Pergjigju"));

    rerender(
      <QnACard
        item={mockItem}
        selectedQuestionId={mockItem.id}
        setSelectedQuestionId={jest.fn()}
      />
    );

    expect(queryByPlaceholderText("Shkruaj Pergjigjen...")).toBeTruthy();
  });
});
