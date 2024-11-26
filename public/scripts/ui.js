export function updateProfileUI(profileData) {
    const profileCard = document.getElementById("profile-card");

    // Safely update the avatar background
    const avatarElement = document.getElementById("avatar");
    if (avatarElement) {
        avatarElement.src = profileData.avatar_url || 'default-avatar.jpg';
    } else {
        console.error("Avatar element not found in the DOM.");
    }

    // Update other profile fields
    document.getElementById("name").textContent = profileData.name || "N/A";
    document.getElementById("bio").textContent = profileData.bio || "No bio available";
    document.getElementById("profile-link").href = profileData.html_url || "#";
    document.getElementById("location").textContent = profileData.location || "N/A";

    // Update blog link safely
    const blogElement = document.getElementById("blog");
    if (profileData.blog) {
        blogElement.href = profileData.blog;
        blogElement.textContent = profileData.blog;
    } else {
        blogElement.href = "#";
        blogElement.textContent = "N/A";
    }

    document.getElementById("company").textContent = profileData.company || "N/A";
    document.getElementById("repos").textContent = profileData.public_repos || "0";
    document.getElementById("followers").textContent = profileData.followers || "0";
    document.getElementById("following").textContent = profileData.following || "0";

    // Show the profile card
    if (profileCard) {
        profileCard.classList.remove("d-none");
    } else {
        console.error("Profile card element not found in the DOM.");
    }
}



export function updateReposUI(reposData) {
    const repoItems = document.getElementById("repo-items");
    repoItems.innerHTML = ""; // Clear existing content

    // Check if there are no repositories
    if (reposData.length === 0) {
        const noReposItem = document.createElement("li");
        noReposItem.style.cssText = `
            padding: 1rem; 
            background: rgba(255, 255, 255, 0.8); 
            backdrop-filter: blur(5px); 
            color: #721c24; 
            border: 1px solid #f5c6cb; 
            border-radius: 8px; 
            margin-bottom: 0.5rem; 
            text-align: center;
            font-size: 1.2rem;
        `;
        noReposItem.textContent = "No repositories available";
        repoItems.appendChild(noReposItem);
    } else {
        // Populate repository list
        reposData.forEach(repo => {
            const repoItem = document.createElement("li");
            repoItem.style.cssText = `
                padding: 1rem; 
                background: rgba(255, 255, 255, 0.5);
                color: #333; 
                border: 1px solid #ddd; 
                border-radius: 8px; 
                margin-bottom: 0.5rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            `;
            repoItem.onmouseover = () => {
                repoItem.style.transform = "translateY(-3px)";
                repoItem.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            };
            repoItem.onmouseout = () => {
                repoItem.style.transform = "translateY(0)";
                repoItem.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
            };

            // Repository Name and Link
            const repoLink = document.createElement("a");
            repoLink.href = repo.html_url;
            repoLink.target = "_blank";
            repoLink.textContent = repo.name;
            repoLink.style.cssText = `
                text-decoration: none; 
                color: #0056b3; 
                font-weight: bold;
                font-size: 1.1rem;
            `;
            repoLink.onmouseover = () => (repoLink.style.color = "#003d8f");
            repoLink.onmouseout = () => (repoLink.style.color = "#0056b3");

            // Repository Description
            const repoDescription = document.createElement("p");
            repoDescription.textContent = repo.description || "No description provided.";
            repoDescription.style.cssText = `
                margin: 0.5rem 0; 
                font-size: 0.9rem; 
                color: #555;
            `;

            // Repository Details
            const repoDetails = document.createElement("div");
            repoDetails.style.cssText = `
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                font-size: 0.9rem;
                color: #777;
            `;

            // Language
            const repoLanguage = document.createElement("span");
            repoLanguage.textContent = repo.language || "Unknown";
            repoLanguage.style.cssText = `
                font-style: italic;
            `;

            // Last Updated
            const repoUpdated = document.createElement("span");
            const updatedDate = new Date(repo.updated_at);
            repoUpdated.textContent = `Updated: ${updatedDate.toLocaleDateString()}`;
            repoUpdated.style.cssText = `
                color: #999;
            `;

            // Stars Badge
            const starsBadge = document.createElement("span");
            starsBadge.textContent = `${repo.stargazers_count} ★`;
            starsBadge.style.cssText = `
                background-color: #fc3a52; 
                color: white; 
                padding: 0.4rem 0.7rem; 
                border-radius: 12px; 
                font-size: 0.9rem;
                font-weight: bold;
            `;

            // Assemble Details
            repoDetails.appendChild(repoLanguage);
            repoDetails.appendChild(repoUpdated);
            repoDetails.appendChild(starsBadge);

            // Append all elements
            repoItem.appendChild(repoLink);
            repoItem.appendChild(repoDescription);
            repoItem.appendChild(repoDetails);
            repoItems.appendChild(repoItem);
        });
    }
}




export function drawGraph(data) {
    const canvas = document.getElementById('commitGraph');
    const ctx = canvas.getContext('2d');

    const dates = Object.keys(data).sort(); // Sort the dates
    const values = dates.map(date => data[date]);

    // Calculate dimensions
    const padding = 50;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...values);

    // Scale values
    const xScale = graphWidth / (dates.length - 1);
    const yScale = graphHeight / maxValue;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Grid lines
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= maxValue; i += Math.ceil(maxValue / 5)) {
        const y = canvas.height - padding - i * yScale;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    for (let i = 0; i < dates.length; i += Math.ceil(dates.length / 10)) {
        const x = padding + i * xScale;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvas.height - padding);
        ctx.stroke();
    }

    // Draw the graph
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(33, 150, 243, 1)';
    ctx.fillStyle = 'rgba(33, 150, 243, 0.1)';
    ctx.moveTo(padding, canvas.height - padding);
    for (let i = 0; i < dates.length; i++) {
        const x = padding + i * xScale;
        const y = canvas.height - padding - values[i] * yScale;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(padding + (dates.length - 1) * xScale, canvas.height - padding);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Add data points
    ctx.fillStyle = 'red';
    for (let i = 0; i < dates.length; i++) {
        const x = padding + i * xScale;
        const y = canvas.height - padding - values[i] * yScale;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Add axis labels
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    for (let i = 0; i < dates.length; i += Math.ceil(dates.length / 10)) {
        const x = padding + i * xScale;
        ctx.fillText(dates[i], x - 20, canvas.height - padding + 20);
    }

    for (let i = 0; i <= maxValue; i += Math.ceil(maxValue / 5)) {
        const y = canvas.height - padding - i * yScale;
        ctx.fillText(i, padding - 35, y + 5);
    }

    // Tooltip for hover interaction
    canvas.addEventListener('mousemove', event => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let i = 0; i < dates.length; i++) {
            const x = padding + i * xScale;
            const y = canvas.height - padding - values[i] * yScale;
            if (Math.abs(mouseX - x) < 5 && Math.abs(mouseY - y) < 5) {
                // Clear tooltip
                ctx.clearRect(0, 0, canvas.width, padding);
                ctx.fillStyle = 'black';
                ctx.fillText(`Date: ${dates[i]}, Commits: ${values[i]}`, mouseX + 10, mouseY - 10);
                break;
            }
        }
    });
}




export function showError(message) {
    console.log(message);
}
