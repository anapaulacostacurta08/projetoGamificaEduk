const contentService = {
    getContentByUID: async (uid) => {
        return await firebase.firestore()
            .collection("contents")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
}