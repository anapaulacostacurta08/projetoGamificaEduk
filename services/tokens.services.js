const tokenService = {
    getTokens:  async () => {
    try {
        const querySnapshot = await firebase.firestore().collection("tokens")
        .get();

        if(querySnapshot.empty){
            throw new Error("Banco de Token vazio!");
        }
        const tokens = querySnapshot.docs.map(doc=>doc.data());
        return tokens;
    } catch (error) {
            console.error("Erro ao carregar perguntas:", error);
            alert("Erro ao carregar perguntas:" + error);
            return [];
    }
   },
   findByUid: uid => {
        return firebase.firestore()
            .collection("tokens")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    remove: token => {
        return firebase.firestore()
            .collection("tokens")
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
