import React, { useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function Settings() {
  const playerRef = useRef();

  return (
    <ScrollView style={styles.container}>

      {/* YouTube Player */}
      <YoutubePlayer
        ref={playerRef}
        height={230}
        play={false}
        videoId="iFdeEEh4L5U"   // <-- extracted from your link
      />

      {/* Instructions */}
      <View style={styles.instructionsBox}>
        <Text style={styles.heading}>How to Use the App</Text>

        <Text style={styles.step}>1️⃣ Open the app and login.</Text>
        <Text style={styles.step}>2️⃣ Navigate through the home menu.</Text>
        <Text style={styles.step}>3️⃣ Select any service you want.</Text>
        <Text style={styles.step}>4️⃣ Follow the on-screen instructions.</Text>
        <Text style={styles.step}>5️⃣ Watch the above video if stuck.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  instructionsBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
  },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  step: { fontSize: 16, marginBottom: 8, lineHeight: 22 },
});