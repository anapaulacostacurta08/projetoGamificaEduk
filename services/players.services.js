const playerService = {
    getPlayerByActivity: async (activity_uid, user_UID) => {
        try {
            const querySnapshot = await firebase.firestore().collection("players")
            .where('activity_id','==', activity_uid)
            .where('user_UID','==',user_UID)
            .get();

            if(querySnapshot.empty){
                throw new Error("01 - Não encontrado.");
            }

            const players = new Array();
            querySnapshot.forEach(doc => {
                var uid = doc.id;
                var dados = doc.data();
                var player = {uid,dados};
                players.push(player);
            });
            console.log(players);
            return players; 

        } catch (error) {
            console.error("Erro ao carregar perguntas:", error);
            //alert("Falha ao carregar perguntas. Tente novamente mais tarde.");
            return [];
        }
    },
    findByUid: uid => {
        return firebase.firestore()
            .collection("players")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    remove: players => {
        return firebase.firestore()
            .collection("players")
            .doc(players.uid)
            .delete();
    },
    save: players => {
        return firebase.firestore()
            .collection("players")
            .add(players);
    },
    update: async (player_uid, players) => {
        return firebase.firestore()
            .collection("players")
            .doc(player_uid)
            .update(players);
    }
};