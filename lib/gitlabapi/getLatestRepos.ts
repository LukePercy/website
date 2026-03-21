import type { RepositorySummary } from '../../types/site';

type GitLabProject = {
  id: number | string;
  name: string;
  description?: string | null;
  web_url: string;
  star_count?: number;
  forks_count?: number;
};

function toUnifiedRepo(project: GitLabProject): RepositorySummary {
  return {
    source: 'gitlab',
    id: project.id,
    name: project.name,
    description: project.description,
    html_url: project.web_url,
    stargazers_count: project.star_count,
    forks_count: project.forks_count,
    language: null,
  };
}

const getLatestRepos = async (): Promise<RepositorySummary[]> => {
  try {
    const token = process.env.GITLAB_AUTH_TOKEN;
    const projectPath = process.env.GITLAB_PROJECT_PATH;
    const namespace = process.env.GITLAB_NAMESPACE || 'dcentrica';

    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined;

    if (projectPath) {
      const encoded = encodeURIComponent(projectPath);
      const response = await fetch(`https://gitlab.com/api/v4/projects/${encoded}`, { headers });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`GitLab API error (${response.status}): ${message}`);
      }

      const project = (await response.json()) as GitLabProject;
      return [toUnifiedRepo(project)];
    }

    const params = new URLSearchParams({
      per_page: '6',
      order_by: 'last_activity_at',
      sort: 'desc',
      simple: 'true',
      include_subgroups: 'true',
      with_shared: 'false',
    });

    const encodedGroup = encodeURIComponent(namespace);
    const response = await fetch(
      `https://gitlab.com/api/v4/groups/${encodedGroup}/projects?${params.toString()}`,
      { headers }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`GitLab API error (${response.status}): ${message}`);
    }

    const projects = (await response.json()) as GitLabProject[];
    return Array.isArray(projects) ? projects.slice(0, 6).map(toUnifiedRepo) : [];
  } catch (error) {
    console.error('Error fetching GitLab repos:', error);
    return [];
  }
};

export default getLatestRepos;