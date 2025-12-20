import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

jest.mock("react-native/Libraries/Lists/FlatList", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    default: ({ data, renderItem }) => (
      <View testID="flat-list-mock">
        {data.map((item, index) => (
          <React.Fragment key={item.id || index}>
            {renderItem({ item, index })}
          </React.Fragment>
        ))}
      </View>
    ),
  };
});


jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    Ionicons: () => <View />,
    FontAwesome: () => <View />,
  };
});


jest.mock("../components/Homepage/flashcards.jsx", () => {
  const { View } = require("react-native");
  return {
    Flashcard: () => <View />,
  };
});


const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));


jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user-id" },
    loading: false,
  }),
}));


const mockSetDoc = jest.fn();
const mockDeleteDoc = jest.fn();

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(() => "mock-doc-ref"), 
  query: jest.fn(),
  where: jest.fn(),
  setDoc: (...args) => mockSetDoc(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
  onSnapshot: (query, callback) => {
    callback({
      docs: [
        {
          id: "folder-1",
          data: () => ({ name: "Professor Folder", createdBy: "test-user-id" }),
        },
      ],
    });
    return jest.fn(); 
  },
  db: {}, 
}));

jest.mock("../firebase", () => ({
  db: {},
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg) => {
    if (msg.includes("VirtualizedList") || msg.includes("update to Icon")) return;
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

import SavedPosts from "../app/SavedPosts";

describe("SavedPosts Component", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly (snapshot)", async () => {
    const tree = render(<SavedPosts />);
    await waitFor(() => tree.getByText("Professor Folder"));
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("displays the folder from Firestore", async () => {
    const { getByText } = render(<SavedPosts />);
    await waitFor(() => {
      expect(getByText("Professor Folder")).toBeTruthy();
    });
  });

  it("opens the Edit Modal when 'Edit' is pressed", async () => {
    const { getByText, getByPlaceholderText } = render(<SavedPosts />);
    await waitFor(() => getByText("Edit"));
    
    fireEvent.press(getByText("Edit"));
    
    await waitFor(() => {
      expect(getByPlaceholderText("Folder name")).toBeTruthy();
    });
  });

  it("renames a folder (Form Completion)", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SavedPosts />);

    await waitFor(() => getByText("Edit"));
    fireEvent.press(getByText("Edit"));

    const input = getByPlaceholderText("Folder name");
    fireEvent.changeText(input, "New Folder Name");

    fireEvent.press(getByTestId("rename-folder-button"));

    await waitFor(() => {
      expect(mockSetDoc).toHaveBeenCalledWith(
        "mock-doc-ref", 
        expect.objectContaining({ name: "New Folder Name" })
      );
    });
  });

  it("deletes a folder", async () => {
    const { getByText, getByTestId } = render(<SavedPosts />);

    await waitFor(() => getByText("Edit"));
    fireEvent.press(getByText("Edit"));

    fireEvent.press(getByTestId("delete-folder-button"));

    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalledWith("mock-doc-ref");
    });
  });

  it("navigates when folder is clicked", async () => {
    const { getByText } = render(<SavedPosts />);
    
    await waitFor(() => getByText("Professor Folder"));
    fireEvent.press(getByText("Professor Folder"));
    
    expect(mockPush).toHaveBeenCalledWith("/SavedFolder/folder-1");
  });
});