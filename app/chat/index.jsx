import { View, Text, TextInput, Image, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, Stack } from "expo-router";
import { useCounterStore } from "../../providers/dataStore";
import { io } from "socket.io-client";

const Index = () => {
  const userName = useCounterStore((state) => state.userName);
  const room = useCounterStore((state) => state.room);
  const avatar = useCounterStore((state) => state.avatar);
  const authenticated = useCounterStore((state) => state.authenticated);

  const scrollViewRef = useRef(null);

  const [input, setInput] = useState();
  const [messages, setMessages] = useState([""]);

  const socket = io.connect("https://portfolio-c4l9.onrender.com", {
    query: `room=${room}`,
  });

  const currentDate = new Date();
  const date = currentDate.toLocaleDateString();
  const time = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const enviaralback = (value) => {
    const textoEnviado = {
      nombre: userName,
      comentario: value,
      hora: time,
      fecha: date,
      avatar: avatar,
    };

    socket.emit(`chat${room}`, textoEnviado);
  };

  const onSubmit = (value) => {
    enviaralback(value.nativeEvent.text);
    setInput("");
  };

  useEffect(() => {
    setMessages([]);
    const receiveMessage = (message) =>
      setMessages((state) => [...state, message]);

    socket.on(`chat${room}`, receiveMessage);

    return () => {
      socket.off(`chat${room}`, receiveMessage);
    };
  }, []);

  useEffect(() => {
    if (!authenticated) {
      router.replace("/");
    }
  }, []);

  return (
    <View className="flex-1  bg-black pl-5 pr-5">
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        className="flex-1"
      >
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: "yellow" },
            headerTitle: `Sala: ${room}`,
            headerRight: () => <Text className=" ">Hola {userName}</Text>,
          }}
        />
        <View className="flex-1 items-center">
          <Text className="text-red-950 font-bold bg-white p-2 mb-2 mt-1 rounded-xl text-center w-28">
            Bienvenido
          </Text>
        </View>

        <ScrollView className="flex-1">
          {messages.map((value, i) =>
            value.nombre === userName ? (
              <View key={i} className="w- flex-row">
                <View className="flex-row w-64 p-2 mb-2 bg-white rounded-lg ">
                  <View className="flex-1 flex-col">
                    <Text className="w-auto text-sm font-bold">Yo:</Text>
                    <Text className="w-auto">{value.comentario}</Text>
                  </View>
                  <Text className="text-amber-300 text-xs text-right self-end">
                    {value.hora}
                  </Text>
                </View>
                <Image
                  className="w-14 h-14 rounded-lg"
                  source={{ uri: value.avatar }}
                />
              </View>
            ) : (
              <View key={i} className="w-82 flex-row ">
                <Image
                  className="w-14 h-14 rounded-lg"
                  source={{ uri: value.avatar }}
                />
                <View className="flex-row w-64 p-2 mb-2 bg-orange-400 rounded-lg">
                  <View className="flex-1 flex-col">
                    <Text className="w-auto text-sm font-bold">
                      {value.nombre}:
                    </Text>
                    <Text className="w-auto">{value.comentario}</Text>
                  </View>
                  <Text className="text-amber-300 text-xs text-right self-end">
                    {value.hora}
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      </ScrollView>
      <TextInput
        onSubmitEditing={onSubmit}
        value={input}
        onChangeText={setInput}
        blurOnSubmit={false}
        placeholder="Escribe un mensaje"
        className="bg-white  w-70 rounded-xl p-1 m-1 mb-4"
      ></TextInput>
    </View>
  );
};

export default Index;
