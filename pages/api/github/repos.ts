import type { NextApiRequest, NextApiResponse } from 'next';

import getLatestRepos from '../../../lib/githubapi/getLatestRepos';
import type { RepositorySummary } from '../../../types/site';

type ErrorResponse = {
  error: string;
  message?: string;
};

type GitHubReposResponse = {
  repos: RepositorySummary[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GitHubReposResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const latestSixRepos = await getLatestRepos({
      githubUsername: process.env.GITHUB_USERNAME || 'yourusername',
    });

    return res.status(200).json({ repos: latestSixRepos });
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return res.status(500).json({
      error: 'Failed to fetch repositories',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}