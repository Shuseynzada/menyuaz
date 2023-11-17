import { useEffect, useState } from "react";
import { projectStorage, projectFirestore, timestamp } from "../firebase/config";

const useStorage = (file, collection) => {
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [url, setUrl] = useState(null)
    useEffect(() => {
        let size = 0
        const fileString = `${file.name}_${Date.now()}`
        const storageRef = projectStorage.ref(fileString);
        const collectionRef = projectFirestore.collection(collection)
        collectionRef.onSnapshot(async (snap) => {
            size = snap.size
            console.log(size)
        })

        storageRef.put(file).on("state_changed", (snapshot) => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setProgress(percentage)
        }, (err) => {
            setError(err)
        }, async () => {
            const url = await storageRef.getDownloadURL()
            collectionRef.add({
                url,
                createdAt: timestamp(),
                name: fileString,
                index: size
            })
            setUrl(url)
        })
    }, [file])

    return { progress, url, error }
}

export default useStorage