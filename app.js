const Doodoo = require("doodoo.js");

// 兼容1.x配置文件
require("doodoo-plugin-dotenv");

const app = new Doodoo();

if (app.env === "development") {
    app.plugin("chokidar");
}
app.plugin("static");
app.plugin("web");

app.start();
