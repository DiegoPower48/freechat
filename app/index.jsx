import {
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { Link, Stack, router } from "expo-router";
import { useController, useForm } from "react-hook-form";
import axios from "axios";
import { useCounterStore } from "../providers/dataStore";
import { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

function Input({ name, control, secureTextEntry }) {
  const { field } = useController({
    control,
    defaultValue: "",
    name,
  });

  return (
    <TextInput
      className="border-l-2 flex-auto bg-white w-60 rounded-r-xl text-black text-center"
      value={field.value}
      onChangeText={field.onChange}
      secureTextEntry={secureTextEntry}
    />
  );
}

export default function Index() {
  const { handleSubmit, control } = useForm();
  const [color, setColor] = useState("bg-white");
  const [color2, setColor2] = useState("white");
  const [color3, setColor3] = useState("white");

  const [images, setImages] = useState([]);
  const [numberImage, setNumberImage] = useState(1);
  const [error, setError] = useState("");

  const setUsername = useCounterStore((state) => state.setUserName);
  const setRoom = useCounterStore((state) => state.setRoom);
  const setAuthenticated = useCounterStore((state) => state.setAuthenticated);

  const setAvatar = useCounterStore((state) => state.setAvatar);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "https://portfolio-c4l9.onrender.com/loginin",
        data
      );
      if (res.status === 200) {
        setUsername(data.nombre);
        setAuthenticated();
        setAvatar(images[numberImage]);
        router.replace("/chat");
      }
    } catch (error) {
      setError(error.response.data);
    }
  };

  useEffect(() => {
    async function loadTeddys() {
      try {
        const res = await axios.get(
          "https://portfolio-c4l9.onrender.com/store"
        );
        setImages(res.data.map((item) => item.image));
      } catch (error) {
        console.log(error);
      }
    }
    loadTeddys();
  }, []);

  useEffect(() => {
    setTimeout(() => setError(""), 5000);
  }, [error]);

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000000" },
          headerTitleStyle: {
            display: "flex",
            color: "white",
            fontWeight: "900",
          },
          headerTitle: "Login",
        }}
      />
      <ScrollView className="bg-black">
        <View className="flex-row w-96 m-2 ml-16">
          <Pressable
            className="w-10 h-10 ml-2 mt-10 "
            onPress={() =>
              setNumberImage((prevNumber) => {
                return prevNumber <= 1 ? 1 : prevNumber - 1;
              })
            }
            onPressIn={() => setColor2("black")}
            onPressOut={() => setColor2("white")}
          >
            <AntDesign name="caretleft" size={40} color={color2} />
          </Pressable>
          <Image
            className=" w-40 h-40 border-white rounded-xl p-1"
            source={{
              uri: `${images[numberImage]}`,
            }}
          />
          <Pressable
            className="w-10 h-10 mr-1 mt-10 "
            onPress={() => setNumberImage(numberImage + 1)}
            onPressIn={() => setColor3("black")}
            onPressOut={() => setColor3("white")}
          >
            <AntDesign name="caretright" size={40} color={color3} />
          </Pressable>
        </View>

        <View className="flex-row items-center m-5 ">
          <View className="bg-black p-2 border-2 rounded-l-lg border-slate-100">
            <Text className="w-20 text-white">Username:</Text>
          </View>
          <View className="bg-black">
            <Input name={"nombre"} control={control} />
          </View>
        </View>
        <View className="flex-row items-center m-5 ">
          <View className="bg-black p-2 border-2 rounded-l-lg border-slate-100">
            <Text className="w-20 text-white">Password:</Text>
          </View>
          <View>
            <Input
              name={"contraseña"}
              control={control}
              secureTextEntry={true}
            />
          </View>
        </View>
        <View className="flex-row items-center">
          <Text className="text-white w-48 p-5">
            Ingresa nombre de sala(maximo 10 caracteres):
          </Text>
          <TextInput
            maxLength={10}
            className="mt-5 p-2 w-40 bg-white rounded-xl font-bold text-center"
            onChangeText={(value) => setRoom(value)}
          />
        </View>
        <Pressable
          title="Submit"
          onPress={handleSubmit(onSubmit)}
          className="items-center "
          onPressIn={() => setColor("text-white bg-black border-white")}
          onPressOut={() => setColor("text-black  bg-white")}
        >
          <Text
            className={`${color} content-evenly mb-6 font-bold border-2 rounded-lg mt-5 p-4 text-center  w-72 `}
          >
            Ingresar
          </Text>
        </Pressable>
        {error === "" ? (
          <Text className=" ml-16 pb-4"></Text>
        ) : (
          <Text className="text-yellow-400 font-bold ml-16 pb-4">{error}</Text>
        )}
        <Link
          className="p-2 w-60 text-center rounded-xl ml-14 bg-white"
          href={"register"}
        >
          <Text className="text-black ">No tienes cuenta, registrate</Text>
        </Link>
      </ScrollView>
    </View>
  );
}
