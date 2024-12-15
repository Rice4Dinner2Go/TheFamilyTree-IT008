import { isDataAvailable } from './script/utils.js';

document.addEventListener("DOMContentLoaded", async () => {
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
});
