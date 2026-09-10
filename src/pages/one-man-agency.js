import React, { useEffect } from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import MetaTags from "../components/Metatags"
import TableOfContents from "../components/TableOfContents"
import SectionHeading from "../components/SectionHeading"
import "../styles/heading-anchors.css"
import testimonialJakob from "../../content/resume/testimonialJakob.png"
import testimonialAdrian from "../../content/resume/testimonialAdrian.png"
import testimonialEric from "../../content/resume/testimonialEric.png"
import openclawHero from "../../content/openclaw-three-months-later/index.png"

const sections = [
 { id: "testimonials", value: "What Clients Say", depth: 2 },
 { id: "value-packages", value: "Value Packages", depth: 2 },
 { id: "statement-of-work", value: "Statement of Work First", depth: 2 },
 { id: "why-one-expert", value: "Why One Expert Beats a Big Team", depth: 2 },
 { id: "ai-agents", value: "How AI Agents Scale Delivery", depth: 2 },
 { id: "get-started", value: "Ready to Get Started?", depth: 2 },
]

const OneManAgencyPage = ({ location }) => {
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
    title="One-Man Agency — AWS & AI, Without Agency Overhead"
    description="Agency-grade cloud & MVP work from one senior expert + AI agents — lower cost, no account-manager layers, faster delivery."
    url="https://martinmueller.dev"
    pathname={location.pathname}
   />

   {/* Hero Section */}
   <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
    <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
     <div className="text-center md:text-left">
      <h1 className="mb-6 font-sans text-5xl font-bold text-gray-900 dark:text-gray-100 md:text-6xl">
       One-Man Agency
      </h1>
      <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300 md:text-2xl">
       Agency-quality AWS, cloud, and MVP delivery — without paying for bench
       time, account managers, or markup. One senior expert, amplified by AI
       agents (OpenClaw, Cursor, MCP integrations) that multiply throughput to
       match multi-person shops at a fraction of the cost.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
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
     <div className="overflow-hidden rounded-xl shadow-lg">
      <img
       src={openclawHero}
       alt="OpenClaw AI agent orchestrating blog posts, code, invoices, and SEO work"
       className="mb-0 w-full object-cover"
      />
     </div>
    </div>
   </div>

   <div className="mx-auto max-w-6xl px-4">
    <TableOfContents headings={sections} />
   </div>

   {/* Testimonials Section */}
   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-6xl">
     <SectionHeading id="testimonials">What Clients Say</SectionHeading>
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
      Flexible engagement models tailored to your needs — no agency markup, just
      direct senior expertise.
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
       I can negotiate shares of your product/company to lower the price and
       strengthen my commitment. Perfect for startups looking to align
       incentives.
      </p>
     </div>
    </div>
   </div>

   {/* Statement of Work Section */}
   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-4xl">
     <SectionHeading id="statement-of-work">
      Statement of Work First
     </SectionHeading>
     <p className="mb-10 text-center leading-relaxed text-gray-700 dark:text-gray-300">
      Before any code gets written, you get a written{" "}
      <strong>Statement of Work (SoW)</strong> — the same clarity big agencies
      promise, without the overhead. Fixed scope, fixed price, no surprises.
     </p>
     <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl bg-gray-50 p-6 text-center dark:bg-slate-800">
       <div className="mb-3 text-2xl font-bold text-brand">1</div>
       <h3 className="mb-2 font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">
        Short Call
       </h3>
       <p className="mb-0 text-sm text-gray-600 dark:text-gray-400">
        Goals, constraints, timeline — 30 minutes is enough to start.
       </p>
      </div>
      <div className="rounded-xl bg-gray-50 p-6 text-center dark:bg-slate-800">
       <div className="mb-3 text-2xl font-bold text-brand">2</div>
       <h3 className="mb-2 font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">
        SoW Draft
       </h3>
       <p className="mb-0 text-sm text-gray-600 dark:text-gray-400">
        Workstreams, deliverables, milestones, and a fixed price — in writing.
       </p>
      </div>
      <div className="rounded-xl bg-gray-50 p-6 text-center dark:bg-slate-800">
       <div className="mb-3 text-2xl font-bold text-brand">3</div>
       <h3 className="mb-2 font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">
        You Review
       </h3>
       <p className="mb-0 text-sm text-gray-600 dark:text-gray-400">
        Scope, out-of-scope, and payment terms — adjust before anything starts.
       </p>
      </div>
      <div className="rounded-xl bg-gray-50 p-6 text-center dark:bg-slate-800">
       <div className="mb-3 text-2xl font-bold text-brand">4</div>
       <h3 className="mb-2 font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">
        Sign Off & Go
       </h3>
       <p className="mb-0 text-sm text-gray-600 dark:text-gray-400">
        Acceptance criteria agreed — then work begins.
       </p>
      </div>
     </div>
     <div className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-8 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 font-sans text-xl font-semibold text-gray-900 dark:text-gray-100">
       What's in every SoW
      </h3>
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
       <li className="mb-0 flex items-start">
        <span className="mr-3 font-bold text-brand">✓</span>
        <span className="text-gray-700 dark:text-gray-300">
         Clear goals and workstreams
        </span>
       </li>
       <li className="mb-0 flex items-start">
        <span className="mr-3 font-bold text-brand">✓</span>
        <span className="text-gray-700 dark:text-gray-300">
         Concrete deliverables
        </span>
       </li>
       <li className="mb-0 flex items-start">
        <span className="mr-3 font-bold text-brand">✓</span>
        <span className="text-gray-700 dark:text-gray-300">
         Explicit out-of-scope
        </span>
       </li>
       <li className="mb-0 flex items-start">
        <span className="mr-3 font-bold text-brand">✓</span>
        <span className="text-gray-700 dark:text-gray-300">
         Fixed price + payment milestones
        </span>
       </li>
       <li className="mb-0 flex items-start">
        <span className="mr-3 font-bold text-brand">✓</span>
        <span className="text-gray-700 dark:text-gray-300">
         Acceptance criteria
        </span>
       </li>
       <li className="mb-0 flex items-start">
        <span className="mr-3 font-bold text-brand">✓</span>
        <span className="text-gray-700 dark:text-gray-300">
         Security, cloud, SEO/GEO audits & more
        </span>
       </li>
      </ul>
     </div>
     <div className="text-center">
      <p className="mb-4 text-gray-700 dark:text-gray-300">
       See what a real SoW looks like — redacted client examples:
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
       <a
        href="/one-man-agency/sow-seo-geo-redacted-example.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-lg border-2 border-brand px-6 py-3 font-semibold text-brand no-underline transition-colors hover:bg-brand hover:text-white dark:hover:text-white"
       >
        📄 SEO/GEO Strategy SoW
       </a>
       <a
        href="/one-man-agency/sow-security-audit-template-redacted.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-lg border-2 border-brand px-6 py-3 font-semibold text-brand no-underline transition-colors hover:bg-brand hover:text-white dark:hover:text-white"
       >
        📄 Security Audit SoW Template
       </a>
      </div>
     </div>
    </div>
   </div>

   {/* Why One Expert Section */}
   <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-16 dark:from-slate-800 dark:to-slate-900">
    <div className="mx-auto max-w-4xl">
     <SectionHeading id="why-one-expert">
      Why One Expert Beats a Big Team
     </SectionHeading>
     <div className="space-y-8">
      <div className="flex items-start">
       <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-xl font-bold text-white">
        🎯
       </div>
       <div>
        <h3 className="mb-2 font-sans text-2xl font-semibold text-gray-900 dark:text-gray-100">
         Direct Senior Access
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
         You work directly with me — an AWS Community Builder and Meetup leader —
         not a junior dev or account manager. No handoffs, no information lost in
         translation. Every decision comes from someone who has shipped production
         cloud infrastructure for years.
        </p>
       </div>
      </div>
      <div className="flex items-start">
       <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-xl font-bold text-white">
        💰
       </div>
       <div>
        <h3 className="mb-2 font-sans text-2xl font-semibold text-gray-900 dark:text-gray-100">
         Lower Cost, No Overhead Stack
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
         Traditional agencies charge for PMs, sales teams, office space, and bench
         time. As a one-man operation, you pay for delivered value — not a
         corporate overhead that inflates every invoice.
        </p>
       </div>
      </div>
      <div className="flex items-start">
       <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-xl font-bold text-white">
        ⚡
       </div>
       <div>
        <h3 className="mb-2 font-sans text-2xl font-semibold text-gray-900 dark:text-gray-100">
         AI-Augmented Speed
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
         AI agents handle the repetitive work — research, drafting, code planning,
         compliance reports — so I focus on architecture, decisions, and quality.
         Same deliverables a bigger team would produce, with faster iteration
         cycles.
        </p>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* AI Agents Section */}
   <div className="bg-white px-4 py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-6xl">
     <SectionHeading id="ai-agents">
      How AI Agents Scale Delivery
     </SectionHeading>
     <div className="mx-auto max-w-3xl">
       <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
        My self-hosted AI agent OpenClaw runs alongside Cursor and MCP
        integrations — turning one person into a small ops team. Real workflows
        from the last three months:
       </p>
       <ul className="m-0 list-none space-y-4 p-0">
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>Blog posts</strong> — voice note in, researched draft out,
          published on my site
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>GitHub issues → plans → PRs</strong> — agent writes the plan,
          I approve, code lands in the repo
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>Invoices</strong> — bilingual PDFs for US and German clients,
          email draft ready to send
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>SEO & compliance</strong> — live data pulls and reports without
          clicking through five tools
         </span>
        </li>
        <li className="mb-0 flex items-start">
         <span className="mr-3 font-bold text-brand">✓</span>
         <span className="text-gray-700 dark:text-gray-300">
          <strong>Conference proposals</strong> — talk drafts from memory, not
          from a blank page
         </span>
        </li>
       </ul>
       <p className="mt-6">
        <Link
         to="/openclaw-three-months-later/"
         className="font-semibold text-brand no-underline hover:text-brand-dark hover:underline"
        >
         Read how it works →
        </Link>
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
      One point of contact, agency-quality scope. Tell me your goals — I'll send
      a Statement of Work with fixed price and clear deliverables.
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

export default OneManAgencyPage
