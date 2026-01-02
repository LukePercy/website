import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const postsDirectory = path.join(process.cwd(), 'content/blog');

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: source };
  }

  const [, frontmatterRaw, content] = match;
  const data = YAML.parse(frontmatterRaw) ?? {};
  return { data, content };
}

export function getSortedPostsData() {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // Get file names under /content/blog
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = parseFrontmatter(fileContents);

      if (data?.draft) {
        return null;
      }

      return {
        slug,
        ...data,
      };
    })
    .filter(Boolean);

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = parseFrontmatter(fileContents);

      if (data?.draft) {
        return null;
      }

      return {
        params: {
          slug,
        },
      };
    })
    .filter(Boolean);
}

export async function getPostData(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  // Try .mdx first, fallback to .md
  let fileContents;
  let fileType = 'mdx';

  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch {
    const mdPath = path.join(postsDirectory, `${slug}.md`);
    fileContents = fs.readFileSync(mdPath, 'utf8');
    fileType = 'md';
  }

  const { data, content } = parseFrontmatter(fileContents);

  // Combine the data with the slug and content
  return {
    slug,
    content,
    fileType,
    ...data,
  };
}

export function getPaginatedPosts(page = 1, postsPerPage = 10) {
  const allPosts = getSortedPostsData();
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  return {
    posts: allPosts.slice(startIndex, endIndex),
    totalPages,
    currentPage: page,
    totalPosts: allPosts.length,
  };
}
