import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Profile from "../app/(tabs)/profile";

jest.mock("react-native", () => {
  const rn = jest.requireActual("react-native");

  const MockAnimated = {
    ...rn.Animated,
    timing: () => ({ start: (cb) => cb && cb() }),
    spring: () => ({ start: (cb) => cb && cb() }),
    loop: () => ({ start: () => {}, stop: () => {} }),
  };

  const MockFlatList = ({ data, renderItem, ListHeaderComponent, ...props }) => {
    return (
      <rn.View testID="flatlist-mock" {...props}>
        {ListHeaderComponent}
        {data && data.map((item, index) => (
          <rn.View key={item.id || index} testID="flatlist-item">
            {renderItem({ item, index })}
          </rn.View>
        ))}
      </rn.View>
    );
  };

  const MockScrollView = ({ children, ...props }) => (
    <rn.View testID="scrollview-mock" {...props}>{children}</rn.View>
  );

  return Object.setPrototypeOf({
    Animated: MockAnimated,
    FlatList: MockFlatList,
    ScrollView: MockScrollView,
  }, rn);
});

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  const MockIcon = () => <View testID="icon-mock" />;
  return {
    Ionicons: MockIcon,
    Feather: MockIcon,
    MaterialIcons: MockIcon,
    FontAwesome: MockIcon,
    FontAwesome5: MockIcon,
    MaterialCommunityIcons: MockIcon,
    AntDesign: MockIcon,
    Entypo: MockIcon,
    EvilIcons: MockIcon,
    Foundation: MockIcon,
    Octicons: MockIcon,
    SimpleLineIcons: MockIcon,
    Zocial: MockIcon,
    isto: MockIcon,
  };
});

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockLogout = jest.fn();

jest.mock("../context/AuthContext", () => {
  const stableUser = { id: "test-user-id", email: "test@example.com" };
  return {
    useAuth: () => ({
      user: stableUser,
      loading: false,
      logout: mockLogout,
    }),
  };
});

jest.mock("firebase/firestore", () => {
  const mockUnsub = jest.fn();
  return {
    getFirestore: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    doc: jest.fn(),
    onSnapshot: (ref, callback) => {
      const mockSnapshot = {
        exists: () => true,
        data: () => ({ 
          firstname: "Mario", 
          lastname: "Test", 
          bio: "I love testing", 
          photoURL: "http://fake-url.com/photo.png",
          email: "test@example.com"
        }),
        docs: [
          { 
            id: "post-1", 
            data: () => ({ title: "Test Event 1", eventPhoto: "url1" }) 
          },
          { 
            id: "post-2", 
            data: () => ({ title: "Lost Item 1", photo: "url2" }) 
          }
        ]
      };
      callback(mockSnapshot);
      return mockUnsub; 
    },
  };
});

jest.mock("../firebase", () => ({
  db: {},
}));

describe("Profile Component", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    global.toggleProfileMenu = null;
  });

  it("renders user profile information correctly", async () => {
    const { getByText } = render(<Profile />);
    await waitFor(() => {
      expect(getByText("Mario Test")).toBeTruthy();
      expect(getByText("test@example.com")).toBeTruthy();
    });
  });

  it("renders the list of posts", async () => {
    const { getByText } = render(<Profile />);
    await waitFor(() => {
      expect(getByText("Test Event 1")).toBeTruthy();
    });
  });

  it("switches tabs from Events to LF Postimet", async () => {
    const { getByText } = render(<Profile />);
    const lfTab = getByText("LF Postimet");
    
    fireEvent.press(lfTab);

    await waitFor(() => {
       expect(getByText("Lost Item 1")).toBeTruthy();
    });
  });

  it("opens the Menu when global toggle is called", async () => {
    const { getByText } = render(<Profile />);

    await act(async () => {
        global.toggleProfileMenu && global.toggleProfileMenu();
    });

    await waitFor(() => {
        expect(getByText("Log Out")).toBeTruthy();
    });
  });

  it("navigates to 'Saved' when menu item is clicked", async () => {
    const { getByText } = render(<Profile />);

    await act(async () => {
        global.toggleProfileMenu && global.toggleProfileMenu();
    });

    fireEvent.press(getByText("Saved"));
    expect(mockPush).toHaveBeenCalledWith("/SavedPosts");
  });

  it("calls logout when 'Log Out' is clicked", async () => {
    const { getByText } = render(<Profile />);

    await act(async () => {
        global.toggleProfileMenu && global.toggleProfileMenu();
    });

    fireEvent.press(getByText("Log Out"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("navigates to event details when a post is clicked", async () => {
    const { getByText } = render(<Profile />);
    
    await waitFor(() => getByText("Test Event 1"));
    fireEvent.press(getByText("Test Event 1"));
    
    expect(mockPush).toHaveBeenCalledWith("/eventDetail/post-1");
  });
});