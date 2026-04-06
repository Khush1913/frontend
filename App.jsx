import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Entry from "./screens/Entry";
import RAG from "./screens/RAG";
import Home from "./screens/Home";
import Quickstart from "./screens/Quickstart";
import History from "./screens/History";
import NewChat from "./screens/NewChat";
import Login from "./screens/Login";
import Upload from "./screens/Upload";
import Profile from "./screens/Profile";

import ChatContext, {
  ChatIDContext,
  HistoryChatClicked,
  ResponseRecieved,
  loginCredentials
} from "./context.js";

const Stack = createNativeStackNavigator();

const App = () => {

  const [chat, setChat] = useState([]);
  const [chatID, setChatID] = useState(0);
  const [modelResponseRecieved, setModelResponseRecieved] = useState(true);
  const [historyChatClicked, setHistoryChatClick] = useState(false);

  // 🔹 LOGIN CONTEXT STATE
  const [loginCred, setLoginCred] = useState({
    user: {
      displayName: "Demo User",
      email: "demo@email.com",
    }
  });

  return (
    <ChatContext.Provider value={{ chat, setChat }}>

      <ChatIDContext.Provider value={{ chatID, setChatID }}>

        <HistoryChatClicked.Provider value={{ historyChatClicked, setHistoryChatClick }}>

          <ResponseRecieved.Provider value={{ modelResponseRecieved, setModelResponseRecieved }}>

            {/* ✅ LOGIN CONTEXT ADDED */}
            <loginCredentials.Provider value={{ loginCred, setLoginCred }}>

              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName="Entry"
                  screenOptions={{ headerShown: false }}
                >
                  <Stack.Screen name="Entry" component={Entry} />
                  <Stack.Screen name="RAG" component={RAG} />
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="Quickstart" component={Quickstart} />
                  <Stack.Screen name="History" component={History} />
                  <Stack.Screen name="NewChat" component={NewChat} />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Upload" component={Upload} />
                  <Stack.Screen name="Profile" component={Profile} />
                </Stack.Navigator>
              </NavigationContainer>

            </loginCredentials.Provider>

          </ResponseRecieved.Provider>

        </HistoryChatClicked.Provider>

      </ChatIDContext.Provider>

    </ChatContext.Provider>
  );
};

export default App;