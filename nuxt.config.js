const glob = require("glob");
const path = require("path");
const { Utils } = require("nuxt");
const fs = require("fs");
const _url = require("url");
const dotenv = require("dotenv");
const apiConfig = dotenv.parse(fs.readFileSync(".env"));
const webConfig = Object.assign(dotenv.parse(fs.readFileSync(".env.web")), {
    APP_HOST: apiConfig.APP_HOST,
    APP_PREFIX: apiConfig.APP_PREFIX,
    DOMAIN: _url.parse(apiConfig.APP_HOST).host,
    API_DOMAIN: apiConfig.APP_HOST + apiConfig.APP_PREFIX
});
const appDir = "app";

function createRoutes(srcDir) {
    const views = glob.sync("*/view/**/*.vue", {
        cwd: appDir
    });

    const routes = [];
    for (const key in views) {
        const file = path.resolve(appDir, views[key]);
        routes.push({
            name: views[key],
            path:
                "/" +
                views[key]
                    .replace(/\\/g, "/")
                    .replace(/\/view/, "")
                    .replace(/_/g, ":")
                    .replace(/.vue$/, "")
                    .replace(/.index$/, ""),
            component: file,
            chunkName: "pages/app/" + views[key]
        });
    }
    return routes;
}

function createLayouts() {
    const layouts = glob.sync("*/layout/**/*.vue", { cwd: appDir });
    const _layouts = {};
    for (const key in layouts) {
        _layouts[
            path
                .basename(layouts[key])
                .replace(/\\/g, "/")
                .replace(/.vue$/, "")
        ] = Utils.relativeTo(
            path.resolve(".nuxt"),
            path.resolve(appDir, layouts[key])
        );
    }

    return _layouts;
}

module.exports = {
    env: webConfig,

    srcDir: "web",

    layouts: createLayouts(),

    head: {
        title: webConfig.HEAD_TITLE,
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            {
                hid: "description",
                name: "description",
                content: webConfig.HEAD_META_DESCRIPTION
            },
            {
                hid: "keywords",
                name: "keywords",
                content: webConfig.HEAD_META_KEYWORDS
            }
        ],
        script: [
            {
                src:
                    "https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.23.0/polyfill.min.js"
            }
        ],
        link: [
            { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
            {
                rel: "stylesheet",
                type: "text/css",
                href:
                    "https://unpkg.com/element-ui@2.4.8/lib/theme-chalk/index.css"
            }
        ]
    },
    /*
    ** Customize the progress bar color
    */
    loading: { color: "#3B8070" },
    /*
    ** Build configuration
    */
    build: {
        createRoutes: srcDir => {
            return createRoutes(srcDir);
        },

        /*
        ** Run ESLint on save
        */
        extend(config, { isDev, isClient }) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: "pre",
                    test: /\.(js|vue)$/,
                    loader: "eslint-loader",
                    exclude: /(node_modules)/
                });
            }
            config.devtool = "#source-map";
        },

        vendor: ["axios", "element-ui"]
    },

    modules: ["@nuxtjs/axios"],

    axios: {
        proxy: true, // Can be also an object with default options
        debug: false,
        baseURL: `http://127.0.0.1:${apiConfig.APP_PORT}`
    },

    router: {
        middleware: ["router"]
    },

    proxy: {
        "/api": {
            target: `http://127.0.0.1:${apiConfig.APP_PORT}`
        }
    },

    css: [],

    plugins: [
        { src: "./web/plugins/element.js", ssr: true },
        { src: "./web/plugins/axios.js", ssr: true }
    ]
};
