const userService = {
    findByUid: uid => {
        return firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    save: (user_UID, user) => {
        return firebase.firestore()
            .collection("users")
            .doc(user_UID)
            .set(user);
    }
};