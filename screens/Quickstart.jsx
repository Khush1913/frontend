import React, { useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, Image,
  TouchableOpacity, Animated, StatusBar
} from "react-native";

const QuickCheck = ({ navigation }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 12, bounciness: 6, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, speed: 10, bounciness: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgBase} />
      <View style={styles.bgSheen} />
      <View style={styles.topAccent} />

      {/* Decorative rings */}
      <View style={styles.ring1} />
      <View style={styles.ring2} />

      <Animated.View style={[
        styles.content,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>

        {/* Logo / image */}
        <Animated.View style={[styles.imageWrap, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.imageGlow} />
          <Image
            source={require("../assets/logo.png")}
            style={styles.robot}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>AI Powered</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Quick Check</Text>
        <Text style={styles.subtitle}>
          Ask me anything — symptoms, medicines, or health advice. I'm here to help.
        </Text>

        {/* Feature pills */}
        <View style={styles.pillsRow}>
          {["🩺 Symptoms", "💊 Medicine", "📋 Reports"].map((p, i) => (
            <View key={i} style={styles.pill}>
              <Text style={styles.pillText}>{p}</Text>
            </View>
          ))}
        </View>

        {/* Start button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RAG")}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Not a substitute for professional medical advice
        </Text>
      </Animated.View>
    </View>
  );
};

export default QuickCheck;

const PURPLE       = "#6c63ff";
const WHITE_DIM    = "rgba(255,255,255,0.50)";
const WHITE_MID    = "rgba(255,255,255,0.75)";
const WHITE_BRIGHT = "#e2d9ff";
const BORDER       = "rgba(255,255,255,0.08)";

const styles = StyleSheet.create({
  root: { flex: 1 },
  bgBase:  { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,14,30,0.97)" },
  bgSheen: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(108,99,255,0.04)" },
  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: PURPLE, opacity: 0.7, zIndex: 10,
  },

  /* Decorative rings */
  ring1: {
    position: "absolute",
    width: 340, height: 340, borderRadius: 170,
    borderWidth: 1, borderColor: "rgba(108,99,255,0.10)",
    top: "18%", alignSelf: "center",
  },
  ring2: {
    position: "absolute",
    width: 480, height: 480, borderRadius: 240,
    borderWidth: 1, borderColor: "rgba(108,99,255,0.05)",
    top: "9%", alignSelf: "center",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  /* Image */
  imageWrap: {
    width: 200, height: 200,
    alignItems: "center", justifyContent: "center",
    marginBottom: 24, position: "relative",
  },
  imageGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
    backgroundColor: "rgba(108,99,255,0.12)",
    transform: [{ scale: 1.15 }],
  },
  robot: { width: 180, height: 180 },

  /* Badge */
  badge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(108,99,255,0.18)",
    borderWidth: 1, borderColor: "rgba(108,99,255,0.35)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    marginBottom: 18,
  },
  badgeDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: "#a78bfa",
  },
  badgeText: { fontSize: 12, color: "#a78bfa", fontWeight: "600" },

  /* Text */
  title: {
    fontSize: 32, fontWeight: "700",
    color: WHITE_BRIGHT, letterSpacing: 0.3,
    marginBottom: 10, textAlign: "center",
  },
  subtitle: {
    fontSize: 14, color: WHITE_DIM,
    textAlign: "center", lineHeight: 22,
    marginBottom: 24, paddingHorizontal: 10,
  },

  /* Pills */
  pillsRow: {
    flexDirection: "row", gap: 8, marginBottom: 36,
  },
  pill: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
  },
  pillText: { fontSize: 12, color: WHITE_MID, fontWeight: "500" },

  /* Button */
  button: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "rgba(108,99,255,0.25)",
    borderWidth: 1, borderColor: "rgba(108,99,255,0.50)",
    borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 48,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 17, fontWeight: "700", color: WHITE_BRIGHT, letterSpacing: 0.3,
  },
  buttonArrow: { fontSize: 18, color: "#a78bfa" },

  disclaimer: {
    fontSize: 11, color: WHITE_DIM, textAlign: "center",
  },
});