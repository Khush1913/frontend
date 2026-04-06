import React, { useContext } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import uuid from "react-native-uuid";
import { loginCredentials } from "../context";
import ChatContext, { ChatIDContext } from "../context";

const PURPLE        = "#6c63ff";
const PURPLE_LIGHT  = "rgba(108,99,255,0.20)";
const PURPLE_BORDER = "rgba(108,99,255,0.40)";
const BORDER        = "rgba(255,255,255,0.08)";
const WHITE_DIM     = "rgba(255,255,255,0.45)";
const WHITE_MID     = "rgba(255,255,255,0.75)";
const WHITE_BRIGHT  = "#e2d9ff";
const SURFACE       = "rgba(255,255,255,0.05)";
const RED_LIGHT     = "rgba(255,107,107,0.15)";
const RED_BORDER    = "rgba(255,107,107,0.35)";

const MENU_ITEMS = [
  { id: 1, title: "Settings",       icon: "settings-outline",     screen: "Settings",      color: "#a78bfa" },
  { id: 2, title: "Notifications",  icon: "notifications-outline", screen: "Notifications", color: "#34c7a0" },
  { id: 3, title: "History",        icon: "time-outline",          screen: "History",       color: "#ffc132" },
  { id: 4, title: "Support & Help", icon: "help-circle-outline",   screen: "Home",          color: "#60a5fa" },
];

export default function ProfileScreen({ navigation }) {
  const { loginCred }       = useContext(loginCredentials);
  const { setChat }         = useContext(ChatContext);
  const { setChatID }       = useContext(ChatIDContext);

  const displayName = loginCred?.user?.displayName || "Guest User";
  const email       = loginCred?.user?.email        || "No email";
  const initials    = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Create a fresh chat session
          setChat(prev => {
            const id = uuid.v4();
            setChatID(id);
            return [...prev, { id, date: new Date().toISOString(), content: [] }];
          });
          navigation.navigate("RAG");
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgBase} />
      <View style={styles.bgSheen} />
      <View style={styles.topAccent} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.statsRow}>
            {[
              { label: "Chats",   value: "12" },
              { label: "Queries", value: "48" },
              { label: "Reports", value: "5"  },
            ].map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.75}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconWrap, { backgroundColor: item.color + "22", borderColor: item.color + "44" }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={WHITE_DIM} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#ff6b6b" />
          <Text style={styles.logoutText}>Logout  →  New Chat</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Medi AI  ·  v1.0.0</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  bgBase:  { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,14,30,0.97)" },
  bgSheen: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(108,99,255,0.04)" },
  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: PURPLE, opacity: 0.75, zIndex: 10,
  },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 56 },
  pageTitle: {
    fontSize: 22, fontWeight: "700", color: WHITE_BRIGHT,
    letterSpacing: 0.2, textAlign: "center", marginBottom: 24,
  },
  profileCard: {
    backgroundColor: SURFACE,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 20, alignItems: "center",
    paddingVertical: 28, paddingHorizontal: 20, marginBottom: 24,
  },
  avatarRing: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 2, borderColor: PURPLE_BORDER,
    alignItems: "center", justifyContent: "center",
    marginBottom: 14, backgroundColor: PURPLE_LIGHT,
  },
  avatar: {
    width: 78, height: 78, borderRadius: 39,
    backgroundColor: "rgba(108,99,255,0.30)",
    alignItems: "center", justifyContent: "center",
  },
  avatarText:  { color: WHITE_BRIGHT, fontSize: 26, fontWeight: "700" },
  name:        { fontSize: 18, fontWeight: "700", color: WHITE_BRIGHT, marginBottom: 4 },
  email:       { fontSize: 13, color: WHITE_DIM, marginBottom: 22 },
  statsRow: {
    flexDirection: "row", width: "100%",
    borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 18,
  },
  statItem:  { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700", color: WHITE_BRIGHT, marginBottom: 3 },
  statLabel: { fontSize: 11, color: WHITE_DIM },
  sectionLabel: {
    fontSize: 10, fontWeight: "700", color: WHITE_DIM,
    letterSpacing: 0.12, marginBottom: 10, paddingHorizontal: 4,
  },
  menuCard: {
    backgroundColor: SURFACE,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 16, marginBottom: 14, overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: BORDER },
  menuLeft:       { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  menuText: { fontSize: 14, fontWeight: "500", color: WHITE_MID },
  logoutBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
    backgroundColor: RED_LIGHT,
    borderWidth: 1, borderColor: RED_BORDER,
    borderRadius: 14, paddingVertical: 14, marginBottom: 20,
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: "#ff6b6b" },
  version:    { textAlign: "center", fontSize: 12, color: WHITE_DIM },
});