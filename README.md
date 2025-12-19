# Portfolio & Blog Website

A modern Next.js portfolio and blog website with GitHub API integration and MDX-powered content.

## Features

- **Portfolio Homepage** with hero banner and projects showcase
- **Blog System** powered by MDX with markdown support
- **GitHub Projects** automatically fetched from GitHub API
- **Responsive Design** with Tailwind CSS and dark mode support
- **SEO Optimized** with automatic sitemap generation

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd website
```

2. Install dependencies:
```bash
npm install
```

3. Create your environment file:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:
```bash
# Optional: Google Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX

# Required: GitHub Integration
GITHUB_USERNAME=your-github-username
GITHUB_AUTH_TOKEN=ghp_xxxxxxxxxxxx  # Optional, prevents rate limiting
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### Building for Production

```bash
npm run build
npm start
```

The build process automatically generates a sitemap at `/sitemap.xml`.

## Content Management

### Adding Blog Posts

1. Create a new `.mdx` file in `content/blog/`:
```mdx
---
title: 'Your Post Title'
date: '2024-01-15'
excerpt: 'A brief description of your post'
---

# Your Content Here

Write your blog post content using Markdown or MDX.
```

2. Rebuild the site to generate static pages:
```bash
npm run build
```

### Customizing Content

- **Homepage Hero**: Edit `components/Hero.js`
- **About Page**: Edit `pages/about.js`
- **Footer**: Edit the footer section in `components/Layout.js`
- **Navigation**: Edit the nav section in `components/Layout.js`

### Projects

Projects are automatically fetched from your GitHub account using the `GITHUB_USERNAME` environment variable. The site displays your 6 most recent repositories with:
- Repository name and description
- Programming language
- Star and fork counts
- Direct link to the repository

To customize which repos are shown, edit `pages/api/github/repos.js`.

## Project Structure

```
website/
├── components/          # React components
│   ├── Layout.js       # Main layout with nav and footer
│   ├── Hero.js         # Homepage hero section
│   ├── ProjectsSection.js  # GitHub projects display
│   └── ErrorBoundary.js    # Error boundary component
├── pages/              # Next.js pages
│   ├── index.js        # Homepage
│   ├── about.js        # About page
│   ├── blog/
│   │   ├── index.js    # Blog listing page
│   │   └── [slug].js   # Dynamic blog post pages
│   └── api/
│       └── github/
│           └── repos.js    # GitHub API route
├── content/
│   └── blog/           # Blog posts (MDX files)
├── lib/
│   ├── blog.js         # Blog utility functions
│   └── githubapi/      # GitHub API integration
├── styles/             # CSS and Tailwind styles
└── public/             # Static assets
```

## Technologies

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS with dark mode
- **Content**: MDX (Markdown + JSX)
- **API**: GitHub REST API
- **Deployment Ready**: Vercel, Netlify, or any Node.js host

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run postbuild` - Generate sitemap (runs automatically after build)

## Customization

### Updating Personal Information

1. **Contact Details**: Edit the footer in `components/Layout.js`
2. **About Page**: Update `pages/about.js` with your bio, skills, and experience
3. **Hero Message**: Customize the welcome message in `components/Hero.js`
4. **Site Title**: Update the `Layout` title prop in each page

### Styling

The site uses Tailwind CSS. Customize the theme in `tailwind.config.js`:
- Colors (including the `autumn-orange` accent color)
- Typography
- Breakpoints
- Dark mode settings

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Your own Node.js server

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | No | Google Analytics tracking ID |
| `GITHUB_USERNAME` | Yes | Your GitHub username for projects |
| `GITHUB_AUTH_TOKEN` | No | GitHub personal access token (prevents rate limiting) |

## License

MIT License - Feel free to use this project for your own portfolio!

## Support

For issues or questions, please open an issue on GitHub.
