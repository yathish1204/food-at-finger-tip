import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {

  const[isSubmitted,setIsSubmitted]=useState(false);
  const[form,setForm]=useState({name:"",email:"",password:""});

  const submit = async()=>{

    const {name,email,password}=form;
    if(!email || !password || !name) return Alert.alert("Error","Please enter valid data");

    setIsSubmitted(true);

    try {
      await createUser({email,password,name})
      router.replace("/")
    } catch (error:any) {
      Alert.alert("Error",error.message);
    }finally{
      setIsSubmitted(false);
    }

  }

  return (
    <SafeAreaView>
      <View className="gap-10 bg-white rounded-lg p-5 mt-5">

      <CustomInput
        placeholder="Enter your Full Name"
        value={form.name}
        onChangeText={(text) => setForm((prev)=>({...prev,name:text}))}
        label="Full Name"
      />
      <CustomInput
        placeholder="Enter your Email"
        value={form.email}
        onChangeText={(text) => setForm((prev)=>({...prev,email:text}))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your Password"
        value={form.password}
        onChangeText={(text) => setForm((prev)=>({...prev,password:text}))}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title="Sign Up" isLoading={isSubmitted} onPress={submit}
      />

    <View className="flex justify-center mt-5 flex-row gap-2">
      <Text className="base-regular text-gray-100">Already a User?</Text>
      <Link href={"/sign-in"} className="base-bold text-primary">Sign In</Link>
    </View>

    </View>
    </SafeAreaView>
  );
}
