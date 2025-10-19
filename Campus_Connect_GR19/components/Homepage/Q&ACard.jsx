import React from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

export default function QnACard({
  item,
  selectedQuestionId,
  newAnswer,
  setSelectedQuestionId,
  setNewAnswer,
  handleAddAnswer,
}) {
  return (
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
}

const styles = StyleSheet.create({
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