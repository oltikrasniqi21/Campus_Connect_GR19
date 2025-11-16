import React, { use, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth, db } from "../../firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

export default function QnACard({
  item,
  selectedQuestionId,
  newAnswer,
  setSelectedQuestionId,
  setNewAnswer,
  handleAddAnswer,
  editingId,
  editingText,
  startEditing,
  setEditingText,
  saveEdit,
  deleteQuestion,
  handleUpvote,
}) {
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");

  const upvotes = item.upvotes || [];

  const timeAgo = (Timestamp) => {
    const now = new Date();
    const posted = new Date(Timestamp);
    const diff = Math.floor((now - posted) / 1000);

    if (diff < 60) {
      return `${diff} sekonda me pare`;
    }
    if (diff < 3600) {
      return `${Math.floor(diff / 60)} minuta me pare`;
    }
    if (diff < 86400) {
      return `${Math.floor(diff / 3600)} ore me pare`;
    }
    return `${Math.floor(diff / 86400)} dite me pare`;
  };

  const startEditingAnswer = (index, ans) => {
    setEditingAnswerId(index);
    setEditingAnswerText(ans.text);
  };

  const saveEditedAnswer = async (index) => {
    if (editingAnswerText.trim() === "") return;
    const updatedAnswers = [...item.answers];
    updatedAnswers[index].text = editingAnswerText;
    await updateDoc(doc(db, "questions", item.id), { answers: updatedAnswers });
    setEditingAnswerId(null);
    setEditingAnswerText("");
  };

  const deleteAnswer = async (ans) => {
    await updateDoc(doc(db, "questions", item.id), {
      answers: arrayRemove(ans),
    });
  };

  return (
    <View style={styles.qnaCard}>
      <Text style={styles.qnaQuestionText}>❓ {item.question}</Text>
      <Text style={styles.qnaDate}>{timeAgo(item.createdAt)}</Text>

      <View style={styles.answersContainer}>
        <Text style={styles.answersTitle}>Përgjigjet:</Text>
        {item.answers.map((ans, index) => (
          <View key={index} style={{ marginVertical: 4 }}>
            {editingAnswerId === index ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[styles.inputSimple, { flex: 1 }]}
                  value={editingAnswerText}
                  onChangeText={setEditingAnswerText}
                />
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={() => saveEditedAnswer(index)}
                >
                  <Text style={styles.buttonText}>Ruaj</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.qnaAnswerText}>💬 {ans.text}</Text>
                {ans.userId === auth.currentUser?.uid && (
                  <>
                    <TouchableOpacity
                      onPress={() => startEditingAnswer(index, ans)}
                    >
                      <Text style={[styles.editBtn, { marginLeft: 10 }]}>
                        ✏️
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          "Konfirmo Fshirjen",
                          "A je i sigurt qe deshiron ta fshish kete pergjigjje?",
                          [
                            { text: "Jo", style: "cancel" },
                            {
                              text: "Po",
                              style: "destructive",
                              onPress: () => deleteAnswer(ans),
                            },
                          ]
                        )
                      }
                    >
                      <Text style={[styles.deleteBtn, { marginLeft: 5 }]}>
                        🗑️
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={() => handleUpvote(item.id, upvotes)}>
          <Text
            style={{
              color: upvotes.includes(auth.currentUser.uid)
                ? "#D40000"
                : "#555",
            }}
          >
            👍 {upvotes.length}
          </Text>
        </TouchableOpacity>
        {item.userId === auth.currentUser?.uid && (
          <>
            <TouchableOpacity onPress={() => startEditing(item)}>
              <Text style={[styles.editBtn, { marginLeft: 180 }]}>
                ✏️ Edito
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Konfirmo Fshirjen",
                  "A je i sigurt qe deshiron te fshish kete pyetje?",
                  [
                    { text: "Jo", style: "cancel" },
                    {
                      text: "Po",
                      style: "destructive",
                      onPress: () => deleteQuestion(item.id),
                    },
                  ]
                )
              }
            >
              <Text style={[styles.deleteBtn, { marginLeft: 10 }]}>
                🗑️ Fshi
              </Text>
            </TouchableOpacity>
          </>
        )}
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

      {editingId === item.id ? (
        <View style={styles.editBox}>
          <TextInput
            style={styles.inputSimple}
            value={editingText}
            onChangeText={setEditingText}
          />

          <TouchableOpacity style={styles.buttonPrimary} onPress={saveEdit}>
            <Text style={styles.buttonText}>Ruaj</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  editBtn: {
    color: "#007AFF",
    fontWeight: "600",
  },
  deleteBtn: {
    color: "#D40000",
    fontWeight: "600",
  },
  editBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  qnaDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
});
