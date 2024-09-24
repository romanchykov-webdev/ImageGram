import {Image, Text, View} from "react-native";
import {icons} from "../constants";
import {Link} from "expo-router";
import React from "react";


const BackToHome = () => {
    return (
        <View
            className="pt-3 pl-5 mb-5 mt-3
                {/*border-2 border-red-500*/}
                "
        >
        <Link
            className="flex-row "
            href="/home"
        >
            <View className="flex-row items-center
                     {/*border-2 border-red-500*/}
                    ">
                <Image
                    source={icons.leftArrow}
                    className="
                        {/*border-2 border-red-500*/}
                        w-5 h-5
                        ml-5
                        "
                    resizeMode="contain"
                />
                <Text
                    className="text-3xl text-gray-100 pl-5 underline"
                >
                    Home ...
                </Text>
            </View>

        </Link>
        </View>
    )
}

export default BackToHome;