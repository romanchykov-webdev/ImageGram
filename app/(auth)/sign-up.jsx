import {View, Text, ScrollView, Image, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {SafeAreaView} from "react-native-safe-area-context";

import {images} from '../../constants'
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

import {Link, router} from "expo-router";

import {createUser, getCurrentUser} from "../../lib/appwrite";
import {useGlobalContext} from "../../context/GlobalProvider";

const SignUp = () => {

    const {setUser, setIsLoggedIn} = useGlobalContext()

    // React.useState
    const [form, setForm] = React.useState({
        username: '',
        email: '',
        password: ''
    })


    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const submit = async () => {
        // console.log('submit sign up page ')
        // console.log('form',form.username)
        // console.log('form',form.email)
        // console.log('form',form.password)
        if(!form.username || !form.email || !form.password){
            Alert.alert('Error','Please fill in all the fields')
        }
        setIsSubmitting(true)
        try {

            const result=await createUser(
                form.email,
                form.password,
                form.username,
            )

            //     set it to global state...
            setUser(result)
            setIsLoggedIn(true)

            router.replace('/home')

        }catch(error){
            Alert.alert('Error',error.message)
        }finally {
            setIsSubmitting(false)
        }
        // // createUser()
    }


    return (
        <SafeAreaView
            className="
                          bg-primary
                          h-full
                          "
        >
            <ScrollView>
                <View
                    className="w-full  h-full justify-center px-4 my-6
                              {/*min-h-[85vh]*/}
                              "

                >
                    <Image
                        source={images.logo}
                        className="w-[115px] h-[35px]"
                        resizeMode="contain"
                    />
                    <Text
                        className="text-white text-2xl text-semibold mt-10 font-psemibold"
                    >
                        Sign up
                    </Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        placeholder={'Username'}
                        handleChangeText={(e) => setForm({
                            ...form,
                            username: e
                        })}
                        otherStyle="mt-10"
                    />
                    <FormField
                        title="Email"
                        placeholder={'Email'}
                        value={form.email}
                        handleChangeText={(e) => setForm({
                            ...form,
                            email: e
                        })}
                        otherStyle="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        placeholder={'Password'}
                        value={form.password}
                        handleChangeText={(e) => setForm({
                            ...form,
                            password: e
                        })}
                    />
                    <CustomButton
                        title="Sign Up"
                        handlePress={submit}
                        containerStyle='my-7'
                        isLoading={isSubmitting}
                    />

                    <View className=" flex-row mt-5 justify-center
                    {/*border-2*/}
                    {/*border-red-500*/}
                    ">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Already have an account? {'  '}

                        </Text>
                        <Link href="/sign-in"
                              className="text-lg font-psemibold text-secondary-200"
                        >Login</Link>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp;