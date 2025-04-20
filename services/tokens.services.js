const tokenService = {
    getTokenByActivityUid:  async (activity_uid) => {
    try {
        const querySnapshot = await firebase.firestore().collection("tokens")
        .where("activity_id", "==", activity_uid)
        .get();

        if(querySnapshot.empty){
           return [];
        }
        const tokens = querySnapshot.docs.map(doc=>doc.data());
        return tokens;
    } catch (error) {
            console.error("Erro ao carregar tokens:", error);
            return [];
    }
   },
   findByUid: uid => {
        return firebase.firestore().collection("tokens")
        .doc(uid)
        .get()
        .then(doc => {
            return doc.data();
        });
    },
    remove: token => {
        return firebase.firestore().collection("tokens")
        .doc(tokens.uid)
        .delete();
    },
    save: token => {
        return firebase.firestore()
            .collection("tokens")
            .add(tokens);
    },
    update: token => {
        return firebase.firestore()
            .collection("tokens")
            .doc(tokens.uid)
            .update(tokens);
    }
};
