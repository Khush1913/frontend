import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Animated
} from "react-native";
import uuid from "react-native-uuid";
import React, { useState, useContext, useRef } from "react";
import ChatContext, { ResponseRecieved } from '../context.js'
import { ChatIDContext } from "../context.js";
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';

const launchImageLibrary = _launchImageLibrary;
const launchCamera       = _launchCamera;

const PURPLE       = "#6c63ff";
const PURPLE_LIGHT = "rgba(108,99,255,0.20)";
const PURPLE_BORDER= "rgba(108,99,255,0.40)";
const BORDER       = "rgba(255,255,255,0.08)";
const WHITE_DIM    = "rgba(255,255,255,0.45)";
const WHITE_MID    = "rgba(255,255,255,0.75)";
const WHITE_BRIGHT = "#e2d9ff";
const SURFACE      = "rgba(255,255,255,0.06)";
const SURFACE2     = "rgba(255,255,255,0.10)";

const Query = ({ onChildMessage }) => {
  const [InputText,    setInputText]    = useState("");
  const [messages,     setMessages]     = useState([]);
  const [uploadBox,    setUploadBox]    = useState(false);
  const [selectedImage,setSelectedImage]= useState(null);
  const [outputImage,  setOutputImage]  = useState(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const { chat, setChat }                           = useContext(ChatContext);
  const { chatID }                                  = useContext(ChatIDContext);
  const { modelResponseRecieved, setModelResponseRecieved } = useContext(ResponseRecieved);

  const pressSend = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, speed: 20, useNativeDriver: true }),
    ]).start();
  };

  const openImagePicker = () => {
    setUploadBox(false);
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: false, maxHeight: 2000, maxWidth: 2000 },
      handleResponse
    );
  };

  const handleCameraLaunch = () => {
    setUploadBox(false);
    launchCamera(
      { mediaType: 'photo', includeBase64: false, maxHeight: 2000, maxWidth: 2000 },
      handleResponse
    );
  };

  const handleResponse = async (response) => {
    if (response.didCancel || response.errorCode) return;
    const imageUri = response.uri || response.assets?.[0]?.uri || null;
    setSelectedImage(imageUri);
    try {
      const data = new FormData();
      data.append('file', { uri: imageUri, name: 'input.jpg', type: 'image/jpeg' });
      const res  = await fetch('http://10.0.2.2:8000/fractureDetection', {
        method: 'POST', body: data,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const json = await res.json();
      setOutputImage(`data:image/jpeg;base64,${json.output_image}`);
    console.log(outputImage);
  } catch (e) {
      setOutputImage(null);
    }
  };

  const HandletextSubmit = async () => {
    if (!InputText.trim() && !selectedImage) return;
    const imageUri = selectedImage || null;

    setChat(prev => prev.map(c =>
      c.id === chatID
        ? { ...c, content: [...c.content, { Query: [{ text: InputText.trim() || "No query", image: imageUri }] }] }
        : c
    ));

    setModelResponseRecieved(false);
    const userMessage = { id: uuid.v4(), role: "user", text: InputText.trim(), image: imageUri };
    const updatedMessagesWithUser = [...messages, userMessage];
    setMessages(updatedMessagesWithUser);
    onChildMessage(updatedMessagesWithUser);
    setInputText("");

    if (InputText.length !== 0) {
      try {
        const res  = await fetch("http://10.0.2.2:8000/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userMessage.text }),
        });
        const data = await res.json();
        const botMessage = { id: uuid.v4(), role: "assistant", text: data.summary || "", image: outputImage };
        setChat(prev => prev.map(c =>
          c.id === chatID
            ? { ...c, content: [...c.content, { Answer: [{ text: botMessage.text, image: botMessage.image }] }] }
            : c
        ));
        const final = [...updatedMessagesWithUser, botMessage];
        setMessages(final); onChildMessage(final);
        setModelResponseRecieved(true);
      } catch {
        const errMsg = { id: uuid.v4(), role: "assistant", text: "Sorry, something went wrong." };
        const errFinal = [...updatedMessagesWithUser, errMsg];
        setMessages(errFinal); onChildMessage(errFinal);
        setModelResponseRecieved(true);
      }
    } else {
      const botMessage = { id: uuid.v4(), role: "assistant", text: "", image: outputImage || null };
      const final = [...updatedMessagesWithUser, botMessage];
      setMessages(final); onChildMessage(final);
      setModelResponseRecieved(true);
    }

    setSelectedImage(null);
    setOutputImage(null);
  };

  return (
    <View>

      {/* Upload popup */}
      {uploadBox && (
        <View style={styles.uploadPopup}>
          <TouchableOpacity style={styles.uploadOption} onPress={openImagePicker} activeOpacity={0.75}>
            <View style={[styles.uploadIconWrap, { backgroundColor: "rgba(108,99,255,0.18)" }]}>
              <Text style={styles.uploadIcon}>🖼️</Text>
            </View>
            <View>
              <Text style={styles.uploadOptionTitle}>Gallery</Text>
              <Text style={styles.uploadOptionSub}>Choose from your photos</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.uploadDivider} />

          <TouchableOpacity style={styles.uploadOption} onPress={handleCameraLaunch} activeOpacity={0.75}>
            <View style={[styles.uploadIconWrap, { backgroundColor: "rgba(52,199,160,0.18)" }]}>
              <Text style={styles.uploadIcon}>📷</Text>
            </View>
            <View>
              <Text style={styles.uploadOptionTitle}>Camera</Text>
              <Text style={styles.uploadOptionSub}>Take a new photo</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Selected image preview chip */}
      {selectedImage && (
        <View style={styles.imageChip}>
          <Image source={{ uri: selectedImage }} style={styles.imageChipThumb} />
          <Text style={styles.imageChipText}>Image attached</Text>
          <TouchableOpacity onPress={() => { setSelectedImage(null); setOutputImage(null); }}>
            <Text style={styles.imageChipRemove}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom bar */}
      <View style={styles.bottomBar}>

        {/* + button */}
        <TouchableOpacity
          style={[styles.iconBtn, uploadBox && styles.iconBtnActive]}
          onPress={() => setUploadBox(v => !v)}
          activeOpacity={0.8}
        >
          <Text style={[styles.iconBtnText, uploadBox && styles.iconBtnTextActive]}>
            {uploadBox ? "✕" : "+"}
          </Text>
        </TouchableOpacity>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Ask anything…"
          placeholderTextColor={WHITE_DIM}
          onChangeText={setInputText}
          value={InputText}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={HandletextSubmit}
        />

        {/* Send */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !modelResponseRecieved && styles.sendBtnDisabled,
            ]}
            onPress={() => {
              if (modelResponseRecieved) {
                pressSend();
                HandletextSubmit();
              }
            }}
            activeOpacity={0.85}
          >
            <Image
              source={require("../images/send-message.png")}
              style={[
                styles.sendIcon,
                { tintColor: modelResponseRecieved ? WHITE_BRIGHT : WHITE_DIM }
              ]}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default Query;

const styles = StyleSheet.create({

  /* Upload popup */
  uploadPopup: {
    position: "absolute",
    bottom: 72, left: 14,
    width: 210,
    backgroundColor: "rgba(16,20,40,0.97)",
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 6,
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 14,
  },
  uploadOption: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 10,
  },
  uploadIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  uploadIcon:        { fontSize: 18 },
  uploadOptionTitle: { fontSize: 13, fontWeight: "600", color: WHITE_BRIGHT },
  uploadOptionSub:   { fontSize: 11, color: WHITE_DIM, marginTop: 1 },
  uploadDivider:     { height: 1, backgroundColor: BORDER, marginHorizontal: 12 },

  /* Image chip */
  imageChip: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: SURFACE,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 10,
    marginHorizontal: 14, marginBottom: 6,
    paddingHorizontal: 10, paddingVertical: 7,
  },
  imageChipThumb:   { width: 28, height: 28, borderRadius: 6 },
  imageChipText:    { flex: 1, fontSize: 12, color: WHITE_MID, fontWeight: "500" },
  imageChipRemove:  { fontSize: 13, color: WHITE_DIM, paddingHorizontal: 4 },

  /* Bottom bar */
  bottomBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 12, paddingVertical: 10, paddingBottom: 24,
    backgroundColor: "rgba(10,14,30,0.96)",
    borderTopWidth: 1, borderTopColor: BORDER,
  },

  /* + icon button */
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: SURFACE2,
    borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  iconBtnActive: {
    backgroundColor: PURPLE_LIGHT,
    borderColor: PURPLE_BORDER,
  },
  iconBtnText:       { color: WHITE_MID, fontSize: 20, fontWeight: "300", lineHeight: 24 },
  iconBtnTextActive: { color: "#a78bfa" },

  /* Text input */
  input: {
    flex: 1, height: 44,
    backgroundColor: SURFACE2,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14, color: WHITE_BRIGHT,
  },

  /* Send button */
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1, borderColor: PURPLE_BORDER,
    alignItems: "center", justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: SURFACE,
    borderColor: BORDER,
  },
  sendIcon: { width: 18, height: 18 },
});