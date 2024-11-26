import { fetchUserProfile, fetchUserRepos, main } from './api.js';
import { updateProfileUI, updateReposUI, showError, drawGraph} from './ui.js';


export async function handleSearch() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value.trim();
    const profileCard = document.getElementById("profile-card");
    const reposList = document.getElementById("repos-list");
    const repoItems = document.getElementById("repo-items");
    const errorContainer = document.getElementById('error-container');
    const profileNotFoundContainer = document.getElementById('profile-not-found');

    // Hide profile and repository sections and clear repository list
    profileCard.classList.add("d-none");
    reposList.classList.add("d-none");
    repoItems.innerHTML = "";

    // Clear previous error messages
    errorContainer.textContent = "";
    profileNotFoundContainer.textContent = "";
    
    // Validate input
    if (!username) {
        errorContainer.textContent = 'Please enter a GitHub username!';
        errorContainer.style.cssText = `
            color: #dc3545; 
            font-size: 0.9rem; 
        `;

        usernameInput.focus();
        return;
    }

    try {
        // Fetch user profile
        const profileData = await fetchUserProfile(username);

        if (!profileData || !profileData.login) {
            profileNotFoundContainer.innerHTML = `
                 <div class="alert alert-warning" role="alert">
                     <h4 class="alert-heading">Profile Not Found</h4>
                     <p>The GitHub profile you are looking for could not be retrieved.</p>
                     <hr>
                     <p class="mb-0">Please double-check the username and try again.</p>
                 </div>`;
	    console.log("error populated");
            return;
        }

        // Populate profile details
        updateProfileUI(profileData);

        // Fetch repositories
        const reposData = await fetchUserRepos(username);

        // Populate repository list
        updateReposUI(reposData);

        // Fetch repo commit count
        const data = await main(username);

        reposList.classList.remove("d-none");
    } catch (error) {
        console.error(error);
        showError(error.message || "An unexpected error occurred. Please try again.");
    }
}
