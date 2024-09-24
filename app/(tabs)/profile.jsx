import {View, Text, FlatList, Image, TouchableOpacity, RefreshControl} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

import EmptyState from "../../components/EmptyState";
import React, {useEffect, useState} from "react";
import {deletePost, getUserPosts, signOut} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import {icons} from '../../constants'
import {useGlobalContext} from "../../context/GlobalProvider";
import InfoBox from "../../components/InfoBox";
import {router} from "expo-router";

const Profile = () => {
    const {user, setUser, setIsLoggedIn} = useGlobalContext()
const profilePage=true
    const {data: initialPosts,refresh} = useAppwrite(() => getUserPosts(user.$id));
    // Локальное состояние для управления постами
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        setPosts(initialPosts)
    },[initialPosts])

    // console.log('-------------------------')
    // console.log('posts', posts)
    // console.log('user', user.avatar)
    // console.log('posts', posts)

    const logout = async () => {
        // console.log('logOut')
        await signOut()

        setUser(null)
        setIsLoggedIn(false);
        router.replace('/sign-in')
    }

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh=async ()=>{
        setRefreshing(true)
        await refresh();
        setRefreshing(false)
    }

    const deletePostHandler=async (postId)=> {
        try {

            await deletePost(postId);
            // Обновляем список постов, исключая удаленный пост
            const updatePosts=posts.filter(post=>post.$id !== postId);
            setPosts(updatePosts);

        }catch (error) {
            console.error('Ошибка при удалении поста:', error);
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full">

            {/*<BackToHome/>*/}

            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({item}) => (
                    <VideoCard
                        title={item.title}
                        thumbnail={item.thumbnail}
                        video={item.video}
                        creator={item.creatore.username}
                        avatar={item.creatore.avatar}
                        postId={item.$id}
                        userId={user.$id}
                        creatorId={item.creatore.$id}
                        profilePage={profilePage}
                        deletePostHandler={deletePostHandler}
                        // refresh={refresh}
                    />
                )}
                ListHeaderComponent={() => (
                    <View
                        className="  justify-center items-centermt-6 px-4
                        {/*items-end*/}
                        py-5
                        {/*flex-end*/}
                        mb-5
                        mt-[-5px]
                        {/*border-2 border-red-500*/}
                        "
                    >
                        {/*logOut*/}
                        <TouchableOpacity
                            className="items-end mb-5 mt-5
                            {/*border-2 border-red-500*/}
                            "
                            onPress={logout}
                        >
                            <Image
                                source={icons.logout}
                                className="w-6 h-6
                                {/*border-2 border-red-500*/}
                                "
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        {/*user avatar and user name*/}
                        <View
                            className="items-center mb-6
                            {/*border-2 border-red-500*/}
                            "
                        >
                            <View
                                className=" w-16 h-16 mb-3 border border-secondary p-0.5 justify-center items-center rounded-lg overflow-hidden"
                            >
                                <Image
                                    source={{uri: user?.avatar}}
                                    className=" w-[95%] h-[95%] rounded-lg"
                                    resizeMode="contain"
                                />
                            </View>

                            <Text
                                className="text-base capitalize text-gray-100 font-psemibold
                                {/*border-2 border-red-500*/}
                                "
                                numberOfLines={1}
                            >{user?.username}</Text>
                        </View>

                        {/*user post and views video*/}
                        <View
                            className={`mt-5 flex-row justify-center`}
                        >
                            <InfoBox
                                title={posts.length || 0}
                                subtitle={`Posts`}
                                containerStyle={`mr-10`}
                                titleStyle={`text-lg`}
                            />
                            <InfoBox
                                title={`1.2K`}
                                subtitle={`Followers`}
                                titleStyle={`text-lg`}
                            />
                        </View>
                    </View>

                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No videos found for this search query"
                    />
                )}


                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            />
        </SafeAreaView>
    )
}
export default Profile;