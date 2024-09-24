import {View, Text, ScrollView, Image, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";

import {images} from '../../constants'
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

import {Link, router} from "expo-router";
import {getCurrentUser, signIn} from "../../lib/appwrite";
import {useGlobalContext} from "../../context/GlobalProvider";

const SignIn = () => {

    const {setUser, setIsLoggedIn} = useGlobalContext()

    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const submit = async () => {
        // console.log('submit sign up page ')
        // console.log('form',form.username)
        // console.log('signIn',form.email)
        // console.log('signIn',form.password)
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields')
        }
        setIsSubmitting(true)
        try {

            await signIn(
                form.email,
                form.password,
            )

            //     set it to global state...
            const result=await getCurrentUser()
            setUser(result)
            setIsLoggedIn(true)

            router.replace('/home')

        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
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
                    className="
                                  w-full
                                  min-h-[85vh]
                                  {/*h-full*/}
                                  justify-center
                                  px-4
                                  my-6
                                  "

                >
                    <Image
                        source={images.logo}
                        className="
                                      w-[115px]
                                      h-[35px]
                                      "
                        resizeMode="contain"
                    />
                    <Text
                        className="
                                      text-white
                                      text-2xl
                                      text-semibold
                                      mt-10
                                      font-psemibold
                                      "
                    >
                        Sign in
                    </Text>

                    <FormField
                        title="Email"
                        value={form.email}
                        placeholder='Email'
                        handleChangeText={(e) => setForm({
                            ...form,
                            email: e
                        })}
                        otherStyle="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        placeholder="Pasword"
                        value={form.password}
                        handleChangeText={(e) => setForm({
                            ...form,
                            password: e
                        })}
                    />
                    <CustomButton
                        title="Login in"
                        handlePress={submit}
                        containerStyle='my-7'
                        isLoading={isSubmitting}
                    />

                    <View className=" flex-row mt-5 justify-center
                    {/*border-2*/}
                    {/*border-red-500*/}
                    ">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don’t have an account? {'  '}

                        </Text>
                        <Link href="/sign-up"
                              className="text-lg font-psemibold text-secondary-200"
                        >Sign Up</Link>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn;