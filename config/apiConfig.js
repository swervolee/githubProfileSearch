const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
    "Authorization": process.env.git_token,
    "User-Agent": "swervolee",
};

export default headers;
