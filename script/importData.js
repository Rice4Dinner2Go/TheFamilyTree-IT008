import { importPersons, deleteAllData } from './utils.js';

let jsonData = null;

async function importFromJson() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';  

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];  
        if (file) {
            const reader = new FileReader();  
            reader.onload = async function(e) {
                try {
                    // Show loading screen
                    loadingScreen.show('Importing family tree...');
                    
                    jsonData = JSON.parse(e.target.result);
                    console.log("JSON data loaded:", jsonData);
                    
                    // Delete existing data first
                    await deleteAllData();
                    console.log("Cleared existing data");
                    
                    // Import the new data
                    await importPersons(jsonData);
                    console.log("Successfully imported family tree");
                    
                    // Redirect to tree page
                    window.location.href = 'page_Tree.html';
                } catch (error) {
                    console.error("Error importing data:", error);
                    alert("Error importing family tree. Please check your JSON file and try again.");
                } finally {
                    // Hide loading screen
                    loadingScreen.hide();
                }
            };

            reader.readAsText(file);  
        }
    });

    fileInput.click();
}

// Make the function available globally
window.importFromJson = importFromJson;
