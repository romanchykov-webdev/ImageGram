import {View, Text, TouchableOpacity, Modal, Pressable} from 'react-native';
import React from 'react';

const MenuModal = ({visible, onClose, onEdit, onDelete,postId}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white rounded-lg w-64 p-4">
                    <TouchableOpacity
                        onPress={() => {
                            onEdit(); // Вызов функции для редактирования
                            onClose();
                        }}
                        className="mb-4"
                    >
                        <Text className="text-lg text-blue-500">Редактировать</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            onDelete(); // Вызов функции для удаления
                            onClose();
                        }}
                        className="mb-4"
                    >
                        <Text>
                            postId:{postId}
                        </Text>
                        <Text className="text-lg text-red-500">Удалить</Text>
                    </TouchableOpacity>

                    <Pressable
                        onPress={onClose}
                        className="mt-4"
                    >
                        <Text className="text-lg text-gray-500">Отмена</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default MenuModal;
