import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import React, {useState} from "react";

import {icons} from'../constants'

const FormField = ({title, value, placeholder, handleChangeText, otherStyle, ...props}) => {

    const[showPassword, setShowPassword] = useState(false);



    return (
        <View
            className={`space-y-2 ${otherStyle}`}
        >
            <Text
                className="
                text-gray-100
                text-base
                font-pmedium
                "
            >
                {title}
            </Text>
            <View
                className="
                border-2
                border-balck-200
                w-full
                h-16
                px-4
                bg-black-100
                rounded-2xl
                focus:border-secondary
                items-center
                flex-row
                "
            >
                <TextInput
                    className="flex-1 w-full  text-white font-psemibold text-base
                    {/*border-2*/}
                    {/*border-red-500*/}
                    "
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7b7b8b"
                    onChange={handleChangeText}
                    secureTextEntry={title==='Password' && !showPassword}
                />
                {
                    title==='Password' && (
                        <TouchableOpacity
                            onPress={()=>setShowPassword(!showPassword)}
                            // className="border-2 border-red-500"
                        >
                          <Image
                              className="
                             w-6
                             h-6

                              "
                              resizeMode='contain'
                              source={showPassword ? icons.eye : icons.eyeHide}
                          />

                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    )
}
export default FormField