const Doodoo = require("doodoo.js");

// 兼容1.x配置文件
require("doodoo-plugin-dotenv");

const app = new Doodoo();
app.plugin("static");
app.plugin("nuxt");
app.start();
