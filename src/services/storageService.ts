import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";

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

        const blob: Blob = await new Promise(
            (resolve, reject) => {

                const xhr =
                    new XMLHttpRequest();

                xhr.onload = function () {
                    resolve(xhr.response);
                };

                xhr.onerror = function () {
                    reject(
                        new TypeError(
                            "Network request failed"
                        )
                    );
                };

                xhr.responseType = "blob";

                xhr.open(
                    "GET",
                    file.uri,
                    true
                );

                xhr.send(null);
            }
        );

        const filePath =
            `transactions/${userId}/${Date.now()}_${file.name}`;

        const storageRef =
            ref(storage, filePath);

        await uploadBytes(
            storageRef,
            blob,
            {
                contentType: file.type,
            }
        );

        const downloadURL =
            await getDownloadURL(
                storageRef
            );

        return {
            url: downloadURL,
            name: file.name,
            type: file.type,
        };

    } catch (error) {

        console.log(
            "Upload error:",
            error
        );

        throw error;
    }
};