# AGENTS.md - AI Assistant Guide

Personal tech blog by Martin Mueller. Gatsby 5 + React 18 + Tailwind CSS, deployed on Netlify.

**Site:** https://martinmueller.dev

## Quick Commands

```bash
npm run dev      # local dev server (localhost:8000)
npm run build    # production build
npm run serve    # serve production build
npm run format   # prettier formatting
```

## Architecture

```
content/           # Blog posts (markdown + images per folder)
src/
├── components/    # React components (Layout, Header, Metatags, etc.)
├── pages/         # Static pages (index, tags, 404)
├── templates/     # Dynamic page templates (blog-post, tag-template)
├── utils/         # Utilities (seo.js)
└── images/        # Static images
gatsby-config.js   # Plugins, site metadata, RSS feeds
gatsby-node.js     # Page creation, GraphQL schema
```

## Content Structure

Posts live in `content/{slug}/index.md` with frontmatter:

```yaml
---
title: "Post Title"
show: "yes"           # "no" to hide from listings
date: "YYYY-MM-DD"
image: "image.png"    # relative path, in same folder
tags: ["aws", "eng"]  # "eng" for English, "de" for German
engUrl: /path         # optional: link to English version
gerUrl: /path         # optional: link to German version
showContact: "no"     # optional: hide contact form
pruneLength: 50       # optional: excerpt length
---
```

**Key tags:**
- `eng` - English posts (included in /rss.xml)
- `de` - German posts (included in /rss-ger.xml)
- `nofeed` - exclude from RSS

## Styling

Use Tailwind CSS classes. **Never use inline styles or CSS/SCSS.**

Brand colors defined in `tailwind.config.js`:
- `brand` (#06aced), `brand-dark`, `brand-light`

## Key Files

| File | Purpose |
|------|---------|
| `gatsby-config.js` | Site metadata, plugins, RSS feed config |
| `gatsby-node.js` | Creates pages from markdown, defines GraphQL schema |
| `src/templates/blog-post.js` | Blog post template with SEO, breadcrumbs, sharing |
| `src/components/Metatags.js` | SEO meta tags, Open Graph, JSON-LD structured data |
| `src/utils/seo.js` | SEO utilities (keywords, reading time, structured data) |
| `src/pages/index.js` | Homepage with post listings |

## GraphQL Queries

Posts are queried via `allMarkdownRemark`. Key fields:
- `frontmatter`: title, date, tags, image, show, engUrl, gerUrl
- `fields.slug`: URL path (auto-generated from folder name)
- `excerpt`, `html`: content

## Adding a New Post

1. Create folder: `content/my-post/`
2. Add `index.md` with frontmatter
3. Add images to same folder (reference as `image.png`)
4. Tag with `eng` or `de` for language

## Deployment

- Auto-deploys to Netlify on push to master
- Build command: `gatsby build`
- Netlify config: `netlify.toml`

## Common Patterns

**Image in post:**
```markdown
![Alt text](image.png)
```

**Bilingual posts:** Create two folders (e.g., `my-post/` and `my-post-eng/`), link via `engUrl`/`gerUrl` frontmatter.

**Hide post:** Set `show: "no"` in frontmatter.

## Constraints

- Don't use inline styles - use Tailwind classes
- Don't do git checkout
- Be extremely concise in commits/communication
