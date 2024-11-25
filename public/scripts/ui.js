export function updateProfileUI(profileData) {
    const profileCard = document.getElementById("profile-card");

    document.getElementById("avatar").src = profileData.avatar_url || 'default-avatar.jpg';
    document.getElementById("name").textContent = profileData.name || "N/A";
    document.getElementById("bio").textContent = profileData.bio || "No bio available";
    document.getElementById("profile-link").href = profileData.html_url || "#";
    document.getElementById("location").textContent = profileData.location || "N/A";
    document.getElementById("blog").href = profileData.blog || "#";
    document.getElementById("company").textContent = profileData.company || "N/A";
    document.getElementById("repos").textContent = profileData.public_repos || "0";
    document.getElementById("followers").textContent = profileData.followers || "0";
    document.getElementById("following").textContent = profileData.following || "0";

    profileCard.classList.remove("d-none");
}

export function updateReposUI(reposData) {
    const repoItems = document.getElementById("repo-items");

    // Check if there are no repositories
    if (reposData.length === 0) {
        const noReposItem = document.createElement("li");
        noReposItem.className = "list-group-item";
        noReposItem.textContent = "No repositories available";
        repoItems.appendChild(noReposItem);
    } else {
        // Populate repository list
        reposData.forEach(repo => {
            const repoItem = document.createElement("li");
            repoItem.className = "list-group-item d-flex justify-content-between align-items-center bg-dark";
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <span class="badge bg-secondary">${repo.stargazers_count} ★</span>
            `;
            repoItems.appendChild(repoItem);
        });
    }
}

export function showError(message) {
    alert(message);
}
