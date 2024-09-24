import {Account, Avatars, Storage, Client, Databases, ID, Query} from 'react-native-appwrite';
// configAndroid
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.serioga.aora',
    projectId: '66ed2964003d545e8e92',
    databaseId: '66ed2a650026662fe3c3',
    userCollectionId: '66ed2a7f002a4b97826f',
    videoCollectionId: '66ed2b11002e39cd4ac2',
    storageId: '66ed2de600264852e94a'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint Ваша конечная точка Appwrite
    .setProject(config.projectId) // Your project ID Ваш идентификатор проекта
    .setPlatform(config.platform) // Your application ID or bundle ID. Ваш идентификатор приложения или идентификатор пакета.

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


// Register user
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);
        // console.log('username createUser',username)
        // console.log('email createUser',email)
        // console.log('password createUser',password)
        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}


// Sign In
export const signIn = async (email, password) => {
    try {
        console.log('email signIn', email)
        console.log('password signIn', password)
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

//getCurrentUser
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()
        if (!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error)
    }
}

// get all posts
export const getAllPosts = async () => {
    try {

        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt')] //get all posts от нового к старому
        )

        return posts.documents;

    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}

// get last posts
export const getLastPosts = async () => {
    try {

        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(8))]
        )
        return posts.documents;
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}

// Get video posts that matches search query
export const searchPosts = async (query) => {
    // console.log('query',query)
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', query)]
        );

        if (!posts) throw new Error("Something went wrong");
        // console.log('posts.documents',posts.documents)
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}


// Get video posts for edit
export const getEditPost = async (postId) => {
    // console.log('getEditPost postId',postId)
    try {
        const posts = await databases.getDocument(
            config.databaseId,
            config.videoCollectionId,
            postId
        );

        if (!posts) throw new Error("Something went wrong");
        // console.log('posts.documents',posts.documents)
        return posts;
    } catch (error) {
        throw new Error(error);
    }
}

export const updatePost = async (form) => {

    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const postUpdate =await databases.updateDocument(
            config.databaseId,
            config.videoCollectionId,
            form.postId,
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                promt: form.promt,
                creatore: form.userId

            }
        )
        return postUpdate

    }catch (error){
        throw new Error(error)
    }
}


// Get user posts
export const getUserPosts = async (userId) => {
    try {

        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [
                Query.equal('creatore', userId),
                Query.orderDesc('$createdAt') // Сортировка от нового к старому
            ]
        )
        if (!posts) throw new Error("Something went wrong");
        return posts.documents;


    } catch (error) {
        throw new Error(error);
    }
}

// logOut
export const signOut = async () => {
    try {

        const session = await account.deleteSession('current');

        return session;

    } catch (error) {
        throw new Error(error);
    }
}

// getFilePreview
export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {

        if (type === 'video') {
            fileUrl = storage.getFileView(config.storageId, fileId)
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(config.storageId, fileId,
                2000, 2000, 'top', 100
            )
        } else {
            throw new Error('Invalid file type')
        }

        if (!fileUrl) throw Error

        return fileUrl;

    } catch (error) {
        throw new Error(error)
    }
}

// uploadFile
export const uploadFile = async (file, type) => {

    if (!file) return;

    // const {mimeType, ...res} = file;
    // const asset = {type: mimeType, ...res};

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }
    console.log('FILE', file)

    try {

        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        )
        console.log('UPLOADED', uploadedFile)

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;

    } catch (error) {
        throw new Error(error);
    }

}

// upload video
export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newPost = await databases.createDocument(
            config.databaseId,
            config.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                promt: form.promt,
                creatore: form.userId
            }
        )

        return newPost;

    } catch (error) {
        throw new Error(error);
    }
}

// delete video post
export const deletePost = async (postId) => {
    console.log('----------------')
    console.log('postId',postId)
    // console.log('userId',userId)
    try {
        const posts = await databases.deleteDocument(
            config.databaseId,
            config.videoCollectionId,
            postId
        );

        if (!posts) throw new Error("Something went wrong");
        console.log('id post for delete',posts.documents)
        // return posts.documents;

    } catch (error) {
        throw new Error('error delete post',error);
    }
}



