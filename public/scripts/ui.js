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

    // Draw grid lines for better readability
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

    // Create a gradient for the line
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, 'rgba(33, 150, 243, 0.9)'); // Blue
    gradient.addColorStop(1, 'rgba(33, 150, 243, 0.1)'); // Transparent blue

    // Draw the filled area under the graph
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(33, 150, 243, 1)';
    ctx.fillStyle = gradient;

    ctx.lineTo(padding, canvas.height - padding - values[0] * yScale);
    for (let i = 1; i < dates.length; i++) {
        const x = padding + i * xScale;
        const y = canvas.height - padding - values[i] * yScale;
        const cp1x = padding + (i - 0.5) * xScale;
        const cp1y = canvas.height - padding - values[i - 1] * yScale;
        ctx.quadraticCurveTo(cp1x, cp1y, x, y);
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

    // Add labels for axes
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
}


export function updateReposUI(reposData) {
    const repoItems = document.getElementById("repo-items");
    repoItems.innerHTML = ""; // Clear existing content

    // Check if there are no repositories
    if (reposData.length === 0) {
        const noReposItem = document.createElement("li");
        noReposItem.style.cssText = `
            padding: 1rem; 
            background-color: #f8d7da; 
            color: #721c24; 
            border: 1px solid #f5c6cb; 
            border-radius: 5px;
            margin-bottom: 0.5rem;
            text-align: center;
        `;
        noReposItem.textContent = "No repositories available";
        repoItems.appendChild(noReposItem);
    } else {
        // Populate repository list
        reposData.forEach(repo => {
            const repoItem = document.createElement("li");
            repoItem.style.cssText = `
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 1rem; 
                background-color: #f1f1f1; 
                border: 1px solid #ddd; 
                border-radius: 5px; 
                margin-bottom: 0.5rem;
            `;

            // Repository Link
            const repoLink = document.createElement("a");
            repoLink.href = repo.html_url;
            repoLink.target = "_blank";
            repoLink.textContent = repo.name;
            repoLink.style.cssText = `
                text-decoration: none; 
                color: #007bff; 
                font-weight: bold;
            `;
            repoLink.onmouseover = () => (repoLink.style.color = "#0056b3");
            repoLink.onmouseout = () => (repoLink.style.color = "#007bff");

            // Stars Badge
            const starsBadge = document.createElement("span");
            starsBadge.textContent = `${repo.stargazers_count} ★`;
            starsBadge.style.cssText = `
                background-color: #007bff; 
                color: white; 
                padding: 0.3rem 0.5rem; 
                border-radius: 10px; 
                font-size: 0.9rem;
            `;

            // Append elements
            repoItem.appendChild(repoLink);
            repoItem.appendChild(starsBadge);
            repoItems.appendChild(repoItem);
        });
    }
}


export function showError(message) {
    console.log(message);
}
