export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const username = process.env.GITHUB_USERNAME || 'yourusername';
    const token = process.env.GITHUB_AUTH_TOKEN;

    const headers = token
      ? {
        Authorization: `token ${token}`,
      }
      : undefined;

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      { headers }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${message}`);
    }

    const latestSixRepos = await response.json();

    return res.status(200).json({ repos: latestSixRepos });
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return res.status(500).json({
      error: 'Failed to fetch repositories',
      message: error.message,
    });
  }
}
