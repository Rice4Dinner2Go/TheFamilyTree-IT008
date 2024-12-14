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

async function addPartner(personId, partnerId){
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

        // Get children of both persons
        const [children1, children2] = await Promise.all([
            api.getChildren(person1.id),
            api.getChildren(person2.id)
        ]);

        // Assign partners
        await api.assignPartner(person1.id, person2.id);
        console.log(`Successfully assigned partnership between ${person1.name} and ${person2.name}`);

        // Add all children of person1 to person2
        for (const child of children1) {
            await api.addChild(person2.id, child.id);
            console.log(`Added child ${child.name} to ${person2.name}`);
        }

        // Add all children of person2 to person1
        for (const child of children2) {
            await api.addChild(person1.id, child.id);
            console.log(`Added child ${child.name} to ${person1.name}`);
        }
    } catch (error) {
        console.error('Error assigning partnership:', error);
        throw error;
    }
}

async function addChild(parentId, childId) {
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

        // Add child to the parent
        await api.addChild(parentId, childId);
        console.log(`Added ${child.name} as child to ${parent.name}`);

        // If parent has a partner, add child to them as well
        if (parent.partnerId) {
            const partner = await api.getPersonById(parent.partnerId);
            if (partner) {
                await api.addChild(partner.id, childId);
                console.log(`Added ${child.name} as child to partner ${partner.name}`);
            }
        }
    } catch (error) {
        console.error('Error adding child:', error);
        throw error;
    }
}

async function addParent(personId, parentId) {
    try {
        // Get data for both person and parent
        const [person, parent] = await Promise.all([
            api.getPersonById(personId),
            api.getPersonById(parentId)
        ]);

        // Check if both persons exist
        if (!person || !parent) {
            console.error('Person or parent not found');
            return;
        }

        // Get current parents of the person
        const currentParents = await api.getParents(personId);
        
        if (currentParents.length === 0) {
            // No parents yet, add as first parent
            await api.addChild(parentId, personId);
            console.log(`Successfully added ${parent.name} as parent to ${person.name}`);
        } else if (currentParents.length === 1) {
            // One parent exists, check gender compatibility and add as partner
            const existingParent = currentParents[0];
            if (existingParent.gender === parent.gender) {
                console.error('Parents must be of different genders');
                return;
            }
            await addPartner(existingParent.id, parentId);
            console.log(`Successfully added ${parent.name} as second parent to ${person.name}`);
        } else {
            console.error('Person already has two parents');
            return;
        }
    } catch (error) {
        console.error('Error adding parent:', error);
        throw error;
    }
}

async function addSibling(personId, siblingId) {
    try {
        // Get both person and sibling data
        const [person, sibling] = await Promise.all([
            api.getPersonById(personId),
            api.getPersonById(siblingId)
        ]);

        // Check if both persons exist
        if (!person || !sibling) {
            console.error('Person or sibling not found');
            return;
        }

        // Get parents of the person
        const parents = await api.getParents(personId);
        if (parents.length === 0) {
            console.error('Person has no parents to assign to sibling');
            return;
        }

        // Add each parent to the sibling
        for (const parent of parents) {
            await addParent(siblingId, parent.id);
            console.log(`Added parent ${parent.name} to sibling ${sibling.name}`);
        }

        console.log(`Successfully made ${person.name} and ${sibling.name} siblings`);
    } catch (error) {
        console.error('Error adding sibling:', error);
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

export {
    isDataAvailable,
    findWithName,
    addPartner,
    addChild,
    addParent,
    addSibling,
    createMultiplePersons,
};