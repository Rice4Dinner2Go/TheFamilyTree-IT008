document.addEventListener("DOMContentLoaded", () => {
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
});
