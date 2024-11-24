document.getElementById("search").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const profileCard = document.getElementById("profile-card");
    const reposList = document.getElementById("repos-list");
    const loading = document.querySelector(".loading");
    const repoItems = document.getElementById("repo-items");

    profileCard.classList.add("d-none");
    reposList.classList.add("d-none");
    repoItems.innerHTML = "";

    if (!username) {
	alert("Please enter a GitHub username!");
	return;
    }

    loading.style.display = "block";

    try {
	// Fetch user profile
	const profileResponse = await fetch(`http://127.0.0.1:3000/api/github/${username}`);
	if (!profileResponse.ok) throw new Error("Profile not found");

	const profileData = await profileResponse.json();
	document.getElementById("avatar").src = profileData.avatar_url;
	document.getElementById("name").textContent = profileData.name || "N/A";
	document.getElementById("bio").textContent = profileData.bio || "No bio available";
	document.getElementById("profile-link").href = profileData.html_url;
	document.getElementById("location").textContent = profileData.location || "N/A";
	document.getElementById("blog").href = profileData.blog || "#";
	document.getElementById("company").textContent = profileData.company || "N/A";
	document.getElementById("repos").textContent = profileData.public_repos;
	document.getElementById("followers").textContent = profileData.followers;
	document.getElementById("following").textContent = profileData.following;

	profileCard.classList.remove("d-none");

	// Fetch repositories
	const reposResponse = await fetch(profileData.repos_url);
	if (!reposResponse.ok) throw new Error("Failed to fetch repositories");

	const reposData = await reposResponse.json();
	reposData.forEach(repo => {
	    const repoItem = document.createElement("li");
	    repoItem.className = "list-group-item d-flex justify-content-between align-items-center bg-dark";
	    repoItem.innerHTML = `
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <span class="badge bg-secondary">${repo.stargazers_count} ★</span>
      `;
	    repoItems.appendChild(repoItem);
	});

	reposList.classList.remove("d-none");
    } catch (error) {
	alert(error.message);
    } finally {
	loading.style.display = "none";
    }
});
