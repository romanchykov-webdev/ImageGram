import {Text, View} from "react-native";
import React from "react";

const InfoBox = ({title, subtitle,containerStyle,titleStyle}) => {
    // console.log('username',username)
    return (
        <View
            className={containerStyle}
        >
            <Text
                className={` text-white text-center font-psemibold ${titleStyle}`}
            >{title}</Text>

            <Text
                className={`text-sm text-gray-100 text-center font-pregular`}
            >{subtitle}</Text>

        </View>
    )
}

export default InfoBox;