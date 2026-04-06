import React, { useState, useContext, useRef } from "react";
import { useNavigationState } from "@react-navigation/native";
import {
  View, Text, TouchableOpacity, StatusBar,
  FlatList, Image, Pressable, StyleSheet,
} from "react-native";

import RAGstyles from "./RAGstyles.js";
import ChatContext, { ChatIDContext, HistoryChatClicked } from "../context.js";
import SideBar from "../components/SideBar.jsx";
import Query from "../components/Query.jsx";

const PURPLE       = "#6c63ff";
const PURPLE_LIGHT = "rgba(108,99,255,0.20)";
const PURPLE_BORDER= "rgba(108,99,255,0.40)";
const BG           = "rgba(10,14,30,0.97)";
const BORDER       = "rgba(255,255,255,0.08)";
const WHITE_DIM    = "rgba(255,255,255,0.50)";
const WHITE_MID    = "rgba(255,255,255,0.75)";
const WHITE_BRIGHT = "#e2d9ff";
const USER_BUBBLE  = "rgba(108,99,255,0.22)";
const USER_BORDER  = "rgba(108,99,255,0.40)";
const BOT_BUBBLE   = "rgba(255,255,255,0.07)";
const BOT_BORDER   = "rgba(255,255,255,0.10)";

const RAG = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [childMessage, setChildMessage] = useState([]);
  const [sidebar, setSideBar] = useState(false);

  const currentRouteName = useNavigationState(
    (state) => state.routes[state.index].name
  );

  const { historyChatClicked } = useContext(HistoryChatClicked);
  const { chatID }             = useContext(ChatIDContext);
  const { chat }               = useContext(ChatContext);

  const messagesToShow = historyChatClicked
    ? chat.find((c) => c.id === chatID)?.content || []
    : childMessage;

  const onChildMessage = (arr) => setChildMessage(arr);

  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <Image
        source={require("../images/logo.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>AI Ready</Text>
      </View>
      <Text style={styles.emptyTitle}>How can I help?</Text>
      <Text style={styles.emptySubtitle}>
        Ask me anything — medical queries, symptoms, or health advice.
      </Text>
      <View style={styles.pillsRow}>
        {["🩺 Symptoms", "💊 Medicine", "📋 Reports"].map((p, i) => (
          <View key={i} style={styles.pill}>
            <Text style={styles.pillText}>{p}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <View style={styles.bgBase} />
      <View style={styles.bgSheen} />
      <View style={styles.topAccent} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.menuBtn}
          onPress={() => setSideBar(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chatbot AI</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        <View style={styles.avatarSmall}>
          <Text style={styles.avatarSmallText}>AI</Text>
        </View>
      </View>

      {/* Chat list */}
      <FlatList
        ref={flatListRef}
        data={messagesToShow}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => {
          const isUser = item.role === "user";
          return (
            <View style={styles.messageRow}>
              {!isUser && (
                <View style={styles.botAvatar}>
                  <Text style={styles.botAvatarText}>AI</Text>
                </View>
              )}
              <View style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.botBubble,
              ]}>
                {item.text && (
                  <Text style={isUser ? styles.userText : styles.botText}>
                    {item.text}
                  </Text>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <Query onChildMessage={onChildMessage} />

      {/* Sidebar */}
      <SideBar
        Navigation={{
          currentRouteName,
          navigation,
          SidebarState: [sidebar, setSideBar],
        }}
      />
    </View>
  );
};

export default RAG;

const styles = StyleSheet.create({
  root: { flex: 1 },

  bgBase:  { ...StyleSheet.absoluteFillObject, backgroundColor: BG },
  bgSheen: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(108,99,255,0.04)" },
  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: PURPLE, opacity: 0.75, zIndex: 10,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: "rgba(10,14,30,0.95)",
  },
  menuBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  menuIcon: { color: WHITE_MID, fontSize: 16 },

  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontSize: 18, fontWeight: "700",
    color: WHITE_BRIGHT, letterSpacing: 0.2,
  },
  onlineRow: {
    flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3,
  },
  onlineDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: "#34c7a0",
  },
  onlineText: { fontSize: 11, color: "#34c7a0", fontWeight: "500" },

  avatarSmall: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1, borderColor: PURPLE_BORDER,
    alignItems: "center", justifyContent: "center",
  },
  avatarSmallText: { color: WHITE_BRIGHT, fontSize: 12, fontWeight: "700" },

  /* List */
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  /* Empty state */
  emptyWrap: {
    flex: 1, alignItems: "center",
    justifyContent: "center", paddingTop: 40,
  },
  emptyImage: { width: 130, height: 130, marginBottom: 20 },
  badge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1, borderColor: PURPLE_BORDER,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    marginBottom: 14,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#a78bfa" },
  badgeText: { fontSize: 12, color: "#a78bfa", fontWeight: "600" },
  emptyTitle: {
    fontSize: 22, fontWeight: "700",
    color: WHITE_BRIGHT, marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13, color: WHITE_DIM,
    textAlign: "center", lineHeight: 20,
    paddingHorizontal: 28, marginBottom: 22,
  },
  pillsRow: { flexDirection: "row", gap: 8 },
  pill: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
  },
  pillText: { fontSize: 12, color: WHITE_MID, fontWeight: "500" },

  /* Messages */
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  botAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1, borderColor: PURPLE_BORDER,
    alignItems: "center", justifyContent: "center",
    marginRight: 8, marginBottom: 2,
  },
  botAvatarText: { color: WHITE_BRIGHT, fontSize: 9, fontWeight: "700" },

  bubble: {
    maxWidth: "78%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: USER_BUBBLE,
    borderColor: USER_BORDER,
    borderBottomRightRadius: 3,
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  botBubble: {
    backgroundColor: BOT_BUBBLE,
    borderColor: BOT_BORDER,
    borderBottomLeftRadius: 3,
    alignSelf: "flex-start",
  },
  userText: { color: WHITE_BRIGHT, fontSize: 14, lineHeight: 21 },
  botText:  { color: WHITE_MID,    fontSize: 14, lineHeight: 21 },
});