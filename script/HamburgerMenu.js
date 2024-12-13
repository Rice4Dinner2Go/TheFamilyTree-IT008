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

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeMenu);

export default { closePopup, initializeMenu };
