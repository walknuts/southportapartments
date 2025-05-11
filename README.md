# Southport Apartments Website

This is the 11ty source for the Southport Apartments complex, located on the shores of beautiful Lake Tuggeranong.

## Overview

This website is built using:
- [Eleventy (11ty)](https://www.11ty.dev/) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [daisyUI](https://daisyui.com/) - Component library for Tailwind CSS
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Templating engine

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/walknuts/southportapartments.git
   cd southportapartments
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

This will:
- Start 11ty in watch mode
- Compile Tailwind CSS
- Live reload when changes are detected

The site will be available at http://localhost:8080

## Building for Production

To build the site for production:

```bash
npm run build
```

The built site will be in the `_site` directory, ready for deployment.

## Project Structure

```
southportapartments/
├── src/
│   ├── _data/          # Site data files (JSON, JS)
│   ├── _includes/      # Reusable components
│   ├── _layouts/       # Page layouts
│   ├── assets/         # Asset files (CSS, JS, fonts)
│   ├── images/         # Image files
│   ├── js/             # JavaScript files
│   ├── pages/          # Static pages
│   ├── posts/          # Blog posts
│   └── index.njk       # Homepage
├── .eleventy.js        # Eleventy configuration
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Migration from Jekyll

This site was migrated from a Jekyll site to 11ty. Migration scripts are included to help convert content:

- `migrate.js` - Main migration script that runs all others
- `migrate-assets.js` - Migrates assets (images, CSS, etc.)
- `migrate-posts.js` - Migrates blog posts
- `migrate-pages.js` - Migrates static pages

To run the migration:

```bash
npm run migrate
```

## Customization

### Styling

The site uses Tailwind CSS with daisyUI components. The main design can be customized in:

- `tailwind.config.js` - Theme colors, fonts, and other Tailwind settings
- `src/css/main.css` - Custom CSS and Tailwind directives
- `src/_data/site.json` - Site-wide configuration

### Templates

- Page templates are in `src/_layouts`
- Reusable components are in `src/_includes`
- Data files are in `src/_data`

## Content Management

### Blog Posts

Blog posts are stored as Markdown files in `src/posts/`. The frontmatter for each post includes:

```yaml
---
layout: post.njk
title: "Post Title"
date: YYYY-MM-DD
categories: ["Category1", "Category2"]
description: "Brief description of the post"
image: "/images/path-to-image.jpg"
---
```

### Pages

Static pages are stored as Markdown files in `src/pages/`. The frontmatter for each page includes:

```yaml
---
layout: page.njk
title: "Page Title"
description: "Page description"
permalink: "/custom-url/"
banner:
  heading: "Banner Heading"
  subheading: "Banner Subheading"
bannerImage: "/images/path-to-banner.jpg"
eleventyNavigation:
  key: PageName
  order: 1
---
```

## License

ISC License - See LICENSE file for details