import api from './api.js';

async function delete_all_data()
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

async function isDataAvailable() {
    const data = await api.getAllPersons();
    if(data[0]){
        console.log("Data is available");
        return true;
    }
    console.log("No data found");
    return false
}

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

//Cái hàm này để test funtion, vô page_tree.html, bấm vô setting rồi bấm nút 'debug' để chạy code
async function test() {
    console.log("Testing delete functionality...");
    // Test function
    
    //
    console.log("Test completed.");
}


//Implementing as button in html
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