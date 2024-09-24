import {Account, Avatars, Storage, Client, Databases, ID, Query} from 'react-native-appwrite';
// configAndroid
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.aoraIphone.aora',
    projectId: '66eed01700213596a253',
    databaseId: '66eed126003ce59822a2',
    userCollectionId: '66eed14f0001ae03f1cd',
    videoCollectionId: '66eed37d0012a0d36384',
    storageId: '66eed5170026a710db0a'
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
        )

        return posts.documents;

    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}

// get last posts
export const getLastPasts = async () => {
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







