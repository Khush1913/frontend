import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar
} from "react-native";

const tips = [
  { icon: "💧", text: "Drink 3–4 liters of water today to stay hydrated." },
  { icon: "🏃", text: "20 minutes of walking improves heart health significantly." },
  { icon: "🥗", text: "Eat more greens — they boost immunity and energy." },
  { icon: "😴", text: "7–8 hours of sleep helps your body recover and repair." },
];

const tools = [
  { icon: "🤖", label: "Chat AI",       bg: "rgba(108,99,255,0.15)", dot: "#a78bfa" },
  { icon: "📄", label: "Health Report", bg: "rgba(52,199,160,0.15)", dot: "#34c7a0" },
  { icon: "💊", label: "Medicine Guide",bg: "rgba(255,107,107,0.15)", dot: "#ff6b6b" },
  { icon: "🩺", label: "Symptom Check", bg: "rgba(255,193,50,0.15)",  dot: "#ffc132" },
];

const stats = [
  { value: "98%", label: "Uptime" },
  { value: "1.2M", label: "Queries" },
  { value: "4.9★", label: "Rating" },
];

const Home = () => {
  const [activeTip, setActiveTip] = useState(0);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Background layers */}
      <View style={styles.bgBase} />
      <View style={styles.bgSheen} />
      <View style={styles.topAccent} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back 👋</Text>
            <Text style={styles.username}>Medi AI Assistant</Text>
          </View>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>MA</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Search */}
        <TouchableOpacity style={styles.searchBox} activeOpacity={0.8}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Ask anything about your health…</Text>
        </TouchableOpacity>

        {/* Tools */}
        <Text style={styles.sectionTitle}>AI Tools</Text>
        <View style={styles.toolsGrid}>
          {tools.map((t, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.toolCard, { backgroundColor: t.bg, borderColor: t.dot + "55" }]}
              activeOpacity={0.75}
            >
              <View style={[styles.toolIconWrap, { borderColor: t.dot + "44" }]}>
                <Text style={styles.toolIcon}>{t.icon}</Text>
              </View>
              <Text style={styles.toolLabel}>{t.label}</Text>
              <View style={[styles.toolDot, { backgroundColor: t.dot }]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Tips */}
        <Text style={styles.sectionTitle}>Daily Health Tips</Text>
        <View style={styles.tipsWrap}>
          {tips.map((t, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tipCard, activeTip === i && styles.tipCardActive]}
              onPress={() => setActiveTip(i)}
              activeOpacity={0.8}
            >
              <Text style={styles.tipIcon}>{t.icon}</Text>
              <Text style={[styles.tipText, activeTip === i && styles.tipTextActive]}>
                {t.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default Home;

const PURPLE = "#6c63ff";
const WHITE_DIM = "rgba(255,255,255,0.55)";
const WHITE_MID = "rgba(255,255,255,0.75)";
const WHITE_BRIGHT = "#e2d9ff";
const BORDER = "rgba(255,255,255,0.08)";

const styles = StyleSheet.create({
  root: { flex: 1 },

  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,14,30,0.97)",
  },
  bgSheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(108,99,255,0.04)",
  },
  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: PURPLE, opacity: 0.7, zIndex: 10,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: (StatusBar.currentHeight ?? 44) + 16,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: { fontSize: 13, color: WHITE_DIM, marginBottom: 3 },
  username: { fontSize: 22, fontWeight: "700", color: WHITE_BRIGHT, letterSpacing: 0.2 },
  avatarWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: "rgba(108,99,255,0.25)",
    borderWidth: 1, borderColor: "rgba(108,99,255,0.5)",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: WHITE_BRIGHT, fontWeight: "700", fontSize: 14 },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  statValue: { color: WHITE_BRIGHT, fontSize: 16, fontWeight: "700" },
  statLabel: { color: WHITE_DIM, fontSize: 11, marginTop: 2 },

  /* Search */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 26,
  },
  searchIcon: { fontSize: 15 },
  searchText: { color: WHITE_DIM, fontSize: 14 },

  /* Section title */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: WHITE_MID,
    marginBottom: 12,
    letterSpacing: 0.1,
  },

  /* Tools grid */
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 26,
  },
  toolCard: {
    width: "47%",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: "flex-start",
    position: "relative",
  },
  toolIconWrap: {
    width: 42, height: 42, borderRadius: 11,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 10,
  },
  toolIcon: { fontSize: 20 },
  toolLabel: { fontSize: 13, fontWeight: "600", color: WHITE_MID },
  toolDot: {
    position: "absolute", top: 12, right: 12,
    width: 7, height: 7, borderRadius: 4,
  },

  /* Tips */
  tipsWrap: { gap: 10 },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  tipCardActive: {
    backgroundColor: "rgba(108,99,255,0.18)",
    borderColor: "rgba(108,99,255,0.40)",
  },
  tipIcon: { fontSize: 20 },
  tipText: { flex: 1, fontSize: 13, color: WHITE_DIM, lineHeight: 19 },
  tipTextActive: { color: WHITE_BRIGHT },
});