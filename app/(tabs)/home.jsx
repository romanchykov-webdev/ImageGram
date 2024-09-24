import {View, Text, ScrollView, FlatList, Image, RefreshControl, Alert} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";

import {images} from "../../constants"
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import {useEffect, useState} from "react";
import {getAllPosts,  getLastPosts} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import {useGlobalContext} from "../../context/GlobalProvider";

const Home = () => {

    const {user, setUser, setIsLoggedIn} = useGlobalContext()

    const {data: initialPosts, refresh} = useAppwrite(getAllPosts)
    const [posts, setPosts] = useState([])
    useEffect(()=>{
        setPosts(initialPosts)

    },[initialPosts])

    const {data: lastPosts,refresh:refreshLastPosts} = useAppwrite(getLastPosts)


    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        //re call videos -> if any new videos appeared
        await refresh();
        await refreshLastPosts()
        setRefreshing(false);
    }
    // console.log('posts2', posts)

    return (
        <SafeAreaView className="bg-primary h-full
         {/*border-2 border-red-500 */}
         ">
            <FlatList
                // data={[{id: 1}, {id: 2}, {id: 3}]}
                // data={[]}
                data={posts}
                keyExtractor={(item) => item.$id}
                // keyExtractor={(item) => item.id}
                renderItem={({item}) => (

                    <VideoCard
                        title={item.title}
                        thumbnail={item.thumbnail}
                        video={item.video}
                        creator={item.creatore.username}
                        avatar={item.creatore.avatar}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4 space-y-6">
                        <View className="justify-between items-start flex-row mb-6">
                            <View className={`ml-2`}>
                                <Text className="font-pmedium text-sm text-gray-100">
                                    Welcome Back
                                </Text>
                                <Text className="text-2xl font-psemibold text-white">
                                    {user?.username}
                                </Text>
                            </View>
                            <View>
                                <Image
                                    source={images.logoSmall}
                                    className="w-9 h-10"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        <SearchInput
                            placeholder="Search for a video topic"
                        />

                        <View
                            className="w-full flex-1 pt-5 pb-8"
                        >
                            <Text
                                className="text-gray-100 text-lg font-pregular mb-3"
                            >
                                Last Videos
                            </Text>
                            <Trending
                                posts={lastPosts ?? []}
                            />
                        </View>



                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="Be the first one to upload a video"
                    />
                )}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            />
            <StatusBar
                backgroundColor="#161622"
                style="light"
            />
        </SafeAreaView>
    )
}
export default Home;