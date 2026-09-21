import React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import MetaTags from "../../components/Metatags"
import { thankYouContent } from "../../data/coursesContent"

const SITE_URL = "https://martinmueller.dev"

const WaitlistThankYouDePage = ({ location }) => {
 const content = thankYouContent.de
 const { meta, langSwitch, heading, body, catalogLink } = content

 return (
  <Layout fullWidth>
   <MetaTags
    title={meta.title}
    description={meta.description}
    locale={meta.locale}
    language={meta.language}
    url={SITE_URL}
    pathname={location.pathname}
    engUrl={meta.engUrl}
    gerUrl={meta.gerUrl}
   />
   <div className="mx-auto max-w-2xl px-4 py-16 text-center">
    <Link to={langSwitch.href} className="mb-8 inline-block text-brand hover:underline">
     {langSwitch.label}
    </Link>
    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
     {heading}
    </h1>
    <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">{body}</p>
    <Link to={catalogLink.href} className="text-brand hover:underline">
     {catalogLink.label}
    </Link>
   </div>
  </Layout>
 )
}

export default WaitlistThankYouDePage
