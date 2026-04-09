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
      ? repos.slice(0, 6).map((repo) => ({
          source: 'github' as const,
          id: repo.id,
          name: repo.name,
          description: repo.description ?? null,
          html_url: repo.html_url,
          language: repo.language ?? null,
          stargazers_count: repo.stargazers_count ?? 0,
          forks_count: repo.forks_count ?? 0,
        }))
      : [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export default getLatestRepos;