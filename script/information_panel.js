const addButton = document.getElementById("addButton");
const dialog = document.getElementById("dialog");
const cancelButton = document.getElementById("cancelButton");

addButton.addEventListener("click", () => {
  dialog.classList.remove("hidden");
});

cancelButton.addEventListener("click", () => {
  dialog.classList.add("hidden");
});

document
  .getElementById("addMemberForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log("New member data:", data);
    alert("Thành viên đã được thêm!");
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
confirmDeleteButton.addEventListener("click", () => {
  // Thực hiện xóa dữ liệu ở đây
  alert("Member has been deleted!");
  deleteDialog.classList.add("hidden");
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

function togglePanel(){
  const infoPanel = document.getElementById("info-panel");
  infoPanel.classList.toggle("active");
}