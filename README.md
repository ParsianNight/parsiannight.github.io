# Omar Abdelrazik — Portfolio Website

A modern, hacker-themed portfolio website for a security researcher and content creator. Built with pure HTML, CSS, and JavaScript — no frameworks, no build tools.

## Quick Start

Open `index.html` directly in your browser. That's it.

## Deployment

### GitHub Pages

1. Push this `portfolio/` directory to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Source**, select the branch and root folder (or `/docs` if you rename the folder).
4. Your site will be live at `https://yourusername.github.io/repo-name/`.

### Netlify

1. Drag and drop the `portfolio/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
2. Optionally connect your Git repo for continuous deployment.
3. Configure a custom domain in Site settings.

### Vercel

1. Install the Vercel CLI: `npm i -g vercel`.
2. Run `vercel` inside the `portfolio/` directory.
3. Follow the prompts to deploy.
4. Configure a custom domain in your Vercel dashboard.

### Any Static Host

This is a fully static site. Upload the entire `portfolio/` folder to any web server or static hosting provider (AWS S3 + CloudFront, Firebase Hosting, Cloudflare Pages, etc.).

## Structure

```
portfolio/
├── index.html           # Main single-page application
├── css/
│   ├── style.css        # Core styles, layout, responsive design
│   └── animations.css   # All animations, effects, transitions
├── js/
│   ├── main.js          # Navigation, counters, tabs, forms, typing effect
│   └── particles.js     # Interactive particle background effect
├── assets/
│   ├── img/             # Images (add your own)
│   └── icons/           # Icons (add your own)
└── README.md            # This file
```

## Customization

- **Colors & Theme**: Edit CSS variables in `:root` at the top of `css/style.css`.
- **Content**: Edit `index.html` directly — all content is in the HTML.
- **Typing phrases**: Edit the `phrases` array in `js/main.js` (`initTypingEffect` function).
- **Particle effect**: Adjust the `config` object in `js/particles.js`.

## Features

- Responsive design (mobile, tablet, desktop)
- Dark/light theme toggle with localStorage persistence
- Interactive particle background with mouse tracking
- Typing animation in hero section
- Scroll-triggered reveal animations (Intersection Observer)
- Animated number counters
- Glitch text effect on hover
- Glassmorphism card design
- Content tabs (videos / blog)
- Severity-tagged security write-up cards
- Animated skill bars and staggered skill tags
- Contact form (frontend only — connect to your backend or Formspree/Netlify Forms)
- Custom scrollbar
- SEO meta tags and Open Graph tags
- Accessible (ARIA labels, semantic HTML, contrast ratios, reduced motion support)

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
