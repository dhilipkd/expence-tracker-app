import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFileToStorage = async (
    file: {
        uri: string;
        name: string;
        type: string;
    },
    userId: string
) => {
    try {
        const storage = getStorage();

        // convert URI → blob
        const response = await fetch(file.uri);
        const blob = await response.blob();

        const filePath = `transactions/${userId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filePath);

        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        return {
            url: downloadURL,
            name: file.name,
            type: file.type,
        };
    } catch (error) {
        console.log("Upload error:", error);
        throw error;
    }
};