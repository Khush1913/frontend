import React, { useState, useRef, useContext } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Animated, KeyboardAvoidingView,
  Platform, ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import uuid from "react-native-uuid";
import ChatContext, { ChatIDContext } from "../context.js";

const PURPLE        = "#6c63ff";
const PURPLE_LIGHT  = "rgba(108,99,255,0.20)";
const PURPLE_BORDER = "rgba(108,99,255,0.40)";
const BORDER        = "rgba(255,255,255,0.08)";
const WHITE_DIM     = "rgba(255,255,255,0.45)";
const WHITE_MID     = "rgba(255,255,255,0.75)";
const WHITE_BRIGHT  = "#e2d9ff";
const SURFACE       = "rgba(255,255,255,0.06)";
const SURFACE2      = "rgba(255,255,255,0.10)";

function Login({ navigation }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState(null);

  const { setChat }    = useContext(ChatContext);
  const { setChatID }  = useContext(ChatIDContext);

  const scaleBtn   = useRef(new Animated.Value(1)).current;
  const scaleGuest = useRef(new Animated.Value(1)).current;

  const pressIn  = (anim) => Animated.spring(anim, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = (anim) => Animated.spring(anim, { toValue: 1,    useNativeDriver: true }).start();

  /* Create a fresh chat and navigate to RAG */
  const handleGuestLogin = () => {
    setChat(prev => {
      const id = uuid.v4();
      setChatID(id);
      return [...prev, { id, date: new Date().toISOString(), content: [] }];
    });
    navigation.navigate("RAG");
  };

  const InputField = ({ icon, placeholder, value, onChangeText, secure, name, keyboard }) => {
    const isFocused = focused === name;
    return (
      <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
        <MaterialIcons name={icon} size={18} color={isFocused ? "#a78bfa" : WHITE_DIM} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={WHITE_DIM}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !showPass}
          keyboardType={keyboard || "default"}
          autoCapitalize="none"
          onFocus={() => setFocused(name)}
          onBlur={() => setFocused(null)}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShowPass(v => !v)}>
            <MaterialIcons
              name={showPass ? "visibility" : "visibility-off"}
              size={18} color={WHITE_DIM}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgBase} />
      <View style={styles.bgSheen} />
      <View style={styles.topAccent} />
      <View style={styles.ring1} />
      <View style={styles.ring2} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoGlow} />
            <View style={styles.logoInner}>
              <Text style={styles.logoText}>M</Text>
            </View>
          </View>

          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Medi AI</Text>
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your health journey</Text>

          {/* Inputs */}
          <View style={styles.form}>
            <InputField
              name="email" icon="email"
              placeholder="Email address"
              value={email} onChangeText={setEmail}
              keyboard="email-address"
            />
            <InputField
              name="pass" icon="lock-outline"
              placeholder="Password"
              value={password} onChangeText={setPassword}
              secure
            />
            <TouchableOpacity style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPressIn={() => pressIn(scaleBtn)}
              onPressOut={() => pressOut(scaleBtn)}
              activeOpacity={1}
            >
              <Text style={styles.loginBtnText}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <AntDesign name="google" size={18} color="#ea4335" />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <FontAwesome name="facebook" size={18} color="#1877f2" />
              <Text style={styles.socialBtnText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Guest — creates new chat then navigates */}
          <Animated.View style={{ transform: [{ scale: scaleGuest }] }}>
            <TouchableOpacity
              style={styles.guestBtn}
              onPressIn={() => pressIn(scaleGuest)}
              onPressOut={() => pressOut(scaleGuest)}
              onPress={handleGuestLogin}
              activeOpacity={1}
            >
              <Text style={styles.guestIcon}>👤</Text>
              <Text style={styles.guestBtnText}>Continue as Guest</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Sign up */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  root:    { flex: 1 },
  bgBase:  { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,14,30,0.97)" },
  bgSheen: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(108,99,255,0.04)" },
  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: PURPLE, opacity: 0.75, zIndex: 10,
  },
  ring1: {
    position: "absolute", width: 340, height: 340, borderRadius: 170,
    borderWidth: 1, borderColor: "rgba(108,99,255,0.08)",
    top: -80, alignSelf: "center",
  },
  ring2: {
    position: "absolute", width: 500, height: 500, borderRadius: 250,
    borderWidth: 1, borderColor: "rgba(108,99,255,0.04)",
    top: -160, alignSelf: "center",
  },
  scroll: {
    flexGrow: 1, justifyContent: "center",
    paddingHorizontal: 24, paddingVertical: 60,
  },
  logoWrap: {
    width: 72, height: 72, borderRadius: 36,
    alignSelf: "center", alignItems: "center",
    justifyContent: "center", marginBottom: 16, position: "relative",
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject, borderRadius: 36,
    backgroundColor: PURPLE_LIGHT, transform: [{ scale: 1.3 }],
  },
  logoInner: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: "rgba(108,99,255,0.35)",
    borderWidth: 1, borderColor: PURPLE_BORDER,
    alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: 28, fontWeight: "800", color: WHITE_BRIGHT },
  badge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1, borderColor: PURPLE_BORDER,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    alignSelf: "center", marginBottom: 20,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#a78bfa" },
  badgeText: { fontSize: 12, color: "#a78bfa", fontWeight: "600" },
  title: {
    fontSize: 28, fontWeight: "700", color: WHITE_BRIGHT,
    textAlign: "center", letterSpacing: 0.2, marginBottom: 8,
  },
  subtitle: {
    fontSize: 13, color: WHITE_DIM,
    textAlign: "center", marginBottom: 32, lineHeight: 20,
  },
  form: { marginBottom: 20 },
  inputWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: SURFACE,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 12,
  },
  inputWrapFocused: {
    borderColor: PURPLE_BORDER, backgroundColor: PURPLE_LIGHT,
  },
  input: { flex: 1, color: WHITE_BRIGHT, fontSize: 14 },
  forgotWrap: { alignItems: "flex-end", marginTop: 2 },
  forgotText: { fontSize: 12, color: "#a78bfa", fontWeight: "500" },
  loginBtn: {
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1, borderColor: PURPLE_BORDER,
    borderRadius: 14, paddingVertical: 15,
    alignItems: "center", marginBottom: 24,
  },
  loginBtnText: { color: WHITE_BRIGHT, fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  divider: {
    flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerText: { fontSize: 12, color: WHITE_DIM },
  socialRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  socialBtn: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
    backgroundColor: SURFACE2,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 12, paddingVertical: 13,
  },
  socialBtnText: { fontSize: 13, color: WHITE_MID, fontWeight: "500" },

  /* Guest button — slightly highlighted */
  guestBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12, paddingVertical: 14, marginBottom: 28,
  },
  guestIcon:    { fontSize: 15 },
  guestBtnText: { fontSize: 14, color: WHITE_MID, fontWeight: "600" },

  signupRow: { flexDirection: "row", justifyContent: "center" },
  signupText: { fontSize: 13, color: WHITE_DIM },
  signupLink: { fontSize: 13, color: "#a78bfa", fontWeight: "600" },
});