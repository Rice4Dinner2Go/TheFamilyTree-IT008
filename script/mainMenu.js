import api from './api.js';
import { deleteAllData, isDataAvailable} from "./utils.js";

function showNewTreeForm() {
    document.getElementById('popupForm-newTree').style.display = 'flex';
}

function hideNewTreeForm() {
    document.getElementById('popupForm-newTree').style.display = 'none';
}

function showImportForm() {
    document.getElementById('popupForm-import').style.display = 'flex';
}

function hideImportForm() {
    document.getElementById('popupForm-import').style.display = 'none';
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Handle form submission
async function handleNewTreeSubmit(event) {
    event.preventDefault();
    
    return withLoading(async () => {
        try {
            // First, delete all existing data
            await deleteAllData();
            console.log('Cleared existing data');

            // Then create the new person
            const formData = {
                name: document.getElementById('name').value,
                gender: document.getElementById('gender').value,
                dateOfBirth: document.getElementById('dob').value,
                age: calculateAge(document.getElementById('dob').value),
                partnerId: "",
                parentIds: [],
                childrenIds: []
            };

            // Create the person
            const response = await api.createPerson(formData);
            console.log('Created first person:', response);

            // Redirect to the tree page
            window.location.href = 'page_Tree.html';
        } catch (error) {
            console.error('Error creating new tree:', error);
            alert('Error creating new tree. Please try again.');
        }
    }, 'Creating your family tree...');
}

// Add event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const newTreeForm = document.getElementById('newTreeForm');
    if (newTreeForm) {
        newTreeForm.addEventListener('submit', handleNewTreeSubmit);
    }

    const continueButton = document.getElementById("continueButton");
    try {
        const dataAvailable = await isDataAvailable();
        if (dataAvailable) {
            continueButton.style.display = "block";
        } else {
            continueButton.style.display = "none";
        }
    } catch (error) {
        console.error("Error checking data availability:", error);
    }

    // Make functions available globally
    window.showNewTreeForm = showNewTreeForm;
    window.hideNewTreeForm = hideNewTreeForm;
    window.showImportForm = showImportForm;
    window.hideImportForm = hideImportForm;
});
