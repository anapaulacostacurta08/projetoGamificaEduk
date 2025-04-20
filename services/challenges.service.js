const challengeService = {
    getChallengesByUid: async (id) => {
        return await firebase.firestore().collection("challenges")
            .doc(id)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    getChallengesByGroupID: async (group_id) => {
        const querySnapshot = await firebase.firestore().collection("challenges")
                .where("group_id", "==", group_id)
                .get();
                console.log(querySnapshot);
    
                if(querySnapshot.empty){
                    return null;
                }
                var challenges = new Array();
                querySnapshot.forEach(doc => {
                    var uid = doc.id;
                    var dados = doc.data();
                    var challenge = {uid,dados};
                    challenges.push(challenge);
                });
                console.log(challenges);
                return challenges;
        }
};