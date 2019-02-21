import Vue from 'vue'

const noopData = () => ({})

// window.{{globals.loadedCallback}} hook
// Useful for jsdom testing or plugins (https://github.com/tmpvar/jsdom#dealing-with-asynchronous-script-loading)
if (process.client) {
  window.onNuxtReadyCbs = []
  window.onNuxtReady = (cb) => {
    window.onNuxtReadyCbs.push(cb)
  }
}

export function empty() {}

export function globalHandleError(error) {
  if (Vue.config.errorHandler) {
    Vue.config.errorHandler(error)
  }
}

export function interopDefault(promise) {
  return promise.then(m => m.default || m)
}

export function applyAsyncData(Component, asyncData) {
  const ComponentData = Component.options.data || noopData
  // Prevent calling this method for each request on SSR context
  if (!asyncData && Component.options.hasAsyncData) {
    return
  }
  Component.options.hasAsyncData = true
  Component.options.data = function () {
    const data = ComponentData.call(this)
    if (this.$ssrContext) {
      asyncData = this.$ssrContext.asyncData[Component.cid]
    }
    return { ...data, ...asyncData }
  }
  if (Component._Ctor && Component._Ctor.options) {
    Component._Ctor.options.data = Component.options.data
  }
}

export function sanitizeComponent(Component) {
  // If Component already sanitized
  if (Component.options && Component._Ctor === Component) {
    return Component
  }
  if (!Component.options) {
    Component = Vue.extend(Component) // fix issue #6
    Component._Ctor = Component
  } else {
    Component._Ctor = Component
    Component.extendOptions = Component.options
  }
  // For debugging purpose
  if (!Component.options.name && Component.options.__file) {
    Component.options.name = Component.options.__file
  }
  return Component
}

export function getMatchedComponents(route, matches = false) {
  return Array.prototype.concat.apply([], route.matched.map((m, index) => {
    return Object.keys(m.components).map((key) => {
      matches && matches.push(index)
      return m.components[key]
    })
  }))
}

export function getMatchedComponentsInstances(route, matches = false) {
  return Array.prototype.concat.apply([], route.matched.map((m, index) => {
    return Object.keys(m.instances).map((key) => {
      matches && matches.push(index)
      return m.instances[key]
    })
  }))
}

export function flatMapComponents(route, fn) {
  return Array.prototype.concat.apply([], route.matched.map((m, index) => {
    return Object.keys(m.components).reduce((promises, key) => {
      if (m.components[key]) {
        promises.push(fn(m.components[key], m.instances[key], m, key, index))
      } else {
        delete m.components[key]
      }
      return promises
    }, [])
  }))
}

export function resolveRouteComponents(route) {
  return Promise.all(
    flatMapComponents(route, async (Component, _, match, key) => {
      // If component is a function, resolve it
      if (typeof Component === 'function' && !Component.options) {
        Component = await Component()
      }
      match.components[key] = sanitizeComponent(Component)
      return match.components[key]
    })
  )
}

export async function getRouteData(route) {
  // Make sure the components are resolved (code-splitting)
  await resolveRouteComponents(route)
  // Send back a copy of route with meta based on Component definition
  return {
    ...route,
    meta: getMatchedComponents(route).map((Component, index) => {
      return { ...Component.options.meta, ...(route.matched[index] || {}).meta }
    })
  }
}

export async function setContext(app, context) {
  // If context not defined, create it
  if (!app.context) {
    app.context = {
      isStatic: process.static,
      isDev: true,
      isHMR: false,
      app,

      payload: context.payload,
      error: context.error,
      base: '/',
      env: {"HEAD_TITLE":"多多客小程序_微信小程序_微信小程序开发_微信小程序工具_微信小程序制作平台","HEAD_META_DESCRIPTION":"多多客是国内领先的微信小程序开发平台，制作过程无需代码，可视化拖拽组件即可，提供海量小程序行业模板，联合服务商、开发者、运营专家，共建服务生态，服务百万商家。","HEAD_META_KEYWORDS":"多多客,多多客小程序，微信小程序，小程序，微信小程序开发，微信小程序平台，小程序开发，小程序制作，小程序api，小程序开发工具，小程序开发平台，微信小程序开发工具，微信小程序制作","APP_HOST":"https://www.xxx.com","APP_PREFIX":"/api","DOMAIN":"www.xxx.com","API_DOMAIN":"https://www.xxx.com/api","npm_config_save_dev":"","npm_config_legacy_bundling":"","npm_config_dry_run":"","npm_config_viewer":"man","npm_config_only":"","npm_config_commit_hooks":"true","npm_config_browser":"","npm_package_gitHead":"0056b4e0bfa8237ed305889c29f30df6a1a76d90","npm_package_scripts_api_docker":"cross-env NODE_ENV=docker node app.js","npm_config_also":"","npm_config_sign_git_commit":"","npm_config_rollback":"true","TERM_PROGRAM":"iTerm.app","NODE":"/usr/local/bin/node","npm_config_usage":"","npm_config_audit":"true","INIT_CWD":"/Users/qingful/git/doodoo-nuxt-demo","npm_config_globalignorefile":"/usr/local/etc/npmignore","SHELL":"/bin/bash","TERM":"xterm-256color","npm_config_shell":"/bin/bash","npm_config_maxsockets":"50","npm_config_init_author_url":"","npm_config_shrinkwrap":"true","npm_config_parseable":"","npm_config_metrics_registry":"https://registry.npmjs.org/","TMPDIR":"/var/folders/p4/j0r8x2p14vl26907sgcbh2mc0000gn/T/","npm_config_timing":"","npm_config_init_license":"ISC","Apple_PubSub_Socket_Render":"/private/tmp/com.apple.launchd.zPhkZjy8si/Render","npm_config_if_present":"","TERM_PROGRAM_VERSION":"3.2.7","npm_package_scripts_dev":"cross-env NODE_ENV=development NUXT_BUILD=true node app.js","npm_config_sign_git_tag":"","npm_config_init_author_email":"","npm_config_cache_max":"Infinity","npm_config_preid":"","npm_config_long":"","npm_config_local_address":"","npm_config_git_tag_version":"true","npm_config_cert":"","npm_package_dependencies_doodoo_js":"^2.0.1-alpha.1","TERM_SESSION_ID":"w0t0p0:2EC7CEB4-DEAB-42E9-8AFC-AB9C5178B25A","npm_config_registry":"https://registry.npmjs.org/","npm_config_noproxy":"","npm_config_fetch_retries":"2","npm_config_versions":"","npm_config_message":"%s","npm_config_key":"","npm_package_readmeFilename":"README.md","npm_package_description":"### 启动 `npm run dev`","USER":"qingful","npm_package_license":"ISC","npm_package_scripts_web_generate":"nuxt generate","npm_package_devDependencies_eslint_loader":"^2.1.1","npm_config_globalconfig":"/usr/local/etc/npmrc","npm_config_prefer_online":"","npm_config_logs_max":"10","npm_config_always_auth":"","npm_package_scripts_api_dev":"cross-env NODE_ENV=development node app.js","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.rwiTdh4b0f/Listeners","npm_package_devDependencies_eslint":"^5.7.0","__CF_USER_TEXT_ENCODING":"0x1F5:0x19:0x34","npm_execpath":"/usr/local/lib/node_modules/npm/bin/npm-cli.js","npm_config_global_style":"","npm_config_cache_lock_retries":"10","npm_config_update_notifier":"true","npm_config_cafile":"","npm_config_heading":"npm","npm_config_audit_level":"low","npm_config_searchlimit":"20","npm_config_read_only":"","npm_config_offline":"","npm_config_fetch_retry_mintimeout":"10000","npm_config_json":"","npm_config_access":"","npm_config_argv":"{\"remain\":[],\"cooked\":[\"run\",\"dev\"],\"original\":[\"run\",\"dev\"]}","PATH":"/usr/local/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/qingful/git/doodoo-nuxt-demo/node_modules/.bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin","npm_config_allow_same_version":"","npm_config_https_proxy":"","npm_config_engine_strict":"","npm_config_description":"true","_":"/Users/qingful/git/doodoo-nuxt-demo/node_modules/.bin/cross-env","npm_config_userconfig":"/Users/qingful/.npmrc","npm_config_init_module":"/Users/qingful/.npm-init.js","npm_package_author":"","npm_package_scripts_web_dev":"nuxt","npm_config_cidr":"","PWD":"/Users/qingful/git/doodoo-nuxt-demo","npm_config_user":"","npm_config_node_version":"10.15.1","npm_lifecycle_event":"dev","npm_config_save":"true","npm_config_ignore_prepublish":"","npm_config_editor":"vi","npm_config_auth_type":"legacy","npm_package_name":"doodoo-demo","LANG":"zh_CN.UTF-8","npm_config_tag":"latest","npm_config_script_shell":"","ITERM_PROFILE":"Default","npm_config_progress":"true","npm_config_global":"","npm_config_searchstaleness":"900","npm_config_optional":"true","npm_config_ham_it_up":"","XPC_FLAGS":"0x0","npm_config_save_prod":"","npm_config_force":"","npm_config_bin_links":"true","ITERM_ORIG_PS1":"\\h:\\W \\u\\$ ","npm_config_searchopts":"","npm_config_node_gyp":"/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js","npm_config_depth":"Infinity","npm_package_main":"app.js","npm_config_sso_poll_frequency":"500","npm_config_rebuild_bundle":"true","npm_package_version":"1.0.0","XPC_SERVICE_NAME":"0","npm_config_unicode":"true","npm_package_scripts_web_build":"nuxt build","COLORFGBG":"7;0","HOME":"/Users/qingful","SHLVL":"2","npm_config_fetch_retry_maxtimeout":"60000","npm_config_tag_version_prefix":"v","npm_config_strict_ssl":"true","npm_config_sso_type":"oauth","npm_config_scripts_prepend_node_path":"warn-only","npm_config_save_prefix":"^","npm_config_loglevel":"notice","npm_config_ca":"","npm_config_save_exact":"","npm_config_group":"20","npm_config_fetch_retry_factor":"10","npm_config_dev":"","ITERM_PREV_PS1":"\\[\u001b]133;D;$?\u0007\u001b]133;A\u0007\\]\\h:\\W \\u\\$ \\[\u001b]133;B\u0007\\]","npm_config_version":"","npm_config_prefer_offline":"","npm_config_cache_lock_stale":"60000","npm_config_otp":"","npm_config_cache_min":"10","ITERM_SESSION_ID":"w0t0p0:2EC7CEB4-DEAB-42E9-8AFC-AB9C5178B25A","npm_config_searchexclude":"","npm_config_cache":"/Users/qingful/.npm","LOGNAME":"qingful","npm_lifecycle_script":"cross-env NODE_ENV=development NUXT_BUILD=true node app.js","npm_config_color":"true","npm_config_proxy":"","npm_config_package_lock":"true","npm_config_package_lock_only":"","npm_config_save_optional":"","npm_config_ignore_scripts":"","npm_config_user_agent":"npm/6.4.1 node/v10.15.1 darwin x64","npm_config_cache_lock_wait":"10000","npm_config_production":"","npm_package_dependencies_doodoo_plugin_dotenv":"^1.0.3","npm_config_send_metrics":"","npm_config_save_bundle":"","npm_config_umask":"0022","npm_config_node_options":"","npm_config_init_version":"1.0.0","npm_config_init_author_name":"","npm_config_git":"git","npm_config_scope":"","npm_config_unsafe_perm":"true","npm_config_tmp":"/var/folders/p4/j0r8x2p14vl26907sgcbh2mc0000gn/T","npm_config_onload_script":"","npm_node_execpath":"/usr/local/bin/node","npm_config_prefix":"/usr/local","npm_config_link":"","COLORTERM":"truecolor","NODE_ENV":"development","NUXT_BUILD":"true","APP_ROOT":"app","APP_PORT":"3000","STATIC_DIR":"www","STATIC_MAXAGE":"30 * 24 * 60 * 60","STATIC_DYNAMIC":"true"}
    }
    // Only set once
    if (context.req) app.context.req = context.req
    if (context.res) app.context.res = context.res
    app.context.redirect = (status, path, query) => {
      if (!status) {
        return
      }
      app.context._redirected = true
      // if only 1 or 2 arguments: redirect('/') or redirect('/', { foo: 'bar' })
      let pathType = typeof path
      if (typeof status !== 'number' && (pathType === 'undefined' || pathType === 'object')) {
        query = path || {}
        path = status
        pathType = typeof path
        status = 302
      }
      if (pathType === 'object') {
        path = app.router.resolve(path).href
      }
      // "/absolute/route", "./relative/route" or "../relative/route"
      if (/(^[.]{1,2}\/)|(^\/(?!\/))/.test(path)) {
        app.context.next({
          path: path,
          query: query,
          status: status
        })
      } else {
        path = formatUrl(path, query)
        if (process.server) {
          app.context.next({
            path: path,
            status: status
          })
        }
        if (process.client) {
          // https://developer.mozilla.org/en-US/docs/Web/API/Location/replace
          window.location.replace(path)

          // Throw a redirect error
          throw new Error('ERR_REDIRECT')
        }
      }
    }
    if (process.server) {
      app.context.beforeNuxtRender = fn => context.beforeRenderFns.push(fn)
    }
    if (process.client) {
      app.context.nuxtState = window.__NUXT__
    }
  }
  // Dynamic keys
  app.context.next = context.next
  app.context._redirected = false
  app.context._errored = false
  app.context.isHMR = !!context.isHMR
  if (context.route) {
    app.context.route = await getRouteData(context.route)
  }
  app.context.params = app.context.route.params || {}
  app.context.query = app.context.route.query || {}
  if (context.from) {
    app.context.from = await getRouteData(context.from)
  }
}

export function middlewareSeries(promises, appContext) {
  if (!promises.length || appContext._redirected || appContext._errored) {
    return Promise.resolve()
  }
  return promisify(promises[0], appContext)
    .then(() => {
      return middlewareSeries(promises.slice(1), appContext)
    })
}

export function promisify(fn, context) {
  let promise
  if (fn.length === 2) {
      console.warn('Callback-based asyncData, fetch or middleware calls are deprecated. ' +
        'Please switch to promises or async/await syntax')

    // fn(context, callback)
    promise = new Promise((resolve) => {
      fn(context, function (err, data) {
        if (err) {
          context.error(err)
        }
        data = data || {}
        resolve(data)
      })
    })
  } else {
    promise = fn(context)
  }
  if (!promise || (!(promise instanceof Promise) && (typeof promise.then !== 'function'))) {
    promise = Promise.resolve(promise)
  }
  return promise
}

// Imported from vue-router
export function getLocation(base, mode) {
  let path = window.location.pathname
  if (mode === 'hash') {
    return window.location.hash.replace(/^#\//, '')
  }
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length)
  }
  return decodeURI(path || '/') + window.location.search + window.location.hash
}

export function urlJoin() {
  return Array.prototype.slice.call(arguments).join('/').replace(/\/+/g, '/')
}

// Imported from path-to-regexp

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
export function compile(str, options) {
  return tokensToFunction(parse(str, options))
}

export function getQueryDiff(toQuery, fromQuery) {
  const diff = {}
  const queries = { ...toQuery, ...fromQuery }
  for (const k in queries) {
    if (String(toQuery[k]) !== String(fromQuery[k])) {
      diff[k] = true
    }
  }
  return diff
}

export function normalizeError(err) {
  let message
  if (!(err.message || typeof err === 'string')) {
    try {
      message = JSON.stringify(err, null, 2)
    } catch (e) {
      message = `[${err.constructor.name}]`
    }
  } else {
    message = err.message || err
  }
  return {
    ...err,
    message: message,
    statusCode: (err.statusCode || err.status || (err.response && err.response.status) || 500)
  }
}

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
const PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse(str, options) {
  const tokens = []
  let key = 0
  let index = 0
  let path = ''
  const defaultDelimiter = (options && options.delimiter) || '/'
  let res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    const m = res[0]
    const escaped = res[1]
    const offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    const next = str[index]
    const prefix = res[2]
    const name = res[3]
    const capture = res[4]
    const group = res[5]
    const modifier = res[6]
    const asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    const partial = prefix != null && next != null && next !== prefix
    const repeat = modifier === '+' || modifier === '*'
    const optional = modifier === '?' || modifier === '*'
    const delimiter = res[2] || defaultDelimiter
    const pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty(str) {
  return encodeURI(str).replace(/[/?#]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk(str) {
  return encodeURI(str).replace(/[?#]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens) {
  // Compile all the tokens into regexps.
  const matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (let i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (obj, opts) {
    let path = ''
    const data = obj || {}
    const options = opts || {}
    const encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      const value = data[token.name || 'pathMatch']
      let segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (Array.isArray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (let j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup(group) {
  return group.replace(/([=!:$/()])/g, '\\$1')
}

/**
 * Format given url, append query to url query string
 *
 * @param  {string} url
 * @param  {string} query
 * @return {string}
 */
function formatUrl(url, query) {
  let protocol
  const index = url.indexOf('://')
  if (index !== -1) {
    protocol = url.substring(0, index)
    url = url.substring(index + 3)
  } else if (url.startsWith('//')) {
    url = url.substring(2)
  }

  let parts = url.split('/')
  let result = (protocol ? protocol + '://' : '//') + parts.shift()

  let path = parts.filter(Boolean).join('/')
  let hash
  parts = path.split('#')
  if (parts.length === 2) {
    path = parts[0]
    hash = parts[1]
  }

  result += path ? '/' + path : ''

  if (query && JSON.stringify(query) !== '{}') {
    result += (url.split('?').length === 2 ? '&' : '?') + formatQuery(query)
  }
  result += hash ? '#' + hash : ''

  return result
}

/**
 * Transform data object to query string
 *
 * @param  {object} query
 * @return {string}
 */
function formatQuery(query) {
  return Object.keys(query).sort().map((key) => {
    const val = query[key]
    if (val == null) {
      return ''
    }
    if (Array.isArray(val)) {
      return val.slice().map(val2 => [key, '=', val2].join('')).join('&')
    }
    return key + '=' + val
  }).filter(Boolean).join('&')
}
