const { description } = require("../../package");

module.exports = {
  base: "/docs/",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: "Rook Docs",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: "",
    editLinks: false,
    logo: "/rook_logo.svg",
    docsDir: "",
    editLinkText: "",
    lastUpdated: true,
    sidebarDepth: 2,
    sidebar: [
       {
        collapsable: false,
        title: "What is it",
        children: [
          "/getting-started/introduction",
        ],
      },
      { 
        title: "Spec",
        collapsable: false,
        children: [
          "/spec/",
          { 
            title: "Claim",
            collapsable: false,
            children: [
              "/spec/claim/01_concepts",
              "/spec/claim/02_state",
              "/spec/claim/03_server",
            ]
          }
        ]
      }
     
      // {
      //   collapsable: false,
      //   title: "Modules",
      //   children: [
      //     "/spec/",

      //   ],
      // },
      // {
      //   collapsable: false,
      //   title: "How do I use it",
      //   children: [
      //     "/usage/items",
      //   ],
      // },
      
    ],

    nav: [
      { text: "Home", link: "https://rook.network" },
      { text: "GitHub", link: "https://github.com/cmwaters/rook" }
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "dehydrate",
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
  ],
};
