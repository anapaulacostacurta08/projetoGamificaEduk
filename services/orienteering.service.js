const orienteeringService = {
    getOrienteeringByGroupId: async (group_id) => {
        const querySnapshot = await firebase.firestore().collection("orienteering")
        .where('group_id','==',group_id)
        .get();

        if(querySnapshot.empty){
            throw null;
        }
        const orienteering = querySnapshot.docs.map(doc=>doc.data());
        console.log(orienteering);            
        return orienteering;
    }
}