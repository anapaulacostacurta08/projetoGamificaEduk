const riddleService = {
    getRiddleByGroundControlPointId:  async (ground_control_point_id, group_id) => {
    try {
        const querySnapshot = await firebase.firestore().collection("riddles")
        .where("ground_control_point_id", "==", ground_control_point_id)
        .where("group_id", "==", group_id)
        .get();

        if(querySnapshot.empty){
           return null;
        }
        const riddles  = new Array();
        querySnapshot.forEach(doc => {
            var uid = doc.id;
            var dados = doc.data();
            var riddle = {uid,dados};
            riddles.push(riddle);
        });
        console.log(riddles);
        return riddles; 

    } catch (error) {
            console.error("Erro ao carregar Riddle:", error);
            return  null;
    }
   },

   getRiddleByUID:  async (uid) => {
    try {
        return await firebase.firestore().collection("riddles")
        .doc(uid)
        .get()
        .then(doc => {
                return doc.data();
        });   
    } catch (error) {
            console.error("Erro ao carregar Riddle:", error);
            return null;
    }
   }
}