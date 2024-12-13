const BASE_URL = 'https://squid-app-7jubn.ondigitalocean.app/family';

const headers = {
    'accept': 'application/json',
    'accept-language': 'en,vi;q=0.9',
    'content-type': 'application/json',
};

const api = {
    // 1. Create a new person
    createPerson: async (personData) => {
        try {
            const response = await axios.post(`${BASE_URL}/persons`, personData, { headers });
            return response.data;
        } catch (error) {
            console.error('Error creating person:', error);
            throw error;
        }
    },

    // 2. Get all persons
    getAllPersons: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/persons`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching all persons:', error);
            throw error;
        }
    },

    // 3. Get person by ID
    getPersonById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/persons/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching person:', error);
            throw error;
        }
    },

    // 4. Update person
    updatePerson: async (id, personData) => {
        try {
            await axios.patch(`${BASE_URL}/persons/${id}`, personData, { headers });
        } catch (error) {
            console.error('Error updating person:', error);
            throw error;
        }
    },

    // 5. Delete person
    deletePerson: async (id) => {
        try {
            await axios.delete(`${BASE_URL}/persons/${id}`, { headers });
        } catch (error) {
            console.error('Error deleting person:', error);
            throw error;
        }
    },

    // 6. Add child to parent
    addChild: async (parentId, childId) => {
        try {
            await axios.post(`${BASE_URL}/persons/${parentId}/children`, { childId }, { headers });
        } catch (error) {
            console.error('Error adding child:', error);
            throw error;
        }
    },

    // 7. Assign partner
    assignPartner: async (personId, partnerId) => {
        try {
            await axios.post(`${BASE_URL}/persons/${personId}/partner`, { partnerId }, { headers });
        } catch (error) {
            console.error('Error assigning partner:', error);
            throw error;
        }
    },

    // 8. Get parents
    getParents: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/persons/${id}/parents`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching parents:', error);
            throw error;
        }
    },

    // 9. Get children
    getChildren: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/persons/${id}/children`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching children:', error);
            throw error;
        }
    }
};

// // Example: Create a new person
// const newPerson = {
//     name: "John Doe Do Do Do",
//     gender: "male",
//     dateOfBirth: "01/01/1990",
//     age: 34,
//     partnerId: "",
//     parentIds: [""],
//     childrenIds: [""]
// };

// // Create the person
// api.createPerson(newPerson)
//     .then(response => {
//         console.log('Person created:', response);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

// api.deletePerson("675a9f70ff624b7edf265ac4");
export default api;