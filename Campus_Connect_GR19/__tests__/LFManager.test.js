jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");

  const MockIcon = () => <View />;

  return {
    Ionicons: MockIcon,
    FontAwesome: MockIcon,
    FontAwesome5: MockIcon,
    MaterialIcons: MockIcon,
    MaterialCommunityIcons: MockIcon,
    AntDesign: MockIcon,
    Entypo: MockIcon,
    EvilIcons: MockIcon,
    Feather: MockIcon,
    Foundation: MockIcon,
    Octicons: MockIcon,
    SimpleLineIcons: MockIcon,
    Zocial: MockIcon,
    isto: MockIcon,
    createIconSet: () => MockIcon,
    createIconSetFromFontello: () => MockIcon,
    createIconSetFromIcoMoon: () => MockIcon,
  };
});

import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("../firebase", () => ({
  db: {},
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user-123" },
    loading: false,
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: (_ref, cb) => {
    cb({
      docs: [],
      forEach: () => {},
    });
    return jest.fn();
  },
}));

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

import LFManager from "../components/LFManager";

describe("LFManager Snapshot", () => {
  it("renders correctly (empty state)", () => {
    const tree = render(<LFManager />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
