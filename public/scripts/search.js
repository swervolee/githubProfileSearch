import { fetchUserProfile, fetchUserRepos, main } from './api.js';
import { updateProfileUI, updateReposUI, showError, drawGraph} from './ui.js';

export async function handleSearch() {
    const username = document.getElementById("username").value.trim();
    const profileCard = document.getElementById("profile-card");
    const reposList = document.getElementById("repos-list");
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


    try {
        // Fetch user profile
        const profileData = await fetchUserProfile(username);

        // Populate profile details
        updateProfileUI(profileData);

        // Fetch repositories
        const reposData = await fetchUserRepos(username);

        // Populate repository list
        updateReposUI(reposData);

	// Fetch repo commit count
	const data = await main(username);
	console.log(data);

	//drawGraph(data);

        reposList.classList.remove("d-none");
    } catch (error) {
	console.log(error);
        showError(error.message || "An unexpected error occurred. Please try again.");
    }
}
