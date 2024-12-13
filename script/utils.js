import api from './api.js';

// Xóa hết data trên database. Dùng khi tạo cây mới.
async function deleteAllData()
{

    try {
        // fetch the list of all persons
        const data = await api.getAllPersons();
        if(!data || data.length === 0)
        {
            console.log('No data to delete.');
            return;
        }


        // select each person and delete them 
        for (const person of data)
        {
            try{
                await api.deletePerson(person.id);
                console.log(`Deleted person with ID: ${person.id}`);
            } 
            catch (error)
            {
                console.log(`Error deleting person with ID: ${person.id}`,error);
            }     
        }

        console.log('Completed deleting all data.');

    }
    catch (error)
    {
        console.log('Error fetching the list of persons or deleting data:',error);
    }
}

// Hàm check xem data đã load hay chưa: output: true/false
async function isDataAvailable() {
    const data = await api.getAllPersons();
    if(data[0]){
        console.log("Data is available");
        return true;
    }
    console.log("No data found");
    return false
}

// Hàm kiếm người theo tên. input: name -> output: id
async function findWithName(name){
    console.log("Begin to find person")
    const data = await api.getAllPersons();
    if(!data[0]){
        console.log("No data found");
        return "";
    }
    for (const person of data)
    {
        if (name === person.name)   {
            console.log("found the name " + person.name +" with id "+ person.id);
            return person.id;
        }
    }
    console.log("No person with the name " + name);
    return "";
}

async function addPartnersRelationship(personId, partnerId){
    try {
        // Get both persons' data
        const [person1, person2] = await Promise.all([
            api.getPersonById(personId),
            api.getPersonById(partnerId)
        ]);

        // Check if both persons exist
        if (!person1 || !person2) {
            console.error('One or both persons not found');
            return;
        }

        // Check if they already have partners
        if (person1.partnerId || person2.partnerId) {
            console.error('One or both persons already have a partner');
            return;
        }

        // Check if they have different genders
        if (person1.gender === person2.gender) {
            console.error('Partners must be of different genders');
            return;
        }

        // Assign partners
        await api.assignPartner(person1.id, person2.id);
        console.log(`Successfully assigned partnership between ${person1.name} and ${person2.name}`);
    } catch (error) {
        console.error('Error assigning partnership:', error);
        throw error;
    }
}

async function addParentChildRelationship(parentId, childId) {
    try {
        // Get both parent and child data to verify they exist
        const [parent, child] = await Promise.all([
            api.getPersonById(parentId),
            api.getPersonById(childId)
        ]);

        // Validate that both parent and child exist
        if (!parent || !child) {
            console.error('Parent or child not found');
            return;
        }

        if (parent.partnerId === ""){
            console.error('Must have a partner');
            return;
        }

        // Check if IDs are valid
        if (!parent.id || !child.id) {
            console.error('Invalid parent or child ID');
            return;
        }

        // Use the dedicated API endpoint to add the child relationship
        await api.addChild(parent.id, child.id);
        await api.addChild(parent.partnerId, child.id)
        console.log(`Successfully added parent-child relationship between ${parent.name} and ${child.name}`);
    } catch (error) {
        console.error('Error adding parent-child relationship:', error);
        throw error;
    }
}

async function createMultiplePersons(persons) {
    try {
        // Duyệt qua từng person trong danh sách và tạo mới
        for (const person of persons) {
            try {
                const response = await api.createPerson(person);
                console.log(`Created person with ID: ${response.id}`);
            } catch (error) {
                console.log(`Error creating person: ${person.name}`, error);
            }
        }

        console.log('Completed creating all persons.');
    } catch (error) {
        console.log('Error creating persons:', error);
    }
}

//Cái hàm này để test funtion, vô page_tree.html, bấm vô setting rồi bấm nút 'debug' để chạy code
async function test() {
    console.log("Testing delete functionality...");
    // Test function

    addPartnersRelationship("675c1dc1aa254df8f6cd3c23", "675c1dc1aa254d5038cd3c22"),
    addParentChildRelationship("675c1dc1aa254df8f6cd3c23", "675c1dc1aa254d44c4cd3c24")

    // createMultiplePersons([
    //     {
    //         "name": "John Smith",
    //         "gender": "Male",
    //         "dateOfBirth": "1960-05-15",
    //         "age": 63,
    //         "partnerId": "",
    //         "parentIds": [],
    //         "childrenIds": []
    //     },
    //     {
    //         "name": "Mary Smith",
    //         "gender": "Female",
    //         "dateOfBirth": "1962-08-22",
    //         "age": 61,
    //         "partnerId": "",
    //         "parentIds": [],
    //         "childrenIds": []
    //     },
    //     {
    //         "name": "Robert Smith",
    //         "gender": "Male",
    //         "dateOfBirth": "1935-03-10",
    //         "age": 88,
    //         "partnerId": "",
    //         "parentIds": [],
    //         "childrenIds": []
    //     },]
    // )
    
    console.log("Test completed.");
}


//Thêm listener cho các nút nếu cần
document.addEventListener("DOMContentLoaded", () => {
    const deleteAllDataBtn = document.getElementById('deleteAllDataBtn');
    const debugBtn = document.getElementById('debugBtn');

    if (deleteAllDataBtn) {
        deleteAllDataBtn.addEventListener('click', async () => {
            if (confirm('WARNING: This will permanently delete all your family tree data. This action cannot be undone. Are you sure you want to proceed?')) {
                try {
                    await delete_all_data();
                    // Close the settings popup
                    document.getElementById('interfaceSettingsPopup').style.display = 'none';
                    document.getElementById('overlay').style.display = 'none';
                    // Show success message
                    alert('All data has been successfully deleted.');
                    // Reload the page to reset the application state
                    window.location.href = "../index.html";
                } catch (error) {
                    alert('Error deleting data: ' + error.message);
                }
            }
        });
    }

    if (debugBtn) {
        debugBtn.addEventListener('click', () => {
            test();
        });
    }
});