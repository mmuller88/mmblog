// SEO Utility Functions

/**
 * Generate SEO-friendly slug from title
 */
export const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
};

/**
 * Truncate text to specified length with ellipsis
 */
export const truncateText = (text, maxLength = 160) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Extract keywords from text content
 */
export const extractKeywords = (content, tags = [], title = '', maxKeywords = 15) => {
  const commonWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'shall',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their'
  ];
  
  if (!content) return tags;
  
  // Combine title and content
  const allText = `${title} ${content}`.toLowerCase();
  
  // Extract words
  const words = allText
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !commonWords.includes(word) &&
      !word.match(/^\d+$/) // Exclude pure numbers
    );
  
  // Count frequency
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Get most frequent words
  const frequentWords = Object.keys(wordCount)
    .sort((a, b) => wordCount[b] - wordCount[a])
    .slice(0, maxKeywords - tags.length);
  
  // Combine with tags, removing duplicates
  return [...new Set([...tags, ...frequentWords])];
};

/**
 * Calculate reading time
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return 0;
  
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Generate breadcrumb data
 */
export const generateBreadcrumbs = (pathname, title, customCrumbs = []) => {
  const crumbs = [{ name: 'Home', path: '/' }];
  
  // Add custom crumbs if provided
  if (customCrumbs.length > 0) {
    crumbs.push(...customCrumbs);
  }
  
  // Add current page
  if (pathname !== '/') {
    crumbs.push({ name: title, path: pathname });
  }
  
  return crumbs;
};

/**
 * Generate Open Graph image URL
 */
export const generateOGImageUrl = (title, description) => {
  const baseUrl = 'https://og-image-generator.vercel.app';
  const params = new URLSearchParams({
    title: title || 'Martin Mueller\'s Blog',
    subtitle: description || 'Technology insights and tutorials',
    logo: 'https://martinmueller.dev/avatarIcon.jpeg',
    theme: 'light',
    template: 'article'
  });
  
  return `${baseUrl}/api/generate?${params.toString()}`;
};

/**
 * Validate SEO requirements
 */
export const validateSEO = (data) => {
  const issues = [];
  const recommendations = [];
  
  // Title validation
  if (!data.title) {
    issues.push('Missing title tag');
  } else if (data.title.length < 30) {
    recommendations.push('Title could be longer (30-60 characters recommended)');
  } else if (data.title.length > 60) {
    issues.push('Title too long (over 60 characters)');
  }
  
  // Description validation
  if (!data.description) {
    issues.push('Missing meta description');
  } else if (data.description.length < 120) {
    recommendations.push('Meta description could be longer (120-160 characters recommended)');
  } else if (data.description.length > 160) {
    issues.push('Meta description too long (over 160 characters)');
  }
  
  // Keywords validation
  if (!data.keywords || data.keywords.length === 0) {
    recommendations.push('Consider adding relevant keywords');
  } else if (data.keywords.length > 20) {
    recommendations.push('Too many keywords - focus on 10-15 most relevant ones');
  }
  
  // Image validation
  if (!data.image) {
    recommendations.push('Consider adding an Open Graph image');
  }
  
  // Content validation
  if (data.content) {
    const readingTime = calculateReadingTime(data.content);
    if (readingTime < 3) {
      recommendations.push('Content might be too short for good SEO (aim for 300+ words)');
    }
  }
  
  return {
    issues,
    recommendations,
    score: Math.max(0, 100 - (issues.length * 20) - (recommendations.length * 5))
  };
};

/**
 * Generate structured data for different content types
 */
export const generateStructuredData = {
  article: (data) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": data.title,
    "description": data.description,
    "author": {
      "@type": "Person",
      "name": data.author || "Martin Mueller",
      "url": data.siteUrl,
      "sameAs": [
        "https://twitter.com/MartinMueller_",
        "https://github.com/mmuller88",
        "https://www.linkedin.com/in/martin-mueller-dev/"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Martin Mueller's Blog",
      "url": data.siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${data.siteUrl}/avatarIcon.jpeg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url
    },
    "url": data.url,
    "datePublished": data.publishedDate,
    "dateModified": data.modifiedDate || data.publishedDate,
    "keywords": data.keywords?.join(', '),
    ...(data.image && {
      "image": {
        "@type": "ImageObject",
        "url": data.image,
        "width": 1200,
        "height": 630
      }
    }),
    ...(data.readingTime && {
      "timeRequired": `PT${data.readingTime}M`
    })
  }),
  
  website: (data) => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": data.title,
    "url": data.url,
    "description": data.description,
    "author": {
      "@type": "Person",
      "name": data.author || "Martin Mueller"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${data.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }),
  
  person: (data) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": data.name || "Martin Mueller",
    "url": data.url,
    "jobTitle": "AWS Solutions Architect & Software Engineer",
    "description": data.description,
    "sameAs": [
      "https://twitter.com/MartinMueller_",
      "https://github.com/mmuller88",
      "https://www.linkedin.com/in/martin-mueller-dev/"
    ],
    "knowsAbout": [
      "AWS", "Cloud Computing", "Serverless", "CDK", "Infrastructure as Code",
      "Software Engineering", "DevOps"
    ]
  }),
  
  breadcrumb: (crumbs, siteUrl) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": siteUrl + crumb.path
    }))
  })
}; 