(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{368:function(s,t,a){"use strict";a.r(t);var n=a(44),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"nodes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#nodes"}},[s._v("#")]),s._v(" Nodes")]),s._v(" "),a("p",[s._v("Nodes are the individual processes at the core of network that allow for players to compete and enjoy Rook. This section will provide a guide to setting up your own node and how you can even play the game locally.")]),s._v(" "),a("h2",{attrs:{id:"server-configuration"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#server-configuration"}},[s._v("#")]),s._v(" Server Configuration")]),s._v(" "),a("p",[s._v("If you are running of a fresh linux server, we will need to set up the environment first. Create a new user")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("adduser "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("username"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("usermod")]),s._v(" -aG "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("username"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("su")]),s._v(" - "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("username"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])])]),a("p",[s._v("Update the system and install dependencies")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Update the system")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt")]),s._v(" update\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt")]),s._v(" upgrade\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Install dependencies")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" build-essential ufw "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" snapd --yes\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" snap "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" go --classic\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Export environment variables")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'export GOPATH=\""),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("$HOME")]),s._v("/go\"'")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" ~/.profile\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'export GOBIN=\""),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$GOPATH")]),s._v("/bin\"'")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" ~/.profile\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'export PATH=\""),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$GOBIN")]),s._v(":"),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("$PATH")]),s._v("\"'")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" ~/.profile\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("source")]),s._v(" ~/.profile\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Check go is correctly configured")]),s._v("\ngo version\n")])])]),a("h2",{attrs:{id:"installing-and-initializing-rook"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#installing-and-initializing-rook"}},[s._v("#")]),s._v(" Installing and Initializing Rook")]),s._v(" "),a("p",[s._v("Clone the respository and build the binary")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" clone https://github.com/cmwaters/rook\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" rook\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout v0.1.0  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# make sure you have the correct version")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("make")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# check rook has been installed")]),s._v("\nrook version\n")])])]),a("p",[s._v("Initialise your node")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# check that you are using the right chain id. This will change over different testnets/mainnets")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# If you want to run on your own chain then you can use ")]),s._v("\nrook init --chain-id rook-1 "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("your_moniker"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])])]),a("p",[s._v("Start the node")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("rook start\n")])])]),a("p",[a("em",[s._v("More details to follow")])])])}),[],!1,null,null,null);t.default=e.exports}}]);