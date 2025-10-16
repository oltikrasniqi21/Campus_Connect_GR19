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
      <StatusBar />
      <Text>📚 Campus Connect - Q&A</Text>

      <View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f8f8" },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
    marginLeft: 6,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  replyButton: { marginTop: 8, alignSelf: "flex-end" },
  replyText: { color: "#007AFF", fontWeight: "500" },
  answerInputBox: { flexDirection: "row", marginTop: 6 },
});
