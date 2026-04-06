import { FlatList, StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import React, { useContext, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import ChatContext, { ChatIDContext, HistoryChatClicked } from "../context.js";
import uuid from "react-native-uuid";

const PURPLE        = "#6c63ff";
const PURPLE_LIGHT  = "rgba(108,99,255,0.20)";
const PURPLE_BORDER = "rgba(108,99,255,0.40)";
const BORDER        = "rgba(255,255,255,0.08)";
const WHITE_DIM     = "rgba(255,255,255,0.45)";
const WHITE_MID     = "rgba(255,255,255,0.75)";
const WHITE_BRIGHT  = "#e2d9ff";
const SURFACE       = "rgba(255,255,255,0.05)";
const SURFACE2      = "rgba(255,255,255,0.09)";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const History = ({ navigation }) => {
  const { chat, setChat }                           = useContext(ChatContext);
  const { chatID, setChatID }                       = useContext(ChatIDContext);
  const { setHistoryChatClick }                     = useContext(HistoryChatClicked);

  const route = useRoute();
  useEffect(() => {
    if (route.name === "History") setHistoryChatClick(false);
  }, [route.name]);

  const addMessage = () => {
    setChat(prev => {
      const id = uuid.v4();
      setChatID(id);
      return [...prev, { id, date: new Date().toISOString(), content: [] }];
    });
  };

  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>No chats yet</Text>
      <Text style={styles.emptySubtitle}>
        Start a new conversation and it will appear here.
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgBase} />
      <View style={styles.bgSheen} />
      <View style={styles.topAccent} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>History</Text>
          <Text style={styles.headerSub}>{chat.length} conversation{chat.length !== 1 ? "s" : ""}</Text>
        </View>
        <TouchableOpacity style={styles.newBtn} onPress={addMessage} activeOpacity={0.8}>
          <Text style={styles.newBtnIcon}>+</Text>
          <Text style={styles.newBtnText}>New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={[...chat].reverse()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item, index }) => {
          const isActive   = chatID === item.id;
          const msgCount   = Math.floor(item.content.length / 2);
          const chatNumber = chat.length - index;

          return (
            <TouchableOpacity
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => {
                setChatID(item.id);
                setHistoryChatClick(true);
                navigation.navigate("RAG");
              }}
              activeOpacity={0.75}
            >
              {/* Left accent */}
              {isActive && <View style={styles.cardAccentBar} />}

              {/* Avatar */}
              <View style={[styles.avatar, isActive && styles.avatarActive]}>
                <Text style={styles.avatarText}>{chatNumber}</Text>
              </View>

              {/* Info */}
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, isActive && styles.cardTitleActive]}>
                  Chat {chatNumber}
                </Text>
                <Text style={styles.cardMeta}>
                  {msgCount} message{msgCount !== 1 ? "s" : ""}
                  {item.date ? "  ·  " + formatDate(item.date) : ""}
                </Text>
              </View>

              {/* Right */}
              <View style={styles.cardRight}>
                {item.date && (
                  <Text style={styles.cardTime}>{formatTime(item.date)}</Text>
                )}
                {isActive && (
                  <View style={styles.activePill}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activePillText}>Active</Text>
                  </View>
                )}
                <Text style={styles.cardChevron}>›</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  root: { flex: 1 },
  bgBase:  { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,14,30,0.97)" },
  bgSheen: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(108,99,255,0.04)" },
  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: PURPLE, opacity: 0.75, zIndex: 10,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: "rgba(10,14,30,0.95)",
  },
  headerTitle: {
    fontSize: 22, fontWeight: "700",
    color: WHITE_BRIGHT, letterSpacing: 0.2,
  },
  headerSub: {
    fontSize: 12, color: WHITE_DIM, marginTop: 3,
  },
  newBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1, borderColor: PURPLE_BORDER,
    borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 9,
  },
  newBtnIcon: { color: "#a78bfa", fontSize: 18, fontWeight: "300", lineHeight: 20 },
  newBtnText: { color: WHITE_BRIGHT, fontSize: 13, fontWeight: "600" },

  /* List */
  listContent: {
    padding: 16, paddingBottom: 32, flexGrow: 1,
  },

  /* Empty */
  emptyWrap: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingTop: 80,
  },
  emptyIcon:     { fontSize: 48, marginBottom: 16 },
  emptyTitle:    { fontSize: 18, fontWeight: "700", color: WHITE_MID, marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: WHITE_DIM, textAlign: "center", lineHeight: 20, paddingHorizontal: 32 },

  /* Card */
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SURFACE,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    overflow: "hidden",
    position: "relative",
  },
  cardActive: {
    backgroundColor: PURPLE_LIGHT,
    borderColor: PURPLE_BORDER,
  },
  cardAccentBar: {
    position: "absolute", left: 0, top: 0, bottom: 0,
    width: 3, backgroundColor: PURPLE, borderRadius: 2,
  },

  /* Avatar */
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: SURFACE2,
    borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  avatarActive: {
    backgroundColor: "rgba(108,99,255,0.30)",
    borderColor: PURPLE_BORDER,
  },
  avatarText: { color: WHITE_BRIGHT, fontSize: 14, fontWeight: "700" },

  /* Info */
  cardInfo:       { flex: 1 },
  cardTitle:      { fontSize: 14, fontWeight: "600", color: WHITE_MID, marginBottom: 4 },
  cardTitleActive:{ color: WHITE_BRIGHT },
  cardMeta:       { fontSize: 12, color: WHITE_DIM },

  /* Right */
  cardRight: { alignItems: "flex-end", gap: 4 },
  cardTime:  { fontSize: 11, color: WHITE_DIM },
  cardChevron:{ fontSize: 20, color: WHITE_DIM, lineHeight: 22 },

  activePill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(52,199,160,0.15)",
    borderWidth: 1, borderColor: "rgba(52,199,160,0.30)",
    borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3,
  },
  activeDot:      { width: 5, height: 5, borderRadius: 3, backgroundColor: "#34c7a0" },
  activePillText: { fontSize: 10, color: "#34c7a0", fontWeight: "600" },
});