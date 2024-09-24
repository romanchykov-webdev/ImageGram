import {View, Text, ScrollView, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import {Video, ResizeMode} from "expo-av";
import {router} from 'expo-router'
import {icons} from '../../constants'

import * as DocumentPicker from "expo-document-picker"
import {createVideo, getUserPosts} from "../../lib/appwrite";
import {useGlobalContext} from "../../context/GlobalProvider";
import * as ImagePicker from "expo-image-picker";
import useAppwrite from "../../lib/useAppwrite";

const EditPost = ({postId}) => {
    // const {data: initialPosts,refresh} = useAppwrite(() => getUserPosts(user.$id));
    // // Локальное состояние для управления постами
    // const [posts, setPosts] = useState([]);

    useEffect(()=>{
        setPosts(initialPosts)
    },[initialPosts])
    const {user} = useGlobalContext()

    const [uploading, setUploading] = useState(false)

    const [form, setForm] = useState({
        title: '',
        video: null,
        thumbnail: null,
        promt: ''
    })

    const openPicker = async (selectType) => {

        // const result = await DocumentPicker.getDocumentAsync({
        //     type: selectType === 'image'
        //         ? ['image/png', 'image/jpg','image/jpeg']
        //         : ['video/mp4', 'video/gif']
        // })
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: selectType === 'image'
                ? ImagePicker.MediaTypeOptions.Images
                : ImagePicker.MediaTypeOptions.Videos,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log('RESULT',result)

        if (!result.canceled) {
            if (selectType === 'image') {
                setForm({...form, thumbnail: result.assets[0]})
            }
            if (selectType === 'video') {
                setForm({...form, video: result.assets[0]})
            }
        }
        // else {
        //     setTimeout(() => {
        //         Alert.alert('Document picker', JSON.stringify(result, null, 2))
        //     })
        // }

    }

    const submit = async () => {
        console.log('uploading')
        if (!form.title || !form.video || !form.thumbnail || !form.promt) {
            return Alert.alert('Please fill in all the fields')
        }

        setUploading(true)

        try {
            await createVideo({
                ...form, userId: user.$id
            })


            Alert.alert('Success', 'Post uploaded successfully')
            router.push('/home')
        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setForm({
                title: '',
                video: null,
                thumbnail: null,
                promt: ''
            })
            setUploading(false)
        }


    }

    return (
        <SafeAreaView className={`bg-primary h-full`}>
            <ScrollView className={`px-4 my-6`}>
                <Text
                    className={`text-2xl text-white font-psemibold mb-5`}
                >
                    Upload Video
                </Text>
                <FormField
                    title={`Video Title`}
                    value={form.title}
                    placeholder={'Give your video a catch title ...'}
                    handleChangeText={(e) => setForm({...form, title: e})}
                    otherStyle="mt-10"
                />

                <View
                    className={`mt-7 space-y-2`}
                >
                    <Text
                        className={`text-base text-gray-100 font-pmedium`}
                    >
                        Upload Video
                    </Text>

                    <TouchableOpacity
                        onPress={() => openPicker('video')}
                    >
                        {form.video ? (
                            <Video
                                source={{uri: form.video.uri}}
                                className={`w-full h-64 rounded-2xl`}
                                // useNativeControls
                                resizeMode={ResizeMode.COVER}
                                // isLooping
                            />
                        ) : (
                            <View
                                className={`w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center`}
                            >
                                <View
                                    className={`w-14 h-14 border border-dashed border-secondary-100 justify-center items-center`}
                                >
                                    <Image
                                        source={icons.upload}
                                        className="w-1/2 h-1/2"
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>

                </View>
                <View
                    className={`mt-7 space-y-2 mb-10`}
                >
                    <Text
                        className={`text-base text-gray-100 font-pmedium`}
                    >
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity
                        onPress={() => openPicker('image')}
                    >
                        {form.thumbnail ? (
                            <Image
                                source={{uri: form.thumbnail.uri}}
                                className={`w-full h-64 rounded-2xl`}
                                resizeMode="contain"
                            />
                        ) : (
                            <View
                                className={`w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center
                                border-2 border-black-200 flex-row space-x-2
                                `}
                            >
                                <Image
                                    source={icons.upload}
                                    className="w-5 h-5"
                                    resizeMode="contain"
                                />
                                <Text
                                    className={`text-sm text-gray-100 font-pmedium`}
                                >Choose a file</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                </View>

                <FormField
                    title={`AI Prompt`}
                    value={form.promt}
                    placeholder={'The AI prompt of your video....'}
                    handleChangeText={(e) => setForm({...form, promt: e})}
                    otherStyle="mt-10"
                />


                <CustomButton
                    title={`Submit & Publish`}
                    containerStyle={`mt-10`}
                    handlePress={submit}
                    isLoading={uploading}
                    // ,textStyles,
                />
            </ScrollView>
        </SafeAreaView>
    )
}
export default EditPost;