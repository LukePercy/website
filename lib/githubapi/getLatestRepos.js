const getLatestRepos = async (data) => {
  // console.log("data", data);
  try {
    const username = data.githubUsername;

    let token = `${process.env.GITHUB_AUTH_TOKEN}`;
    // console.log("TOKEN", token);
    const headers = token
      ? {
        Authorization: `token ${token}`,
      }
      : undefined;

    const response = await fetch(
      `https://api.github.com/search/repositories?q=user:${username}+sort:author-date-asc`,
      { headers }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${message}`);
    }

    const body = await response.json();
    const repos = Array.isArray(body?.items) ? body.items : [];
    return repos.slice(0, 6);
  } catch (err) {
    console.log(err);
  }
};

export default getLatestRepos;
