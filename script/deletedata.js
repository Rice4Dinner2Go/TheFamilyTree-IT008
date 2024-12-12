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


document.addEventListener("DOMContentLoaded", () => {
    const deleteButton = document.getElementById("confirmDeleteButton");
    console.log("Loaded delete")
    deleteButton.addEventListener("click", () => {
        delete_all_data();
        console.log("deleted");
    });
});