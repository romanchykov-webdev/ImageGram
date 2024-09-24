import * as ImageManipulator from "expo-image-manipulator";

export const compressImage = async (uri) => {
    try {
        const originalFileInfo = await getFileInfo(uri);
        const manipulatedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],  // Размер для сжатия
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }  // Сжатие до 70% качества
        );

        const compressedFileInfo = await getFileInfo(manipulatedImage.uri);

        return {
            originalSize: originalFileInfo.size,
            compressedUri: manipulatedImage.uri,
            compressedSize: compressedFileInfo.size
        };
    } catch (error) {
        console.error("Ошибка сжатия изображения:", error);
    }
};

// Вспомогательная функция для получения информации о файле
const getFileInfo = async (uri) => {
    const fileInfo = await fetch(uri);
    const blob = await fileInfo.blob();
    return {
        size: blob.size,  // размер файла в байтах
    };
};
