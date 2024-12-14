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

// Các nút trong hộp thoại sửa
const cancelEditButton = document.getElementById("cancelEditButton");
const editForm = document.getElementById("editForm");

// Các nút trong hộp thoại xóa
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");

// Mở hộp thoại sửa
editButton.addEventListener("click", () => {
  editDialog.classList.remove("hidden");
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

// Xử lý form sửa
editForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Ngừng gửi form
  const name = document.getElementById("editName").value;
  const birthday = document.getElementById("editBirthday").value;
  const gender = document.getElementById("editGender").value;

  // Thực hiện lưu thông tin sửa ở đây
  console.log("Edited Info:", { name, birthday, gender });

  // Đóng hộp thoại
  editDialog.classList.add("hidden");
});