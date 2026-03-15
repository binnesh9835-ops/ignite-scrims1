// profile.js
window.addEventListener("DOMContentLoaded", () => {
  // Profile elements
  const profileSection = document.getElementById("profile");
  const usernameInput = document.getElementById("username");
  const firstNameInput = document.createElement("input");
  const middleNameInput = document.createElement("input");
  const lastNameInput = document.createElement("input");
  const ignInput = document.getElementById("ign");
  const ffUidInput = document.getElementById("ffuid");
  const ffLevelInput = document.getElementById("fflevel");
  const xpDisplay = document.getElementById("xpLevel");
  const saveBtn = profileSection.querySelector("button[onclick='saveProfile()']");
  const logoutBtn = profileSection.querySelector("button[onclick='logoutUser()']");

  // Notification toggle
  const notifToggle = document.createElement("input");
  notifToggle.type = "checkbox";
  notifToggle.id = "notifToggle";

  // Append name fields and notification toggle dynamically
  firstNameInput.placeholder = "First Name";
  middleNameInput.placeholder = "Middle Name";
  lastNameInput.placeholder = "Last Name";
  profileSection.insertBefore(firstNameInput, ignInput);
  profileSection.insertBefore(middleNameInput, ignInput);
  profileSection.insertBefore(lastNameInput, ignInput);
  profileSection.insertBefore(notifToggle, saveBtn);
  const notifLabel = document.createElement("label");
  notifLabel.innerText = "Notifications On/Off";
  notifLabel.htmlFor = "notifToggle";
  profileSection.insertBefore(notifLabel, saveBtn);

  // Pre-fill profile fields from localStorage
  function prefillProfile() {
    const username = localStorage.getItem("username");
    const firstName = localStorage.getItem("firstName") || "";
    const middleName = localStorage.getItem("middleName") || "";
    const lastName = localStorage.getItem("lastName") || "";
    const ign = localStorage.getItem("ign") || "";
    const ffuid = localStorage.getItem("ffuid") || "";
    const fflevel = localStorage.getItem("fflevel") || "";
    const xp = parseInt(localStorage.getItem("xp")) || 0;
    const notif = localStorage.getItem("notif") === "true";

    if (username) usernameInput.value = username;
    firstNameInput.value = firstName;
    middleNameInput.value = middleName;
    lastNameInput.value = lastName;
    ignInput.value = ign;
    ffUidInput.value = ffuid;
    ffLevelInput.value = fflevel;
    xpDisplay.textContent = xp;

    notifToggle.checked = notif;

    // Shine effect for XP ≥ 7000
    if (xp >= 7000) usernameInput.classList.add("shine-effect");
  }

  prefillProfile();

  // Save profile changes
  saveBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const firstName = firstNameInput.value.trim();
    const middleName = middleNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const ign = ignInput.value.trim();
    const ffuid = ffUidInput.value.trim();
    const fflevel = ffLevelInput.value.trim();
    let xp = parseInt(localStorage.getItem("xp")) || 0;
    const notif = notifToggle.checked;

    // Username validation (only lowercase + numbers, max 12 chars, no spaces)
    if (
      username === "" ||
      username.includes(" ") ||
      /[^a-z0-9]/.test(username) ||
      username.length > 12
    ) {
      alert(
        "Username must be lowercase letters & numbers only, no spaces, max 12 chars"
      );
      return;
    }

    // Save in localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("middleName", middleName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("ign", ign);
    localStorage.setItem("ffuid", ffuid);
    localStorage.setItem("fflevel", fflevel);
    localStorage.setItem("xp", xp);
    localStorage.setItem("notif", notif);

    // Update top-right display
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = username;
    loginBtn.style.pointerEvents = "none";

                           // Shine effect for XP ≥ 7000
    if (xp >= 7000) usernameInput.classList.add("shine-effect");
    else usernameInput.classList.remove("shine-effect");

    alert("Profile updated successfully!");
  });

  // Listen to logout click (calls auth.js function)
  logoutBtn.addEventListener("click", () => {
    window.logoutUser();
  });
});
