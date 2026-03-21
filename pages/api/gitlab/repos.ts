import type { NextApiRequest, NextApiResponse } from 'next';

import getLatestRepos from '../../../lib/gitlabapi/getLatestRepos';
import type { RepositorySummary } from '../../../types/site';

type ErrorResponse = {
  error: string;
  message?: string;
};

type GitLabReposResponse = {
  repos: RepositorySummary[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GitLabReposResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const repos = await getLatestRepos();
    return res.status(200).json({ repos });
  } catch (error) {
    console.error('Error fetching GitLab repos:', error);
    return res.status(500).json({
      error: 'Failed to fetch repositories',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}