import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";

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

  const renderItem = ({ item }) => (
    <View style={styles.qnaCard}>
      <Text style={styles.qnaQuestionText}>❓ {item.question}</Text>

      <View style={styles.answersContainer}>
        <Text style={styles.answersTitle}>Përgjigjet:</Text>
        {item.answers.map((ans, index) => (
          <Text key={index} style={styles.qnaAnswerText}>
            💬 {ans}
          </Text>
        ))}
      </View>

      {selectedQuestionId === item.id ? (
        <View style={styles.answerInputBox}>
          <TextInput
            style={styles.inputSimple}
            placeholder="Shkruaj Pergjigjen..."
            placeholderTextColor="#777"
            value={newAnswer}
            onChangeText={setNewAnswer}
          />
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => handleAddAnswer(item.id)}
          >
            <Text style={styles.buttonText}>Shto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => setSelectedQuestionId(item.id)}
        >
          <Text style={styles.replyText}>Pergjigju</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#820000" barStyle="light-content" />

      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Q&A PAGE</Text>

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
        data={questions}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#820000",
    textAlign: "center",
    marginBottom: 20,
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

  qnaCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  qnaQuestionText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  answersContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  answersTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#820000",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    paddingBottom: 3,
  },
  qnaAnswerText: {
    fontSize: 14,
    color: "#555",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    marginTop: 5,
    lineHeight: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#820000",
  },

  addQuestionBox: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  answerInputBox: {
    flexDirection: "row",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
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

  replyButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    paddingHorizontal: 8,
  },
  replyText: {
    color: "#820000",
    fontWeight: "600",
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#820000",
  },
});
