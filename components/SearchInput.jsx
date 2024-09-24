import {useState} from "react";
import {View, Text, TextInput, TouchableOpacity, Image, Alert} from "react-native";

import {icons} from "../constants";
import {usePathname,router} from "expo-router";

const SearchInput = ({placeholder,initialQuery}) => {

    const pathname=usePathname()
    const [query, setQuery] = useState(initialQuery || '')

    return (


        <View
            className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary"
        >
            <TextInput
                className="text-base mt-0.5 text-white flex-1 font-pregular"
                value={query}
                placeholder={placeholder}
                placeholderTextColor="#CDCDE0"
                onChangeText={(e)=>setQuery(e)}

            />
            <TouchableOpacity
                onPress={()=>{
                    if(!query){
                        return Alert.alert("Missing query","Please input something to search result across database")
                    }

                    if(pathname.startsWith('/search')) router.setParams({query})
                    else router.push(`/search/${query}`)
                }}
            >
                <Image
                    source={icons.search}
                    className="w-5 h-5"
                    resizeMode="contain"
                />
            </TouchableOpacity>

        </View>

    );
};

export default SearchInput;