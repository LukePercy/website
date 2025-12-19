function toUnifiedRepo(project) {
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

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const token = process.env.GITLAB_AUTH_TOKEN;
        const projectPath = process.env.GITLAB_PROJECT_PATH; // e.g. dcentrica/metaport
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
            const project = await response.json();
            return res.status(200).json({ repos: [toUnifiedRepo(project)] });
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

        const projects = await response.json();
        const repos = Array.isArray(projects) ? projects.slice(0, 6).map(toUnifiedRepo) : [];
        return res.status(200).json({ repos });
    } catch (error) {
        console.error('Error fetching GitLab repos:', error);
        return res.status(500).json({
            error: 'Failed to fetch repositories',
            message: error.message,
        });
    }
}
