import { fetchUserProfile, fetchUserRepos } from './api.js';
import { updateProfileUI, updateReposUI, showError } from './ui.js';

export async function handleSearch() {
    const username = document.getElementById("username").value.trim();
    const profileCard = document.getElementById("profile-card");
    const reposList = document.getElementById("repos-list");
    const loading = document.querySelector(".loading");
    const repoItems = document.getElementById("repo-items");

    // Hide profile and repository sections and clear repository list
    profileCard.classList.add("d-none");
    reposList.classList.add("d-none");
    repoItems.innerHTML = "";

    // Validate input
    if (!username) {
        alert("Please enter a GitHub username!");
        return;
    }

    loading.style.display = "block";

    try {
        // Fetch user profile
        const profileData = await fetchUserProfile(username);

        // Populate profile details
        updateProfileUI(profileData);

        // Fetch repositories
        const reposData = await fetchUserRepos(username);

        // Populate repository list
        updateReposUI(reposData);

        reposList.classList.remove("d-none");
    } catch (error) {
        showError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
        loading.style.display = "none";
    }
}
