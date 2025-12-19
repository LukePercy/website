import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const username = process.env.GITHUB_USERNAME || 'yourusername';
    const token = process.env.GITHUB_AUTH_TOKEN;

    const config = token
      ? {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      : {};

    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      config
    );

    const latestSixRepos = response.data;

    return res.status(200).json({ repos: latestSixRepos });
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return res.status(500).json({
      error: 'Failed to fetch repositories',
      message: error.message,
    });
  }
}
