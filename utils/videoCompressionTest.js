import { VideoCompressor, CompressionLevel } from 'react-native-video-compressor';

export const compressVideo = async (uri) => {
    try {
        const originalFileInfo = await getFileInfo(uri);

        const compressedUri = await VideoCompressor.compress(
            uri,
            {
                compressionMethod: CompressionLevel.MediumQuality, // Среднее качество сжатия
            },
            (progress) => {
                console.log("Прогресс сжатия видео:", progress);
            }
        );

        const compressedFileInfo = await getFileInfo(compressedUri);

        return {
            originalSize: originalFileInfo.size,
            compressedUri,
            compressedSize: compressedFileInfo.size
        };
    } catch (error) {
        console.error("Ошибка сжатия видео:", error);
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
