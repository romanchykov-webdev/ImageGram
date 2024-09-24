import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import React from 'react';

const CustomButton = ({title, handlePress, containerStyle, textStyles, isLoading}) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`
            bg-secondary
            rounded-xl
            min-h-[62]
            justify-center
            items-center
            ${containerStyle}
            ${isLoading ? 'opacity-50' : ''}
            `}
            disabled={isLoading}

        >
            {
                isLoading && <ActivityIndicator size="large" color="#00ff00" className={`absolute`}/>
            }

            <Text
                className={`
                text-lg
                text-primary
                font-psemibold
                ${textStyles}
                `}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default CustomButton;