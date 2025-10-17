import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

export default function QandAScreen() {
  const faqData = [
    {
      id: 1,
      question: "Si mund te raportoj nje send te humbur?",
      answer:
        "Shko te seksioni Lost & Found dhe ploteso formularin per raportim",
    },
    {
      id: 2,
      question: "Ku ndodhet zyra e informacionit?",
      answer: "Ne katin e pare, afer hyrjes kryesore te kampusit",
    },
    {
      id: 3,
      question: "Si mund te kontaktoj administraten?",
      answer: "Perdor emailin zyrtar ose formularin e kontaktit ne aplikacion",
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    if (openFAQ === id) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(id);
    }
  };

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Kur fillon semestri i peste",
      answers: ["Ne shtator", "Pas pushimeve verore"],
    },
    {
      id: 2,
      question: "Ku gjendet bibloteka",
      answers: ["Ne katin e peste"],
    },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const hanldeAddQuestion = () => {
    if (newQuestion.trim() === "") {
      return;
    }
    const newQ = {
      id: questions.length + 1,
      question: newQuestion,
      answers: [],
    };
    setQuestions([...questions, newQ]);
    setNewQuestion("");
  };

  const handleAddAnswer = (id) => {
    if (newAnswer.trim() === "") {
      return;
    }

    const updated = questions.map((q) =>
      q.id === id ? { ...q, answers: [...q.answers, newAnswer] } : q
    );
    setQuestions(updated);
    setNewAnswer("");
    setSelectedQuestionId(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.questionText}>❓ {item.question}</Text>

      {item.answers.map((ans, index) => (
        <Text key={index} style={styles.answerText}>
          💬{ans}
        </Text>
      ))}

      {selectedQuestionId === item.id ? (
        <View style={styles.answerInputBox}>
          <TextInput
            style={styles.input}
            placeholder="Shkruaj Pergjigjen..."
            value={newAnswer}
            onChangeText={setNewAnswer}
          />
          <TouchableOpacity
            style={styles.button}
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📚 Campus Connect </Text>

        <Text style={styles.sectionHeader}>❗Pyetje te shpeshta (FAQ)</Text>
        {faqData.map((faq) => (
          <View key={faq.id} style={styles.faqCard}>
            <TouchableOpacity onPress={() => toggleFAQ(faq.id)}>
              <Text style={styles.faqQuestion}>
                {openFAQ === faq.id ? "▼" : "▶ "} {faq.question}
              </Text>
            </TouchableOpacity>
            {openFAQ === faq.id && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionHeader}>💬 Pyetje nga perdoruesit</Text>

        <View style={styles.addBox}>
          <TextInput
            style={styles.input}
            placeholder="Shto pyetje te re..."
            value={newQuestion}
            onChangeText={setNewQuestion}
          />
          <TouchableOpacity style={styles.button} onPress={hanldeAddQuestion}>
            <Text style={styles.buttonText}>Posto</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={questions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FCFCFC" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#820000",
    textAlign: "center",
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D40000",
    marginVertical: 10,
  },
  faqCard: {
    backgroundColor: "#E0DDD5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  faqQuestion: { fontWeight: "bold", color: "#535353", fontSize: 15 },
  faqAnswer: { marginTop: 6, color: "8B8680", paddingLeft: 10 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#820000",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#E0DDD5"
  },
  questionText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  answerText: { marginTop: 4, color: "#555" },
  addBox: { flexDirection: "row", marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff"
  },
  button: {
    backgroundColor: "#D40000",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
    marginLeft: 6,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  replyButton: { marginTop: 8, alignSelf: "flex-end" },
  replyText: { color: "#820000", fontWeight: "600" },
  answerInputBox: { flexDirection: "row", marginTop: 6 },
});
