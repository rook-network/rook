const { description } = require("../../package");

module.exports = {
  base: "/rook/",
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
        title: "Introduction",
        children: [
          "/introduction/introduction",
          "/introduction/roadmap",
        ],
      },
      {
        collapsable: false,
        title: "Game Rules",
        children: [
          "/rules/overview",
          "/rules/building-blocks",
          "/rules/setting-up",
          "/rules/moves",
          "/rules/objective",
          "/rules/assets",
        ],
      },
      {
        collapsable: false,
        title: "Community",
        children: [
          "/community/contributing",
          // "/community/governance", TODO: add a section on governance
        ],
      },
      {
        collapsable: false,
        title: "Infrastructure",
        children: [
          "/infrastructure/nodes",
          "/infrastructure/mainnet",
          "/infrastructure/testnets",
          // "/infrastructure/validators", TODO: add the validator section
        ],
      },
      { 
        title: "Spec",
        collapsable: false,
        children: [
          "/spec/",
          { 
            title: "Game",
            children: [
              "/spec/game/01_concepts",
              "/spec/game/02_state",
              "/spec/game/03_server",
            ]
          },
          { 
            title: "Matchmaker",
            children: [
              "/spec/matchmaker/01_concepts",
              "/spec/matchmaker/02_state",
              "/spec/matchmaker/03_server",
            ]
          },
          { 
            title: "Claim",
            children: [
              "/spec/claim/01_concepts",
              "/spec/claim/02_state",
              "/spec/claim/03_server",
            ]
          }
        ]
      },
    ],

    nav: [
      { text: "Home", link: "https://rook.network" },
      { text: "GitHub", link: "https://github.com/arcane-systems/rook" }
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
