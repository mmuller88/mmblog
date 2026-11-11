import React from "react"
import SectionHeading from "./SectionHeading"
import {
  oneManAgencyClients,
  oneManAgencyTechStack,
} from "../data/oneManAgencyTrust"

const AWS_CERT_IMAGE =
  "/one-man-agency/aws-certified-solutions-architect-professional.png"
const AWS_LOGO = "/one-man-agency/aws-logo.svg"

const OneManAgencyTrust = ({ trust }) => {
  if (!trust) return null

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-16 dark:from-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="aws-credentials" className="mb-6">
          {trust.credentialsHeading}
        </SectionHeading>
        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-stretch justify-center gap-6 sm:flex-row sm:items-center">
          <a
            href={trust.sapHref}
            className="flex flex-1 flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <img
              src={AWS_CERT_IMAGE}
              alt={trust.sapAlt}
              className="mb-0 h-28 w-auto max-w-full object-contain"
            />
            <p className="mb-0 text-sm font-semibold text-gray-800 dark:text-gray-200">
              {trust.sapAlt}
            </p>
            <p className="mb-0 text-xs text-brand">{trust.verifyLabel}</p>
          </a>
          <a
            href={trust.partnerHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <img
              src={AWS_LOGO}
              alt="Amazon Web Services"
              className="mb-0 h-12 w-auto max-w-[200px] object-contain dark:invert"
            />
            <p className="mb-0 text-sm font-semibold text-gray-800 dark:text-gray-200">
              {trust.partnerLabel}
            </p>
            <p className="mb-0 text-xs text-gray-500 dark:text-gray-400">
              {trust.partnerSub}
            </p>
          </a>
        </div>

        <SectionHeading id="clients-stations" className="mb-4">
          {trust.clientsHeading}
        </SectionHeading>
        {trust.clientsIntro ? (
          <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600 dark:text-gray-400">
            {trust.clientsIntro}
          </p>
        ) : null}
        <ul className="m-0 mb-16 grid grid-cols-3 gap-x-3 gap-y-8 p-0 sm:grid-cols-5 lg:grid-cols-9">
          {oneManAgencyClients.map((client) => (
            <li
              key={client.label}
              className="flex list-none flex-col items-center gap-2 text-center"
            >
              <span className="flex h-12 w-full items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.alt}
                  className="mb-0 max-h-12 max-w-full object-contain"
                />
              </span>
              <p className="mb-0 font-mono text-[10px] leading-none text-gray-500 dark:text-gray-400">
                {client.label}
              </p>
            </li>
          ))}
        </ul>

        <SectionHeading id="tech-stack" className="mb-4">
          {trust.techHeading}
        </SectionHeading>
        {trust.techIntro ? (
          <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600 dark:text-gray-400">
            {trust.techIntro}
          </p>
        ) : null}
        <ul className="m-0 grid grid-cols-4 gap-x-2 gap-y-6 p-0 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9">
          {oneManAgencyTechStack.map((item) => (
            <li
              key={item.label}
              className="flex list-none flex-col items-center gap-1.5 text-center"
            >
              <img
                src={item.logo}
                alt={item.label}
                className="mb-0 size-9 object-contain dark:bg-white sm:size-10"
              />
              <span className="text-[11px] font-medium leading-none text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default OneManAgencyTrust
