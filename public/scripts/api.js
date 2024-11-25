export async function fetchUserProfile(username) {
    const response = await fetch(`/api/github/user/${username}`);
    if (!response.ok) throw new Error("Profile not found");
    return response.json();
}

export async function fetchUserRepos(username) {
    const response = await fetch(`/api/github/repos/${username}`);
    if (!response.ok) throw new Error("Failed to fetch repositories");
    return response.json();
}
