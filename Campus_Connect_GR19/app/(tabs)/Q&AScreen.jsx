import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import QnACard from "../../components/Homepage/Q&ACard";

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

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Kur fillon semestri i peste?",
      answers: ["Ne shtator", "Pas pushimeve verore"],
    },
    {
      id: 2,
      question: "Ku gjendet bibloteka?",
      answers: ["Ne katin e peste."],
    },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [searchText, setSearchText] = useState("");

  const hanldeAddQuestion = () => {
    if (newQuestion.trim() === "") return;

    const newQ = {
      id: questions.length + 1,
      question: newQuestion,
      answers: [],
    };

    setQuestions([...questions, newQ]);
    setNewQuestion("");
  };

  const handleAddAnswer = (id) => {
    if (newAnswer.trim() === "") return;

    const updated = questions.map((q) =>
      q.id === id ? { ...q, answers: [...q.answers, newAnswer] } : q
    );
    setQuestions(updated);
    setNewAnswer("");
    setSelectedQuestionId(null);
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingText(item.question);
  };

  const saveEdit = () => {
    if (editingText.trim() === "") {
      return;
    }

    const updated = questions.map((q) =>
      q.id === editingId ? { ...q, question: editingText } : q
    );

    setQuestions(updated);
    setEditingId(null);
    setEditingText("");
  };

  const deleteQuestion = (id) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchText.toLowerCase())
  );

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
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#820000" barStyle="light-content" />

      <FlatList
        ListHeaderComponent={
          <>
            <View>
              <TextInput
                style={styles.inputSimple}
                placeholder="Kerko pyetjen..."
                placeholderTextColor="#777"
                value={searchText}
                onChangeText={setSearchText}
              />
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
        data={filteredQuestions}
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
});
