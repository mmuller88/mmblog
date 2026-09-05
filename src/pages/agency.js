import React, { useEffect } from "react"
import Layout from "../components/layout"
import MetaTags from "../components/Metatags"
import TableOfContents from "../components/TableOfContents"
import SectionHeading from "../components/SectionHeading"
import "../styles/heading-anchors.css"
import testimonialJakob from "../../content/resume/testimonialJakob.png"
import testimonialAdrian from "../../content/resume/testimonialAdrian.png"
import testimonialEric from "../../content/resume/testimonialEric.png"

const agencySections = [
 { id: "testimonials", value: "What Our Clients Say", depth: 2 },
 { id: "value-packages", value: "Value Packages", depth: 2 },
 { id: "why-choose-us", value: "Why Choose Us", depth: 2 },
 { id: "join-the-team", value: "Join the Team", depth: 2 },
 { id: "get-started", value: "Ready to Get Started?", depth: 2 },
]

const AgencyPage = ({ location }) => {
 useEffect(() => {
  const hash = location.hash?.replace(/^#/, "")
  if (!hash) return
  const el = document.getElementById(hash)
  if (!el) return
  requestAnimationFrame(() => {
   el.scrollIntoView({ behavior: "smooth", block: "start" })
  })
 }, [location.hash])

 return (
  <Layout fullWidth>
   <MetaTags
    title="Agency - AWS Expertise for Your Business"
    description="Empower your business or startup with AWS expertise. Unlock the full potential of the cloud with seamless migrations, optimized performance, and cost-effective solutions."
    url="https://martinmueller.dev"
    pathname={location.pathname}
   />

   {/* Hero Section */}
   <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
    <div className="mx-auto max-w-4xl text-center">
     <h1 className="mb-6 font-sans text-5xl font-bold text-gray-900 dark:text-gray-100 md:text-6xl">
      Agency 🤝
     </h1>
     <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300 md:text-2xl">
      Empower your business or startup with our AWS expertise. Unlock the full
      potential of the cloud with seamless migrations, optimized performance,
      and cost-effective solutions. Let's innovate together!
     </p>
     <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a
       href="mailto:office+agency@martinmueller.dev"
       target="_blank"
       rel="noopener noreferrer"
       className="inline-flex transform items-center justify-center rounded-lg bg-brand px-8 py-4 font-semibold text-white no-underline shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:text-white hover:no-underline hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 dark:hover:text-slate-900"
      >
       📝 Let's write
      </a>
      <a
       href="https://calendly.com/martinmueller_dev/30min"
       target="_blank"
       rel="noopener noreferrer"
       className="inline-flex transform items-center justify-center rounded-lg bg-brand px-8 py-4 font-semibold text-white no-underline shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:text-white hover:no-underline hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 dark:hover:text-slate-900"
      >
       🗣️ Let's speak
      </a>
     </div>
    </div>
   </div>

   <div className="mx-auto max-w-6xl px-4">
    <TableOfContents headings={agencySections} />
   </div>

   {/* Testimonials Section */}
   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-6xl">
     <SectionHeading id="testimonials">What Our Clients Say</SectionHeading>
     <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Jakob Jordan Testimonial */}
      <div className="flex h-full flex-col rounded-xl bg-gray-50 p-8 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <a
        href="https://www.linkedin.com/in/jakob-jordan-10404bb4/"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 block shrink-0 overflow-hidden rounded-lg bg-gray-200/60 dark:bg-slate-700/50 h-36"
       >
        <img
         src={testimonialJakob}
         alt="Jakob Jordan"
         className="mb-0 h-full w-full object-contain object-left"
        />
       </a>
       <div className="flex flex-1 flex-col gap-4 text-gray-700 dark:text-gray-300">
        <p className="mb-0 leading-relaxed">
         Martin Müller is a mega DevOps expert I've been working closely with
         for years (including in AWS and AI). He recently built a fully
         GDPR-compliant, self-hosted production environment on Hetzner in Germany
         for our new Arc Rider platform (React/Supabase) — through which we
         distribute our widgets as the ultimate UI framework. Including Grafana
         monitoring and an essential security audit.
        </p>
        <p className="mb-0 leading-relaxed">
         One requirement was extremely important to us, and he nailed it: he set
         up the complex infrastructure so intelligently that we can maintain and
         deploy it seamlessly through AI agents. Martin is someone who simply
         understood that in today's world of vibe coding and AI workflows, a
         secure yet flexible cloud environment is crucial — and GDPR-compliant in
         Europe. That's why I'd recommend him anytime!
        </p>
       </div>
      </div>

      {/* Adrian Logan Testimonial */}
      <div className="flex h-full flex-col rounded-xl bg-gray-50 p-8 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <a
        href="https://www.linkedin.com/in/adrian-logan-a52027b5"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 block shrink-0 overflow-hidden rounded-lg bg-gray-200/60 dark:bg-slate-700/50 h-36"
       >
        <img
         src={testimonialAdrian}
         alt="Adrian Logan"
         className="mb-0 h-full w-full object-contain object-left"
        />
       </a>
       <div className="flex flex-1 flex-col gap-4 text-gray-700 dark:text-gray-300">
        <p className="mb-0 leading-relaxed">
         I cannot recommend Martin Muller highly enough for his exceptional work
         in setting up our web application backend using the AWS CDK. Martin's
         expertise and efficiency have been instrumental in meeting project
         deadlines and ensuring a smooth deployment.
        </p>
        <p className="mb-0 leading-relaxed">
         The quality of his work is consistently top-notch, which gives me the
         utmost confidence in the final product. Additionally, Martin's ability
         to work quickly without sacrificing attention to detail has been
         invaluable to our team.
        </p>
        <p className="mb-0 leading-relaxed">
         His dedication and professionalism have made it a pleasure to collaborate
         with him, and I am confident that anyone who works with Martin will be
         similarly impressed by his talents.
        </p>
       </div>
      </div>

      {/* Eric Amberg Testimonial */}
      <div className="flex h-full flex-col rounded-xl bg-gray-50 p-8 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <a
        href="https://www.linkedin.com/in/ericamberg"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 block shrink-0 overflow-hidden rounded-lg bg-gray-200/60 dark:bg-slate-700/50 h-36"
       >
        <img
         src={testimonialEric}
         alt="Eric Amberg"
         className="mb-0 h-full w-full object-contain object-left"
        />
       </a>
       <div className="flex flex-1 flex-col gap-4 text-gray-700 dark:text-gray-300">
        <p className="mb-0 leading-relaxed">
         Martin built the sophisticated AWS infrastructure for our online lab
         environments. Working with him was characterized by very good
         communication and a very fast implementation of the tasks set.
        </p>
        <p className="mb-0 leading-relaxed">
         Martin works very professionally and has great experience with AWS
         environments. He is able to quickly grasp the requirements and promptly
         develop solution approaches. His concepts are scalable and comply with
         best practices in cloud environments.
        </p>
        <p className="mb-0 leading-relaxed">
         Thanks to his support, we got a stable cloud environment for our
         HackLabs in a very short time, which we still use today.
        </p>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Value Packages Section */}
   <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-16 dark:from-slate-800 dark:to-slate-900">
    <div className="mx-auto max-w-6xl">
     <SectionHeading id="value-packages" className="mb-4">
      Value Packages
     </SectionHeading>
     <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-400">
      Flexible engagement models tailored to your needs
     </p>
     <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <div className="mb-4 text-3xl">🎯</div>
       <h3 className="mb-3 font-sans text-xl font-semibold text-gray-900 dark:text-gray-100">
        Project with Milestones
       </h3>
       <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Pay a deposit upfront, then after reaching each milestone. Perfect for
        structured, long-term projects.
       </p>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <div className="mb-4 text-3xl">🚀</div>
       <h3 className="mb-3 font-sans text-xl font-semibold text-gray-900 dark:text-gray-100">
        Project-based
       </h3>
       <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Pay a deposit upfront, then the remainder upon project completion. Ideal
        for well-defined scopes.
       </p>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <div className="mb-4 text-3xl">⏱️</div>
       <h3 className="mb-3 font-sans text-xl font-semibold text-gray-900 dark:text-gray-100">
        Hourly Rate
       </h3>
       <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Flexible hourly billing for ongoing support, consultations, or
        variable-scope work.
       </p>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-slate-800">
       <div className="mb-4 text-3xl">🔧</div>
       <h3 className="mb-3 font-sans text-xl font-semibold text-gray-900 dark:text-gray-100">
        Maintenance Contract
       </h3>
       <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Ongoing support and maintenance packages. Terms to be discussed based on
        your needs.
       </p>
      </div>
     </div>
     <div className="rounded-xl bg-gradient-to-r from-brand to-cyan-500 p-8 text-center text-white shadow-lg">
      <div className="mb-4 text-4xl">💎</div>
      <h3 className="mb-3 font-sans text-2xl font-semibold">Skin in the Game</h3>
      <p className="mx-auto max-w-2xl text-lg leading-relaxed opacity-95">
       We can negotiate shares of your product/company to lower the price and
       strengthen our commitment. Perfect for startups looking to align
       incentives.
      </p>
     </div>
    </div>
   </div>

   {/* Why Choose Us Section */}
   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-4xl">
     <SectionHeading id="why-choose-us">Why Choose Us</SectionHeading>
     <div className="space-y-8">
      <div className="flex items-start">
       <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-xl font-bold text-white">
        🏆
       </div>
       <div>
        <h3 className="mb-2 font-sans text-2xl font-semibold text-gray-900 dark:text-gray-100">
         AWS Community Builder & Meetup Leader
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
         As an AWS Community Builder and AWS Meetup leader, I have direct access
         to the latest AWS innovations and a network of experts. This makes it
         easier to find well-paying clients and deliver cutting-edge solutions.
        </p>
       </div>
      </div>
      <div className="flex items-start">
       <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-xl font-bold text-white">
        👥
       </div>
       <div>
        <h3 className="mb-2 font-sans text-2xl font-semibold text-gray-900 dark:text-gray-100">
         Strong Customer Base
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
         My personal brand as an AWS/AI/MVP expert works well, and I have a very
         good customer base. We leverage referrals, testimonials, and
         newsletters to expand our reach and deliver exceptional results.
        </p>
       </div>
      </div>
      <div className="flex items-start">
       <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-xl font-bold text-white">
        🎯
       </div>
       <div>
        <h3 className="mb-2 font-sans text-2xl font-semibold text-gray-900 dark:text-gray-100">
         Customer-Centric Approach
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
         We prioritize your success. Every engagement is tailored to your
         specific needs, with transparent communication and a focus on
         delivering measurable value.
        </p>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Join the Team Section */}
   <div className="bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-16 dark:from-slate-800 dark:to-slate-900">
    <div className="mx-auto max-w-6xl">
     <SectionHeading id="join-the-team">Join the Team</SectionHeading>
     <div className="grid gap-12 md:grid-cols-2">
      {/* Requirements */}
      <div className="rounded-xl bg-white p-8 shadow-md dark:bg-slate-800">
       <h3 className="mb-6 flex items-center font-sans text-2xl font-semibold text-gray-900 dark:text-gray-100">
        <span className="mr-3">📋</span>
        Requirements
       </h3>
       <ul className="m-0 list-none space-y-4 p-0">
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          Comfortable programming in <strong>TypeScript</strong> and{" "}
          <strong>Python</strong> (best MVP/Greenfield languages)
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          Self-organized and proactive
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          Comfortable leveraging new technologies like <strong>AI</strong> to
          improve productivity
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          Flexible working hours
         </span>
        </li>
       </ul>
      </div>

      {/* Perks */}
      <div className="rounded-xl bg-white p-8 shadow-md dark:bg-slate-800">
       <h3 className="mb-6 flex items-center font-sans text-2xl font-semibold text-gray-900 dark:text-gray-100">
        <span className="mr-3">🎁</span>
        Perks
       </h3>
       <ul className="m-0 list-none space-y-4 p-0">
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">💵</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>Direct revenue sharing</strong> - No annoying time tracking,
          more intensive productive work
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">🔍</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>Full transparency</strong> (as far as customers allow)
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">🌍</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>Remote/Agile/Async</strong> setup with minimal meetings
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">📚</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>Great learnings</strong> as partial compensation
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">🏖️</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>Offsites</strong> for team building and strengthening
         </span>
        </li>
       </ul>
      </div>
     </div>
     <div className="mt-12 text-center">
      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
       Please give me your feedback on my project and contact me for potential
       collaborations :)
      </p>
     </div>
    </div>
   </div>

   {/* Final CTA Section */}
   <div className="bg-gradient-to-r from-brand to-cyan-500 px-4 py-16">
    <div className="mx-auto max-w-4xl text-center">
     <SectionHeading id="get-started" className="mb-6 text-white">
      Ready to Get Started?
     </SectionHeading>
     <p className="mb-8 text-xl text-white opacity-95">
      Let's discuss how we can help transform your cloud infrastructure and
      accelerate your business.
     </p>
     <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a
       href="mailto:office+agency@martinmueller.dev"
       target="_blank"
       rel="noopener noreferrer"
       className="inline-flex transform items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-brand shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-xl"
      >
       📝 Let's write
      </a>
      <a
       href="https://calendly.com/martinmueller_dev/30min"
       target="_blank"
       rel="noopener noreferrer"
       className="inline-flex transform items-center justify-center rounded-lg bg-white px-8 py-4 font-semibold text-brand shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-xl"
      >
       🗣️ Let's speak
      </a>
     </div>
    </div>
   </div>
  </Layout>
 )
}

export default AgencyPage
