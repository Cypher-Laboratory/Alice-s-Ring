// docusaurus.config.js
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Ring Signatures',
  tagline: 'a Snap for MetaMask',
  favicon: 'img/favicon.ico',

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'Cypher Lab',
  projectName: 'Ring Signature Snap - Documentation',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          remarkPlugins: [require('remark-math')],
          rehypePlugins: [require('rehype-katex')],
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
    },
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Ring Signature Snap',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        { href: 'https://www.cypherlab.org/blog/articles', label: 'Blog', position: 'right' },
        {
          href: 'https://github.com/Cypher-Laboratory/Alice-s-Ring-snap',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/docs/Overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            // {
            //   label: 'Stack Overflow',
            //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            // },
            {
              label: 'Discord',
              href: 'https://discord.gg/mxxTVkWDuz',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/cypher_lab',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              href: 'https://www.cypherlab.org/blog/articles',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Cypher-Laboratory',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Cypher Lab.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-4NfIsT6cQ0pc0+RaWTlK0m0Q4uGhPzoJPnNA8CUzEMXslRoNlnHgseB8ojq2X83l',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;
