/**
 * Function to add popup and overlay logic
 * @param {string} btnId - ID of the button that triggers the popup
 * @param {string} popupId - ID of the popup to show
 * @param {string} cancelBtnId - ID of the cancel button to hide popup
 */
const addPopupLogic = (btnId, popupId, cancelBtnId) => {
  const btn = document.getElementById(btnId);
  const popup = document.getElementById(popupId);
  const cancelBtn = document.getElementById(cancelBtnId);
  const overlay = document.getElementById("overlay");

  // Show popup and overlay
  btn.addEventListener("click", () => {
    popup.style.display = "block";
    overlay.style.display = "block";
  });

  // Hide popup and overlay
  cancelBtn.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";
  });
};

// Close popup function
export function closePopup() {
  document.getElementById("download-popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";

  // Clear iframe source
  const iframe = document.getElementById("popupIframe");
  iframe.src = "";
}

// Initialize hamburger menu and popups
function initializeMenu() {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    sidebar.classList.toggle("active");
  });

  // Close menu when clicking a link
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      sidebar.classList.remove("active");
    });
  });

  // Add popup logic for each popup
  addPopupLogic("newTreeBtn", "newTreePopup", "cancelNewTreeBtn");
  addPopupLogic(
    "checkRelationshipBtn",
    "checkRelationshipPopup",
    "cancelCheckRelationshipBtn"
  );
  addPopupLogic(
    "interfaceSettingsBtn",
    "interfaceSettingsPopup",
    "cancelSettingsBtn"
  );

  // Setup download popup
  const captureTreeBtn = document.getElementById("captureTreeBtn");
  const closeCaptureBtn = document.getElementById("closeCapturePopup");
  
  if (captureTreeBtn) {
    captureTreeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      // Set iframe source to png.html
      const iframe = document.getElementById("popupIframe");
      iframe.src = "./png.html";
      // Show popup and overlay
      document.getElementById("download-popup").style.display = "block";
      document.getElementById("overlay").style.display = "block";
    });
  }

  if (closeCaptureBtn) {
    closeCaptureBtn.addEventListener("click", () => closePopup());
  }
}

import { checkRelationship, initializePersonCache } from './relationship.js';
import api from './api.js';

let allPersons = new Map();

// Initialize persons data
async function initializePersonsData() {
  try {
    const persons = await api.getAllPersons();
    allPersons.clear();
    persons.forEach(person => {
      allPersons.set(person.id, person);
    });
  } catch (error) {
    console.error('Error initializing persons data:', error);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  initializeMenu();
  await initializePersonsData();
  
  // Setup relationship checking
  const person1Input = document.getElementById("person1");
  const person2Input = document.getElementById("person2");
  const checkRelationshipBtn = document.getElementById("checkRelationshipBtnPopup");
  const person1Suggestions = document.createElement("div");
  const person2Suggestions = document.createElement("div");
  
  person1Suggestions.className = "search-suggestions";
  person2Suggestions.className = "search-suggestions";
  
  person1Input.parentNode.insertBefore(person1Suggestions, person1Input.nextSibling);
  person2Input.parentNode.insertBefore(person2Suggestions, person2Input.nextSibling);
  
  let selectedPerson1Id = null;
  let selectedPerson2Id = null;

  // Search input handler
  function createSearchHandler(input, suggestions, onSelect) {
    return () => {
      const searchText = input.value.toLowerCase();
      suggestions.innerHTML = "";
      
      if (searchText.length < 1) {
        suggestions.style.display = "none";
        return;
      }

      const matches = Array.from(allPersons.values())
        .filter(person => person.name.toLowerCase().includes(searchText))
        .slice(0, 5);

      if (matches.length > 0) {
        matches.forEach(person => {
          const div = document.createElement("div");
          div.className = "suggestion-item";
          div.textContent = `${person.name} (${person.age} years old)`;
          div.addEventListener("click", () => {
            input.value = person.name;
            onSelect(person.id);
            suggestions.style.display = "none";
          });
          suggestions.appendChild(div);
        });
        suggestions.style.display = "block";
      } else {
        suggestions.style.display = "none";
      }
    };
  }

  // Setup search handlers
  person1Input.addEventListener("input", createSearchHandler(person1Input, person1Suggestions, id => selectedPerson1Id = id));
  person2Input.addEventListener("input", createSearchHandler(person2Input, person2Suggestions, id => selectedPerson2Id = id));

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!person1Input.contains(e.target) && !person1Suggestions.contains(e.target)) {
      person1Suggestions.style.display = "none";
    }
    if (!person2Input.contains(e.target) && !person2Suggestions.contains(e.target)) {
      person2Suggestions.style.display = "none";
    }
  });

  // Clear inputs when opening popup
  document.getElementById("checkRelationshipBtn").addEventListener("click", () => {
    person1Input.value = "";
    person2Input.value = "";
    selectedPerson1Id = null;
    selectedPerson2Id = null;
    person1Suggestions.style.display = "none";
    person2Suggestions.style.display = "none";
  });

  // Check relationship button handler
  checkRelationshipBtn.addEventListener("click", async () => {
    if (!selectedPerson1Id || !selectedPerson2Id) {
      alert("Please select both persons from the suggestions");
      return;
    }

    try {
      await initializePersonCache(); // Ensure cache is up to date
      const relationship = await checkRelationship(selectedPerson1Id, selectedPerson2Id);
      alert(relationship);
    } catch (error) {
      console.error("Error checking relationship:", error);
      alert("Error checking relationship. Please try again.");
    }
  });
});

export default { closePopup, initializeMenu };
