import React from "react"
import Layout from "../components/layout"
import MetaTags from "../components/Metatags"

const AgencyPage = ({ location }) => {
  return (
    <Layout>
      <MetaTags
        title="Agency - AWS Expertise for Your Business"
        description="Empower your business or startup with AWS expertise. Unlock the full potential of the cloud with seamless migrations, optimized performance, and cost-effective solutions."
        url="https://martinmueller.dev"
        pathname={location.pathname}
      />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Agency 🤝
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Empower your business or startup with our AWS expertise. Unlock the full potential of the cloud with seamless migrations, optimized performance, and cost-effective solutions. Let's innovate together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:office+agency@martinmueller.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#06aced] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-[#0599d4] transition-all duration-200 transform hover:-translate-y-0.5"
            >
              📝 Let's write
            </a>
            <a
              href="https://calendly.com/martinmueller_dev/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#06aced] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-[#0599d4] transition-all duration-200 transform hover:-translate-y-0.5"
            >
              🗣️ Let's speak
            </a>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Adrian Logan Testimonial */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <a
                  href="https://www.linkedin.com/in/adrian-logan-a52027b5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-4"
                >
                  <img
                    src="https://raw.githubusercontent.com/mmuller88/mmblog/master/content/resume/testimonialAdrian.png"
                    alt="Adrian Logan"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#06aced]"
                  />
                </a>
              </div>
              <p className="text-gray-700 leading-relaxed">
                I cannot recommend Martin Muller highly enough for his exceptional work in setting up our web application backend using the AWS CDK. Martin's expertise and efficiency have been instrumental in meeting project deadlines and ensuring a smooth deployment. The quality of his work is consistently top-notch, which gives me the utmost confidence in the final product. Additionally, Martin's ability to work quickly without sacrificing attention to detail has been invaluable to our team. His dedication and professionalism have made it a pleasure to collaborate with him, and I am confident that anyone who works with Martin will be similarly impressed by his talents.
              </p>
            </div>

            {/* Eric Amberg Testimonial */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <a
                  href="https://www.linkedin.com/in/ericamberg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-4"
                >
                  <img
                    src="https://raw.githubusercontent.com/mmuller88/mmblog/master/content/resume/testimonialEric.png"
                    alt="Eric Amberg"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#06aced]"
                  />
                </a>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Eric Amberg</h3>
                  <a
                    href="https://www.linkedin.com/in/ericamberg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#06aced] hover:underline text-sm"
                  >
                    View LinkedIn →
                  </a>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Martin built the sophisticated AWS infrastructure for our online lab environments. Working with him was characterized by very good communication and a very fast implementation of the tasks set. Martin works very professionally and has great experience with AWS environments. He is able to quickly grasp the requirements and promptly develop solution approaches. His concepts are scalable and comply with best practices in cloud environments. Thanks to his support, we got a stable cloud environment for our HackLabs in a very short time, which we still use today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Packages Section */}
      <div className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Value Packages
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Flexible engagement models tailored to your needs
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Project with Milestones
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Pay a deposit upfront, then after reaching each milestone. Perfect for structured, long-term projects.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Project-based
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Pay a deposit upfront, then the remainder upon project completion. Ideal for well-defined scopes.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Hourly Rate
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Flexible hourly billing for ongoing support, consultations, or variable-scope work.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Maintenance Contract
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ongoing support and maintenance packages. Terms to be discussed based on your needs.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#06aced] to-cyan-500 rounded-xl p-8 text-white text-center shadow-lg">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-2xl font-semibold mb-3">Skin in the Game</h3>
            <p className="text-lg opacity-95 leading-relaxed max-w-2xl mx-auto">
              We can negotiate shares of your product/company to lower the price and strengthen our commitment. Perfect for startups looking to align incentives.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#06aced] rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                🏆
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  AWS Community Builder & Meetup Leader
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  As an AWS Community Builder and AWS Meetup leader, I have direct access to the latest AWS innovations and a network of experts. This makes it easier to find well-paying clients and deliver cutting-edge solutions.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#06aced] rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                👥
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Strong Customer Base
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  My personal brand as an AWS/AI/MVP expert works well, and I have a very good customer base. We leverage referrals, testimonials, and newsletters to expand our reach and deliver exceptional results.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#06aced] rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                🎯
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Customer-Centric Approach
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We prioritize your success. Every engagement is tailored to your specific needs, with transparent communication and a focus on delivering measurable value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join the Team Section */}
      <div className="py-16 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Join the Team
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Requirements */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">📋</span>
                Requirements
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#06aced] mr-3 font-bold">✓</span>
                  <span className="text-gray-700">Comfortable programming in <strong>TypeScript</strong> and <strong>Python</strong> (best MVP/Greenfield languages)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#06aced] mr-3 font-bold">✓</span>
                  <span className="text-gray-700">Self-organized and proactive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#06aced] mr-3 font-bold">✓</span>
                  <span className="text-gray-700">Comfortable leveraging new technologies like <strong>AI</strong> to improve productivity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#06aced] mr-3 font-bold">✓</span>
                  <span className="text-gray-700">Flexible working hours</span>
                </li>
              </ul>
            </div>

            {/* Perks */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">🎁</span>
                Perks
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#06aced] mr-3 font-bold">💵</span>
                  <span className="text-gray-700"><strong>Direct revenue sharing</strong> - No annoying time tracking, more intensive productive work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#06aced] mr-3 font-bold">🔍</span>
                  <span className="text-gray-700"><strong>Full transparency</strong> (as far as customers allow)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#06aced] mr-3 font-bold">🌍</span>
                  <span className="text-gray-700"><strong>Remote/Agile/Async</strong> setup with minimal meetings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#06aced] mr-3 font-bold">📚</span>
                  <span className="text-gray-700"><strong>Great learnings</strong> as partial compensation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#06aced] mr-3 font-bold">🏖️</span>
                  <span className="text-gray-700"><strong>Offsites</strong> for team building and strengthening</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700 mb-6">
              Please give me your feedback on my project and contact me for potential collaborations :)
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-[#06aced] to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white opacity-95 mb-8">
            Let's discuss how we can help transform your cloud infrastructure and accelerate your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:office+agency@martinmueller.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#06aced] font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              📝 Let's write
            </a>
            <a
              href="https://calendly.com/martinmueller_dev/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#06aced] font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5"
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

