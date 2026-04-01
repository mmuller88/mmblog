[![Netlify Status](https://api.netlify.com/api/v1/badges/0780d1cb-3c7c-430b-b772-d4e71f6066b7/deploy-status)](https://app.netlify.com/sites/jolly-murdock-2892cc/deploys)

## Blog audio (Google Cloud TTS)

Posts opt in with frontmatter `audio: "audio.mp3"`. CI runs `npm run generate-audio` before `gatsby build`; `audio.mp3` is gitignored and produced on the build machine.

### Create GCP project and enable TTS

1. Create project (use a **globally unique** project id, e.g. `mmblog` or `mmblog-audio`):

   ```bash
   gcloud projects create YOUR_PROJECT_ID --name=mmblog
   gcloud config set project YOUR_PROJECT_ID
   ```

2. Enable billing on the project (required for TTS; free tier still applies).

3. Enable the API:

   ```bash
   gcloud services enable texttospeech.googleapis.com
   ```

4. Create a service account and key (JSON) for CI, with a role that can call Cloud Text-to-Speech (e.g. use **Editor** on a small dedicated project, or a custom role limited to TTS if you prefer).

   ```bash
   gcloud iam service-accounts create mmblog-tts --display-name="mmblog TTS"
   gcloud iam service-accounts keys create key.json \
     --iam-account=mmblog-tts@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

### Netlify

Add env var **`GOOGLE_TTS_CREDENTIALS`**: base64-encoded contents of `key.json` (one line, no newlines).

```bash
base64 -i key.json | tr -d '\n'
```

Paste the output into Netlify (Site settings → Environment variables). Delete `key.json` locally after.

Build already runs `generate-audio` via `npm run build` ([netlify.toml](netlify.toml)).

### Local

- With credentials: set `GOOGLE_TTS_CREDENTIALS` or point `GOOGLE_APPLICATION_CREDENTIALS` at a JSON key file, then `npm run generate-audio` or `npm run generate-audio -- content/some-post --force`.
- Without credentials: `generate-audio` skips; `gatsby build` still works, but the player only appears after MP3s exist.

Voices: English `en-US-Neural2-D`, German `de-DE-Neural2-B` (when post tags include `de`).

<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<p align="center">
  <a href="https://www.gatsbyjs.org">
    <img alt="Gatsby" src="https://www.gatsbyjs.org/monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Gatsby's default starter
</h1>

Kick off your project with this default boilerplate. This starter ships with the main Gatsby configuration files you might need to get up and running blazing fast with the blazing fast app generator for React.

_Have another more specific idea? You may want to check out our vibrant collection of [official and community-created starters](https://www.gatsbyjs.org/docs/gatsby-starters/)._

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the default starter.

    ```sh
    # create a new Gatsby site using the default starter
    gatsby new my-default-starter https://github.com/gatsbyjs/gatsby-starter-default
    ```

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```sh
    cd my-default-starter/
    gatsby develop
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

    Open the `my-default-starter` directory in your code editor of choice and edit `src/pages/index.js`. Save your changes and the browser will update in real time!

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

9.  **`LICENSE`**: Gatsby is licensed under the MIT license.

10. **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

11. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

12. **`README.md`**: A text file containing useful reference information about your project.

## 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.org/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.org/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.org/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.

## 💫 Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gatsbyjs/gatsby-starter-default)

<!-- AUTO-GENERATED-CONTENT:END -->
