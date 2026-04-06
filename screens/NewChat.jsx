import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Query from "../components/Query.jsx";

const NewChat = ({navigation}) => {

  navigation.replace("RAG"); // replace instead of push so splash won't come back

  return (
    <View style={{ flex: 1, padding: 10, marginTop: 30 }}>

    </View>
  );
};

export default NewChat;

const styles = StyleSheet.create({});
