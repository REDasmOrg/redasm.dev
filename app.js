const ROUTE_PARAMETER_REGEXP = /:(\w+)/g
const URL_FRAGMENT_REGEXP = '([^\\/]+)'
const NAV_A_SELECTOR = "a[data-navigation]";
const TICK_TIME = 250;

export default class App {
    constructor(routes, options = {}) {
        this.options = options;

        if (!this.options.main)
            this.options.main = "main";

        if (!this.main)
            throw new Error(`Main element "${q}" not found`);

        this.routes = [];

        if (typeof (routes) == "object") {
            for (const [path, obj] of Object.entries(routes))
                this.addRoute(path, obj);
        }

        document.body.addEventListener("click", e => {
            if (e.target.matches(NAV_A_SELECTOR)) {
                e.preventDefault();
                this.navigate(e.target.getAttribute("href"));
            }
        });

        this._checkRoutes();
        window.setInterval(() => this._checkRoutes(), TICK_TIME);
    }

    get main() {
        return document.querySelector(this.options.main);
    }

    isURL(s) {
        let url;
        try { url = new URL(s); }
        catch (_) { return false; }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    parseHTML(html) {
        const eltemplate = document.createElement("template");
        eltemplate.innerHTML = html.trim();

        if (eltemplate.content.children.length)
            return eltemplate.content.firstElementChild;

        return eltemplate.content.children;
    }

    createTable(params) {
        params = params || {};
        const table = document.createElement("table");
        table.className = params.class || "";

        if (params.caption) {
            const caption = table.createCaption();
            caption.className = params.captionclass || "";
            caption.textContent = params.caption;
        }

        if (Array.isArray(params.header) && params.header.length > 0) {
            const head = table.createTHead().insertRow();
            head.className = params.headerclass || "";
            params.header.forEach(x => head.appendChild(document.createElement("th")).textContent = x || "");
        }

        if (Array.isArray(params.rows) && params.rows.length > 0 && typeof (params.delegate) === "function") {
            const fragment = document.createDocumentFragment();
            const body = fragment.appendChild(document.createElement("tbody"))
            body.className = params.bodyclass || "";
            params.rows.forEach((x, i) => body.insertRow().innerHTML = params.delegate(x, i));
            table.appendChild(body);
        }

        return table;
    }

    safe(v) {
        const e = document.createElement("div");
        e.innerText = v;
        return e.innerHTML;
    }

    navigate(path) {
        window.history.pushState(null, null, path);
    }

    addRoute(path, page) {
        this.routes.push(this._createRoute(path, page));
    }

    _createRoute(path, page) {
        const params = [];

        const parsedpath = path.replace(ROUTE_PARAMETER_REGEXP, (_, param) => {
            params.push(param);
            return URL_FRAGMENT_REGEXP;
        }).replace(/\//g, '\\/');

        return {
            regex: new RegExp(`^${parsedpath}$`),
            page,
            params,
        };
    }

    _extractUrlParams(route, path) {
        if (route.params.length === 0)
            return {};

        const params = {};
        const matches = path.match(route.testRegExp);
        matches.shift();

        matches.forEach((value, index) => {
            const paramname = route.params[index];
            params[paramname] = value;
        });

        return params;
    }

    _checkRoutes() {
        const path = window.location.pathname;

        if (this.lastpath === path)
            return;

        this.lastpath = path;

        let routepage = this.routes.find(x => {
            return x.regex.test(path);
        })

        if (!routepage && this.options.errorpage)
            routepage = this._createRoute(path, this.options.errorpage);

        if (routepage) {
            const params = this._extractUrlParams(routepage, path);

            if (typeof (routepage.page.delegate) === "function") {
                const newmain = this.main.cloneNode(true);
                newmain.innerHTML = "";

                const template = newmain.appendChild(this.parseHTML(routepage.page.template));

                Promise.resolve(routepage.page.delegate(this, template, { path, params })).then(() => {
                    this.main.replaceWith(newmain);
                });
            }
            else
                this.main.innerHTML = routepage.page.template;

            this._updateTitle(routepage.page.title);
        }
        else {
            this.main.innerHTML = /*html*/`
            <p style="text-align: center">
                <b>404</b>. That's an error.<br><br>
                The requested URL <i>${path}</i> was not found on this server.<br>
                That's all we know.
            </p>
            `;

            this._updateTitle("Not Found");
        }
    }

    _updateTitle(pagetitle) {
        let title = document.head.querySelector("title");

        if (!title)
            title = document.head.appendChild(document.createElement("title"));

        if (this.options.name) {
            if (pagetitle)
                pagetitle = `${pagetitle} - ${this.options.name}`;
            else
                pagetitle = this.options.name;
        }

        title.textContent = pagetitle;
    }
}
