import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { router, Stack } from "expo-router";
import { useController, useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";

function Input({ name, control, type }) {
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
      keyboardType={type}
    />
  );
}

export default function Index() {
  const { handleSubmit, control } = useForm();
  const [error, setError] = useState([]);
  const [color, setColor] = useState("text-black bg-white ");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "https://portfolio-c4l9.onrender.com/registro",
        data
      );
      if (res.status === 200) {
        console.log("exito");
        router.replace("/");
      }
    } catch (errors) {
      console.log(errors.response.data);

      setError(errors.response.data);
      console.log(error);
    }
  };

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const renderErrors = () => {
    const elements = [];
    for (let index = 0; index < error.length; index++) {
      elements.push(
        <Text key={index} className="text-yellow-400 font-bold ml-16 pb-4">
          {error[index]}
        </Text>
      );
    }
    return elements;
  };

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
          headerTitle: "Registrate",
        }}
      />
      <ScrollView className="bg-black ">
        <View className="flex-row items-center m-5 mt-20 ">
          <View className="bg-black p-2 border-2 rounded-l-lg border-slate-100">
            <Text className="w-20 text-white">Username:</Text>
          </View>
          <View className="bg-black">
            <Input name={"nombre"} control={control} />
          </View>
        </View>
        <View className="flex-row items-center m-5 mb-20 mt-5 ">
          <View className="bg-black p-2 border-2 rounded-l-lg border-slate-100">
            <Text className="w-20 text-white">Password:</Text>
          </View>
          <View>
            <Input name={"contraseña"} control={control} />
          </View>
        </View>
        <View className="flex-row items-center m-5 mb-10 mt-5 ">
          <View className="bg-black p-2 border-2 rounded-l-lg border-slate-100">
            <Text className="w-20 text-white">Correo:</Text>
          </View>
          <View>
            <Input name={"correo"} control={control} type={"email"} />
          </View>
        </View>
        {error === "" ? (
          <Text className="text-yellow-400 font-bold ml-16 pb-4"></Text>
        ) : (
          renderErrors()
        )}

        <Pressable
          title="Submit"
          onPress={handleSubmit(onSubmit)}
          className="items-center           "
          onPressIn={() => setColor("text-white bg-black border-white")}
          onPressOut={() => setColor("text-black  bg-white")}
        >
          <Text
            className={`${color} content-evenly mb-6 font-bold border-2 rounded-lg mt-5 p-4 text-center  w-72 `}
          >
            Registrar
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
