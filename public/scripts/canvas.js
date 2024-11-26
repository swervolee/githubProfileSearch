// Function to fetch commit timestamps for a repository
async function fetchCommits(repoName, username) {
    const response = await fetch(`https://api.github.com/repos/${repoName}/commits?author=${username}`, {
        headers: {
            Authorization: `token ${TOKEN}`
        }
    });
    const commits = await response.json();
    return commits.map(commit => commit.commit.author.date);
}

// Function to aggregate commit data by date
function aggregateCommits(dates) {
    const commitCount = {};
    dates.forEach(date => {
        const day = new Date(date).toISOString().split('T')[0];
        commitCount[day] = (commitCount[day] || 0) + 1;
    });
    return commitCount;
}

// Function to draw the graph

// Main function
