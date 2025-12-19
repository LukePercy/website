import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

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
      // Remove ".mdx" or ".md" from file name to get slug
      const slug = fileName.replace(/\.(mdx|md)$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const { data } = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        ...data,
      };
    });

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
      return {
        params: {
          slug: fileName.replace(/\.(mdx|md)$/, ''),
        },
      };
    });
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

  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);

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
