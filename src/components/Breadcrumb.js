import React from 'react';
import { Link } from 'gatsby';
import { Helmet } from 'react-helmet';

const Breadcrumb = ({ crumbs, siteUrl }) => {
  if (!crumbs || crumbs.length <= 1) {
    return null;
  }

  // Generate JSON-LD structured data for breadcrumbs
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": siteUrl + crumb.path
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
        <ol style={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          gap: '0.25rem',
          fontSize: '0.875rem', 
          color: '#6b7280',
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {crumbs.map((crumb, index) => (
            <li key={crumb.path} style={{ display: 'flex', alignItems: 'center' }}>
              {index > 0 && (
                <span style={{ margin: '0 0.5rem', color: '#9ca3af' }} aria-hidden="true">
                  ›
                </span>
              )}
              {index === crumbs.length - 1 ? (
                <span style={{ color: '#374151', fontWeight: 500 }} aria-current="page">
                  {crumb.name.length > 50 ? crumb.name.substring(0, 50) + '...' : crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  style={{ color: '#2563eb', textDecoration: 'none' }}
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb; 