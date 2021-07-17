const { description } = require("../../package");

module.exports = {
  base: "/plural/",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: "Plural",
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
    logo: "/plural_logo.svg",
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
          "/getting-started/installation",
        ],
      },
      {
        collapsable: false,
        title: "How does it work",
        children: [
          "/spec/concepts",
          "/spec/messages",
          "/spec/state",
        ],
      },
      {
        collapsable: false,
        title: "How do I use it",
        children: [
          // "/usage/deploy",
          "/usage/policies",
          "/usage/use-cases",
          // "/usage/testnet"
        ],
      },
      
    ],

    nav: [
      // { text: "Rust", link: "https://docs.rs/anchor-lang/latest/anchor_lang/" },
      { text: "GitHub", link: "https://github.com/cmwaters/plural" }
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
