import { render } from "@testing-library/react-native"
import {Flashcard} from "../components/Homepage/flashcards.jsx";
import { NavigationContainer } from '@react-navigation/native';
import { getDoc } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  collection: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock("../firebase", () => ({
  db: {},
  auth: {
    currentUser: { uid: "user-123" },
  },
}));


onSnapshot.mockImplementation((q, callback) => {
  callback({ docs: [] });
  return jest.fn();
});


getDoc.mockResolvedValue({
  exists: () => true,
  data: () => ({ savedBy: "user-123" }),
});


const mockItem = {
    key: "flashcard-123",
    id:"flashcard-123",
    title: 'Task Reminder',
    date: "2025-12-16",
    time: "14:00",
    location: 'Library Hall'
}

describe('Flashcard Component', () => {
    it('correctly renders event data in flashcard', () => {
        const tree = render(<NavigationContainer>
                    <Flashcard
                    key={mockItem.key}
                    id={mockItem.id}
                    title={mockItem.title}
                    date={mockItem.date}
                    time={mockItem.time}
                    location={mockItem.location}
                    />
            </NavigationContainer>).toJSON();
        expect(tree).toMatchSnapshot();
    })
})