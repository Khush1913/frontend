import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, Animated, StatusBar } from "react-native";
import uuid from "react-native-uuid";
import { ChatIDContext } from "../context.js";
import ChatContext from "../context.js";
import { useContext } from "react";

const PURPLE = "#6c63ff";

const Entry = ({ navigation }) => {
  const { setChatID } = useContext(ChatIDContext);
  const { setChat }   = useContext(ChatContext);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textSlide = useRef(new Animated.Value(20)).current;
  const barWidth  = useRef(new Animated.Value(0)).current;

  const addMessage = () => {
    setChat(prev => {
      const id = uuid.v4();
      setChatID(id);
      return [...prev, { id, date: new Date().toISOString(), content: [] }];
    });
  };

  useEffect(() => {
    addMessage();

    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, speed: 8, bounciness: 8, useNativeDriver: true }),
      Animated.timing(textSlide, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
    ]).start();

    // Progress bar
    Animated.timing(barWidth, {
      toValue: 1, duration: 2800, useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => navigation.replace("RAG"), 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgBase} />
      <View style={styles.bgSheen} />
      <View style={styles.topAccent} />

      {/* Decorative rings */}
      <View style={styles.ring1} />
      <View style={styles.ring2} />

      {/* Logo */}
      <Animated.View style={[
        styles.logoWrap,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <View style={styles.logoGlow} />
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Text */}
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ translateY: textSlide }],
        alignItems: "center",
      }}>
        <Text style={styles.appName}>Medi-AI</Text>
        <Text style={styles.tagline}>Your intelligent health companion</Text>

        {/* Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>AI Powered</Text>
        </View>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[
          styles.progressFill,
          { width: barWidth.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }
        ]} />
      </View>

      <Text style={styles.loadingText}>Loading…</Text>
    </View>
  );
};

export default Entry;

const styles = StyleSheet.create({
  root:    { flex: 1, alignItems: "center", justifyContent: "center" },
  bgBase:  { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,14,30,0.97)" },
  bgSheen: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(108,99,255,0.04)" },
  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: PURPLE, opacity: 0.75,
  },

  /* Rings */
  ring1: {
    position: "absolute",
    width: 300, height: 300, borderRadius: 150,
    borderWidth: 1, borderColor: "rgba(108,99,255,0.10)",
  },
  ring2: {
    position: "absolute",
    width: 440, height: 440, borderRadius: 220,
    borderWidth: 1, borderColor: "rgba(108,99,255,0.05)",
  },

  /* Logo */
  logoWrap: {
    width: 160, height: 160,
    alignItems: "center", justifyContent: "center",
    marginBottom: 28, position: "relative",
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 80,
    backgroundColor: "rgba(108,99,255,0.14)",
    transform: [{ scale: 1.2 }],
  },
  logo: { width: 140, height: 140 },

  /* Text */
  appName: {
    fontSize: 36, fontWeight: "700",
    color: "#e2d9ff", letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14, color: "rgba(255,255,255,0.45)",
    marginBottom: 18, letterSpacing: 0.2,
  },

  /* Badge */
  badge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(108,99,255,0.18)",
    borderWidth: 1, borderColor: "rgba(108,99,255,0.38)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#a78bfa" },
  badgeText: { fontSize: 12, color: "#a78bfa", fontWeight: "600" },

  /* Progress */
  progressTrack: {
    position: "absolute", bottom: 60, left: 40, right: 40,
    height: 3, borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%", borderRadius: 2,
    backgroundColor: PURPLE,
  },

  loadingText: {
    position: "absolute", bottom: 38,
    fontSize: 12, color: "rgba(255,255,255,0.30)",
    letterSpacing: 0.2,
  },
});