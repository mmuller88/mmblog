import React from "react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"

const Breadcrumb = ({ crumbs, siteUrl }) => {
 if (!crumbs || crumbs.length <= 1) {
  return null
 }

 // Generate JSON-LD structured data for breadcrumbs
 const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
   "@type": "ListItem",
   position: index + 1,
   name: crumb.name,
   item: siteUrl + crumb.path,
  })),
 }

 return (
  <>
   <Helmet>
    <script type="application/ld+json">
     {JSON.stringify(breadcrumbStructuredData)}
    </script>
   </Helmet>
   <nav aria-label="Breadcrumb" className="mb-4">
    <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-500 dark:text-gray-400 list-none p-0 m-0">
     {crumbs.map((crumb, index) => (
      <li key={crumb.path} className="flex items-center">
       {index > 0 && (
        <span
         className="mx-2 text-gray-400 dark:text-gray-500"
         aria-hidden="true"
        >
         ›
        </span>
       )}
       {index === crumbs.length - 1 ? (
        <span
         className="text-gray-700 dark:text-gray-200 font-medium"
         aria-current="page"
        >
         {crumb.name.length > 50
          ? crumb.name.substring(0, 50) + "..."
          : crumb.name}
        </span>
       ) : (
        <Link
         to={crumb.path}
         className="text-blue-600 dark:text-blue-400 no-underline"
        >
         {crumb.name}
        </Link>
       )}
      </li>
     ))}
    </ol>
   </nav>
  </>
 )
}

export default Breadcrumb
