import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import QnACard from "../../components/Homepage/Q&ACard";
import { auth, db } from "../../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function QandAScreen() {
  const faqData = [
    {
      id: 1,
      question: "Si mund te raportoj nje send te humbur?",
      answer:
        "Shko te seksioni Lost & Found dhe ploteso formularin per raportim.",
    },
    {
      id: 2,
      question: "Ku ndodhet zyra e informacionit?",
      answer: "Ne katin e pare, afer hyrjes kryesore te kampusit.",
    },
    {
      id: 3,
      question: "Si mund te kontaktoj administraten?",
      answer: "Perdor emailin zyrtar ose formularin e kontaktit ne aplikacion.",
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const handleUpvote = async (id, upvotes = []) => {
    const questionRef = doc(db, "questions", id);
    const userId = auth.currentUser.uid;

    try {
      if (upvotes.includes(userId)) {
        await updateDoc(questionRef, {
          upvotes: arrayRemove(userId),
        });
      } else {
        await updateDoc(questionRef, {
          upvotes: arrayUnion(userId),
        });
      }
    } catch (error) {
      console.log("Error upvoting question: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "questions"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(data);
    });

    return () => unsubscribe();
  }, []);

  const hanldeAddQuestion = async () => {
    if (newQuestion.trim() === "") return;

    await addDoc(collection(db, "questions"), {
      question: newQuestion,
      answers: [],
      userId: auth.currentUser.uid,
      createdAt: Date.now(),
      upvotes: [],
    });

    setNewQuestion("");
  };

  const handleAddAnswer = async (id) => {
    if (newAnswer.trim() === "") return;

    try {
      const questionRef = doc(db, "questions", id);
      await updateDoc(questionRef, {
        answers: arrayUnion(newAnswer),
      });

      setNewAnswer("");
      setSelectedQuestionId(null);
    } catch (error) {
      console.log("Error adding answer: ", error);
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingText(item.question);
  };

  const saveEdit = async () => {
    if (!editingId || editingText.trim() === "") {
      return;
    }

    await updateDoc(doc(db, "questions", editingId), {
      question: editingText,
    });

    setEditingId(null);
    setEditingText("");
  };

  const deleteQuestion = async (id) => {
    await deleteDoc(doc(db, "questions", id));
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === "upvotes") {
      return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
    } else {
      return b.createdAt - a.createdAt;
    }
  });

  const renderItem = ({ item }) => (
    <QnACard
      item={item}
      selectedQuestionId={selectedQuestionId}
      newAnswer={newAnswer}
      setSelectedQuestionId={setSelectedQuestionId}
      setNewAnswer={setNewAnswer}
      handleAddAnswer={handleAddAnswer}
      editingId={editingId}
      editingText={editingText}
      startEditing={startEditing}
      setEditingText={setEditingText}
      saveEdit={saveEdit}
      deleteQuestion={deleteQuestion}
      handleUpvote={handleUpvote}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#820000" barStyle="light-content" />

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.searchFilterRow}>
              <TextInput
                style={[styles.inputSimple, { flex: 1 }]}
                placeholder="Kerko pyetjen..."
                placeholderTextColor="#777"
                value={searchText}
                onChangeText={setSearchText}
              />
              <View style={styles.filterButtons}>
                <TouchableOpacity
                  style={[
                    styles.filterBtn,
                    sortBy === "date" && styles.filterBtnActive,
                  ]}
                  onPress={() => setSortBy("date")}
                >
                  <Text style={styles.filterText}>🕒 Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterBtn,
                    sortBy === "upvotes" && styles.filterBtnActive,
                  ]}
                  onPress={() => setSortBy("upvotes")}
                >
                  <Text style={styles.filterText}>📈 Upvotes</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.sectionHeader}>
              ❗ Pyetje te shpeshta (FAQ)
            </Text>

            {faqData.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Text style={styles.toggleIcon}>
                    {openFAQ === faq.id ? "−" : "+"}
                  </Text>
                </TouchableOpacity>
                {openFAQ === faq.id && (
                  <View style={styles.faqAnswerBox}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}

            <Text style={styles.sectionHeader}>💬 Pyetje nga perdoruesit</Text>

            <View style={styles.addQuestionBox}>
              <TextInput
                style={styles.inputSimple}
                placeholder="Shto pyetje te re..."
                placeholderTextColor="#777"
                value={newQuestion}
                onChangeText={setNewQuestion}
              />
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={hanldeAddQuestion}
              >
                <Text style={styles.buttonText}>Posto</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        data={sortedQuestions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F6FA",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D40000",
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#820000",
    paddingLeft: 10,
    marginBottom: 10,
  },

  faqItem: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    paddingRight: 10,
  },
  toggleIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#820000",
  },
  faqAnswerBox: {
    marginTop: 8,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#D40000",
  },
  faqAnswer: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  addQuestionBox: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  inputSimple: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 15,
  },

  buttonPrimary: {
    backgroundColor: "#D40000",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  searchBox: {
    marginBottom: 10,
  },
  inputSimple: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  searchFilterRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  filterButtons: { flexDirection: "row", marginLeft: 8 },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D40000",
    marginLeft: 4,
  },
  filterBtnActive: {
    backgroundColor: "#D40000",
  },
  filterText: { color: "#000", fontWeight: "600" },
});
