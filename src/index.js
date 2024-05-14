import {
  View,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ChatGPT = () => {
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  const host = process.env.EXPO_PUBLIC_API_URL;

  const geminiHost = host + "?key=" + apiKey;

  const [userInput, setuserInput] = useState("");
  const [chat, setchat] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];
    setloading(true);
    try {
      const response = await axios.post(geminiHost, {
        contents: updatedChat,
      });

      const res =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // adding model response/
      if (res) {
        updatedChat = [
          ...updatedChat,
          {
            role: "model",
            parts: [{ text: res }],
          },
        ];

        setchat(updatedChat);
        setuserInput("");
      }
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const renderChatItem = ({ item }) => (
    <ChatBubble role={item.role} text={item.parts[0].text} />
  );

  return (
    <View style={Styles.container}>
      {/* title */}
      {/* <Text style={Styles.title}>Jabbour Bot</Text> */}

      <View style={Styles.titleContainer}>
        <MaterialCommunityIcons name="robot-happy" size={24} color="#237aed" />
        <Text style={Styles.title}>Jabbour Bot</Text>
      </View>
      {/* list of messages */}
      <FlatList
        data={chat}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={Styles.chatContainer}
      />
      {/* input */}
      <View style={Styles.inputContainer}>
        <TextInput
          style={Styles.input}
          value={userInput}
          onChangeText={(text) => setuserInput(text)}
          placeholder="Enter prompt here..."
        />
        {/* <Button title="Submit" onPress={handleSend} /> */}
        <TouchableOpacity style={Styles.button} onPress={handleSend}>
          <Text style={Styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#333" />}
      {error && (
        <Text style={{ color: "red", textAlign: "center" }}>
          {error.message}
        </Text>
      )}
    </View>
  );
};

export default ChatGPT;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eff8ff",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#237aed",
    // marginBottom: 20,
    // marginTop: 40,
    marginLeft: 10,
    textAlign: "center",
  },

  chatContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    padding: 10,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 10,
    color: "#333",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#237aed",
    padding: 12,
    borderRadius: 13,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
