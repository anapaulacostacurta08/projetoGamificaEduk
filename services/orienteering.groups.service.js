const orienteeringGroupsService = {
    getOrienteeringByGroupId: async (id) => {
        return await firebase.firestore().collection("orienteering_groups")
        .doc(id)
        .get()
        .then(doc => {
            return doc.data();
        });
    },
}