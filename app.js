const Doodoo = require("doodoo.js");

const app = new Doodoo();
app.plugin("static");
app.plugin("nuxt");
app.start();
