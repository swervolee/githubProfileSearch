function aggregateCommits(dates) {
          const commitCount = {};
          dates.forEach(date => {
              const day = new Date(date).toISOString().split('T')[0];
              commitCount[day] = (commitCount[day] || 0) + 1;
          });
          return commitCount;
      }

export async function fetchUserProfile(username) {
    const response = await fetch(`/api/github/user/${username}`);
    if (!response.ok) throw new Error("Profile not found");
    return response.json();
}

export async function fetchUserRepos(username) {
    const response = await fetch(`/api/github/repos/${username}`);
    if (!response.ok) throw new Error("Failed to fetch repositories");

    const repos = await response.json();

    repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return repos;
}




export async function main(username) {
    try {
        if (!username) {
            throw new Error("Username is required");
        }

        // Fetch the list of repositories for the user
        const reposResponse = await fetch(`/api/github/repos/${username}`);
        if (!reposResponse.ok) {
            throw new Error("Failed to fetch repositories");
        }
        const repos = await reposResponse.json();

        // Filter and sort repositories by `updated_at` and pick the top 5
        let recentRepos = repos
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Descending order
            .slice(0, 5); // Take top 5
	recentRepos = recentRepos.filter(item => item.full_name.split('/').at(-1) != username);

        

        // Fetch commit dates for the top 5 repositories in parallel
        const allDatesPromises = recentRepos.map(async (repo) => {
            const repoName = repo.full_name.split('/').at(-1);
            console.log(repoName);
            const commitDatesResponse = await fetch(`/api/github/commits/${repoName}/${username}`);
            if (!commitDatesResponse.ok) {
                throw new Error(`Failed to fetch commits for repo: ${repoName}`);
            }
            return await commitDatesResponse.json(); // Await JSON parsing
        });

        // Resolve all promises and flatten the commit dates
        const allDatesArrays = await Promise.all(allDatesPromises);
        let  allDates = [].concat(...allDatesArrays); // Fallback for older environments
	allDates = allDates.map(item => item.commit.author.date);
	
        // Aggregate commit data
        const commitData = aggregateCommits(allDates);
        return commitData;

    } catch (error) {
        console.error("Error in main function:", error.message, error.stack);
        throw error;
    }
}

