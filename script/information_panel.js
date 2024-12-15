import api from "./api.js";
import {addPartner, addChild, addParent, addSibling, deletePerson} from "./utils.js";
import {rootId, drawFamilyTree, clearCache, handlePersonClick} from "./FamilyTree.js";

const addButton = document.getElementById("addButton");
const dialog = document.getElementById("dialog");
const cancelButton = document.getElementById("cancelButton");
const infoButton = document.getElementById("infoButton");
const panel = document.querySelector(".info-panel");
const toolbar = document.querySelector(".Toolbar_container");

// Ẩn hiện panel
infoButton.addEventListener("click", () => {
  panel.classList.toggle("hidden");
  toolbar.classList.toggle("hidden");
});

addButton.addEventListener("click", () => {
  dialog.classList.remove("hidden");
});

cancelButton.addEventListener("click", () => {
  dialog.classList.add("hidden");
});

document
  .getElementById("addMemberForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      // Calculate age
      const birthYear = parseInt(data.dateOfBirth.split('-')[0]);
      const age = 2024 - birthYear;

      // Create person data object
      const personData = {
        "name": data.givenName,
        "gender": data.sex,
        "dateOfBirth": data.dateOfBirth,
        "age": age,
        "partnerId": "",
        "parentIds": [],
        "childrenIds": []
      };

      // Create the new person
      const newPerson = await api.createPerson(personData);
      console.log("Created person:", newPerson.id);

      // Establish relationship based on selection
      const relationship = data.relationship;
      switch (relationship) {
        case 'parent':
          await addParent(rootId, newPerson.id);
          break;
        case 'child':
          await addChild(rootId, newPerson.id);
          break;
        case 'partner':
          await addPartner(rootId, newPerson.id);
          break;
        case 'sibling':
          await addSibling(rootId, newPerson.id);
          break;
      }

      // Clear the form
      this.reset();
      
      // Hide the dialog
      dialog.classList.add("hidden");
      
      // Clear the cache and update the tree
      clearCache();
      await drawFamilyTree();
      
      // Update search data after new person is added
      await initializePersonsData();
      
      alert("Thành viên đã được thêm thành công!");
    } catch (error) {
      console.error("Error adding new member:", error);
      alert("Có lỗi xảy ra khi thêm thành viên!");
    }
    
    dialog.classList.add("hidden");
  });

// Các hộp thoại
const editDialog = document.getElementById("editDialog");
const deleteDialog = document.getElementById("deleteDialog");
const searchDialog = document.getElementById("searchDialog");

// Các nút trong hộp thoại sửa
const cancelEditButton = document.getElementById("cancelEditButton");
const editForm = document.getElementById("editForm");

// Các nút trong hộp thoại xóa
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");

// Search form elements
const searchForm = document.getElementById("searchForm");
const searchCancelButton = document.getElementById("searchCancelButton");
const searchButton = document.getElementById("searchButton");
const searchNameInput = document.getElementById("searchName");
const searchSuggestions = document.createElement("div");
searchSuggestions.className = "search-suggestions";
searchNameInput.parentNode.insertBefore(searchSuggestions, searchNameInput.nextSibling);

let allPersons = new Map(); // Store all persons for search

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

// Initialize on load
initializePersonsData();

// Search button click handler
searchButton.addEventListener("click", () => {
  searchNameInput.value = ""; // Clear the input
  searchSuggestions.style.display = "none"; // Hide suggestions
  searchDialog.classList.remove("hidden");
});

// Search input handler with suggestions
searchNameInput.addEventListener("input", async () => {
  const searchText = searchNameInput.value.toLowerCase();
  searchSuggestions.innerHTML = "";
  
  if (searchText.length < 1) {
    searchSuggestions.style.display = "none";
    return;
  }

  const matches = Array.from(allPersons.values())
    .filter(person => person.name.toLowerCase().includes(searchText))
    .slice(0, 5); // Limit to 5 suggestions

  if (matches.length > 0) {
    matches.forEach(person => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.textContent = `${person.name} (${person.age} years old)`;
      div.addEventListener("click", () => {
        searchNameInput.value = person.name;
        handlePersonClick(person.id); // Set as root and redraw
        searchDialog.classList.add("hidden");
        searchSuggestions.style.display = "none";
      });
      searchSuggestions.appendChild(div);
    });
    searchSuggestions.style.display = "block";
  } else {
    searchSuggestions.style.display = "none";
  }
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!searchNameInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
    searchSuggestions.style.display = "none";
  }
});

// Search form submit handler
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchText = searchNameInput.value.toLowerCase();
  
  const match = Array.from(allPersons.values())
    .find(person => person.name.toLowerCase() === searchText);
    
  if (match) {
    handlePersonClick(match.id); // Set as root and redraw
    searchDialog.classList.add("hidden");
    searchSuggestions.style.display = "none";
  } else {
    alert("No exact match found. Please select from suggestions or try a different name.");
  }
});

// Mở hộp thoại sửa
editButton.addEventListener("click", async () => {
  try {
    // Get current root person's data
    const person = await api.getPersonById(rootId);
    if (!person) {
      alert("Person not found!");
      return;
    }

    // Populate form with current data
    document.getElementById("editName").value = person.name || "";
    document.getElementById("editBirthday").value = person.dateOfBirth || "";

    // Show the dialog
    editDialog.classList.remove("hidden");
  } catch (error) {
    console.error("Error loading person data:", error);
    alert("Error loading person data for editing!");
  }
});

// Đóng hộp thoại sửa
cancelEditButton.addEventListener("click", () => {
  editDialog.classList.add("hidden");
});

// Mở hộp thoại xác nhận xóa
deleteButton.addEventListener("click", () => {
  deleteDialog.classList.remove("hidden");
});

// Đóng hộp thoại xác nhận xóa
cancelDeleteButton.addEventListener("click", () => {
  deleteDialog.classList.add("hidden");
});

// Xác nhận xóa
confirmDeleteButton.addEventListener("click", async () => {
  try {
    const person = await api.getPersonById(rootId);
    if (!person) {
      alert("Person not found!");
      return;
    }

    let nextRootId = "";

    // Check for partner first
    if (person.partnerId) {
      nextRootId = person.partnerId;
    }
    // Then check for parents
    else if (person.parentIds && person.parentIds.length > 0) {
      nextRootId = person.parentIds[0];
    }
    // Then check for children
    else if (person.childrenIds && person.childrenIds.length > 0) {
      nextRootId = person.childrenIds[0];
    }
    // If no relationships found
    else {
      if (confirm("This person has no relationships. Deleting them will return you to the main menu. Continue?")) {
        await deletePerson(rootId);
        window.location.href = "../index.html";
        return;
      }
      deleteDialog.classList.add("hidden");
      return;
    }

    // Delete the person first
    await deletePerson(rootId);
    
    // Update search data after person is deleted
    await initializePersonsData();
    
    // Clear the cache to force reload of data
    clearCache();
    
    // Update the root ID and redraw
    handlePersonClick(nextRootId);
    
    // Close the delete dialog
    deleteDialog.classList.add("hidden");
    
  } catch (error) {
    console.error("Error deleting person:", error);
    alert("An error occurred while deleting the person!");
    deleteDialog.classList.add("hidden");
  }
});

// Search functionality
searchCancelButton.addEventListener("click", () => {
  searchDialog.classList.add("hidden");
});

// Xử lý form sửa
editForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Ngừng gửi form
  
  return withLoading(async () => {
    try {
      const name = document.getElementById("editName").value;
      const dateOfBirth = document.getElementById("editBirthday").value;
      
      // Get current person data
      const person = await api.getPersonById(rootId);
      if (!person) {
        throw new Error("Person not found");
      }
      
      // Calculate new age
      const birthYear = parseInt(dateOfBirth.split('-')[0]);
      const age = 2024 - birthYear;
      
      // Update person with new data while preserving other fields
      await api.updatePerson(rootId, {
        ...person,
        name: name,
        dateOfBirth: dateOfBirth,
        age: age
      });
      
      // Clear cache and redraw tree to show updated info
      clearCache();
      await drawFamilyTree();
      
      // Update search data after person is updated
      await initializePersonsData();
      
      // Close the dialog
      editDialog.classList.add("hidden");
      
    } catch (error) {
      console.error("Error updating person:", error);
      alert("An error occurred while updating the person's information!");
      editDialog.classList.add("hidden");
    }
  }, 'Updating person information...');
});