import type { GitHubReposConfig, RepositorySummary } from '../../types/site';

const getLatestRepos = async (data: GitHubReposConfig): Promise<RepositorySummary[]> => {
  try {
    const username = data.githubUsername;
    const token = process.env.GITHUB_AUTH_TOKEN || '';
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

    const repos = (await response.json()) as RepositorySummary[];
    return Array.isArray(repos)
      ? repos.slice(0, 6).map((repo) => ({ ...repo, source: 'github' }))
      : [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export default getLatestRepos;