import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';

import {icons} from '../constants';
import {useState} from "react";
import {ResizeMode, Video} from "expo-av";
import {deletePost} from "../lib/appwrite";
import editIcon from "../assets/icons/editIcon.png";
import {Link, router} from "expo-router";
import {useGlobalContext} from "../context/GlobalProvider";


const VideoCard = ({
                       title,
                       creator,
                       avatar,
                       thumbnail,
                       video,
                       postId,
                       userId,
                       creatorId,
                       profilePage,
                       deletePostHandler
                   }) => {

    const [play, setPlay] = useState(false)
    const {setEditPostId} = useGlobalContext()


    const goToEditPost = (postId) => {
        setEditPostId(postId)
        router.push(`/edit_post/editPost`)
        // console.log('postId',postId)
    }

    // console.log('thumbnail',thumbnail)
    return (

        <View
            className="flex-col items-center px-4 mb-14"
        >
            <View
                className="flex-row gap-3 items-start "
            >
                <View
                    className="justify-center items-center flex-row flex-1"
                >
                    <View
                        className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5"
                    >
                        <Image
                            source={{uri: avatar}}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        />
                    </View>
                    <View
                        className="justify-center  flex-1 ml-3 gap-y-1"
                    >
                        <Text
                            className="text-white text-sm font-psemibold"
                            numberOfLines={1}
                        >
                            {title}
                        </Text>

                        <Text
                            className="text-gray-100 text-sm font-pregular"
                        >{creator}
                        </Text>
                    </View>
                </View>
                <View
                    className="text-gray-100 text-sm font-pregular flex-row items-center
                                    {/*border-2*/}
                                    {/*border-red-500*/}
                                "
                >
                    {/* Кнопка для отображения heard */}
                    {
                        userId !== creatorId && (
                            <>
                                <TouchableOpacity
                                    className={`ml-5 p-2`}
                                    // onPress={() => deletePostHandler(postId)}
                                >
                                    <Image
                                        source={icons.heart}
                                        className="w-8 h-8"

                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`ml-5 p-2`}
                                    // onPress={() => deletePostHandler(postId)}
                                >
                                    <Image
                                        source={icons.heartPulse}
                                        className="w-8 h-8"

                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </>
                        )
                    }
                    {/* Кнопка для отображения deleteIcon  end editIcon*/}
                    {
                        profilePage && userId === creatorId && (
                            <>
                                <TouchableOpacity
                                    className={`ml-5 p-2`}
                                    onPress={() => deletePostHandler(postId)}>
                                    <Image
                                        source={icons.deleteIcon}
                                        className="w-8 h-8"

                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`ml-5 p-2`}
                                    // onPress={() => console.log('postId',postId)}
                                    onPress={()=>goToEditPost(postId)}
                                >
                                    <Image
                                        source={icons.editIcon}
                                        className="w-8 h-8"

                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </>
                        )
                    }


                </View>
            </View>

            {
                play ? (
                    <Video
                        source={{
                            uri: video
                        }}
                        className="w-full h-60 rounded-xl"
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls
                        shouldPlay
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setPlay(false);
                            }
                        }}
                    />
                ) : (
                    <TouchableOpacity
                        className="w-full h-60 rounded-xl mt-3 relative justify-center items-center
                          {/*border-2*/}
                          {/*border-red-500*/}
                          "
                        activeOpacity={0.7}
                        onPress={() => setPlay(true)}
                    >
                        <Image
                            source={{uri: thumbnail}}
                            className="w-full h-full rounded-xl mt-3"
                            resizeMode="cover"
                        />
                        <Image
                            source={icons.play}
                            className="w-12 h-12 absolute"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )
            }


        </View>
    )
}
export default VideoCard;