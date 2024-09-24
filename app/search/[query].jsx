import {View, Text,  FlatList, Image} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import React, {useEffect} from "react";
import {searchPosts} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import {Link, useLocalSearchParams} from "expo-router";
import {icons} from '../../constants'
import BackToHome from "../../components/BackToHome";

const Search = () => {

    const {query} = useLocalSearchParams();
    const {data: posts, refresh} = useAppwrite(() => searchPosts(query));

    useEffect(() => {
        refresh();
    }, [query]);

    return (
        <SafeAreaView className="bg-primary h-full">

                <BackToHome/>


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
                    />
                )}
                ListHeaderComponent={() => (
                    <>
                        <View className="flex my-6 px-4">
                            <Text className="font-pmedium text-gray-100 text-sm">
                                Search Results
                            </Text>
                            <Text className="text-2xl font-psemibold text-white mt-1">
                                {query}
                            </Text>

                            <View className="mt-6 mb-8">
                                <SearchInput initialQuery={query} refresh={refresh}/>
                            </View>
                        </View>
                    </>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No videos found for this search query"
                    />
                )}
            />
        </SafeAreaView>
    )
}
export default Search;