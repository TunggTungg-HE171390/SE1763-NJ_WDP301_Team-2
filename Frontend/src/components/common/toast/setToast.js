export const setToast = ({ title, description, actionText, titleColor = "", className = "" }) => {
    // Retrieve existing messages (or initialize an empty array)
    const existingToasts = JSON.parse(sessionStorage.getItem("toastMessages")) || [];

    // Add the new toast to the queue
    existingToasts.push({ title, description, actionText, titleColor, className });

    // Save back to sessionStorage
    sessionStorage.setItem("toastMessages", JSON.stringify(existingToasts));
};
