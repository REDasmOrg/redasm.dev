import Packages from "$lib/packages.js"

function getFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) return bytes + " B";

    const units = si ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + " " + units[u];
}

function parseVersion(tag) {
    let parts = tag.split("-");
    let v = parts[0];
    if (v.startsWith("v")) v = v.slice(1);
    return { version: v, suffix: parts[1] };
}

function getPlatform(name) {
    const n = name.toLowerCase();
    if (n.includes("windows")) return "windows";
    if (name.endsWith(".AppImage") || n.includes("linux")) return "linux";
    return "";
}

function isSidecar(name) {
    return name.endsWith(".sha256") || name.endsWith(".asc");
}

async function fetchReleases() {
    const URL = "https://raw.githubusercontent.com/redasm-dev/redasm.dev/refs/heads/data/releases.json";

    try {
        const response = await fetch(URL, { cache: "no-store" });

        if (response.ok) {
            const releases = await response.json();

            const recent = releases
                .filter(r => !r.draft && r.assets.length && r.tag_name !== "nightly")
                .filter(r => {
                    const major = parseVersion(r.tag_name).version[0];
                    return major !== "2" && major !== "3";
                })
                .slice(0, 3);

            // flatten to binaries only, attaching each one's sidecars
            return recent.flatMap(r => {
                const v = parseVersion(r.tag_name);

                return r.assets
                    .filter(a => !isSidecar(a.name))
                    .map(a => {
                        const sha_hash = a.digest.split(":")[1];

                        return {
                            version: v.version,
                            suffix: v.suffix,
                            platform: getPlatform(a.name),
                            prerelease: r.prerelease,
                            tag: r.tag_name,
                            name: a.name,
                            url: a.browser_download_url,
                            created: new Date(a.created_at).toLocaleDateString(),
                            downloads: a.download_count,
                            size: getFileSize(a.size),
                            sha256: sha_hash,
                        };
                    });
            });
        }
        else
            console.error(response.statusText);
    }
    catch (error) {
        console.error(error.message)
    }

    return [];
}

function copyHash(el) {
    const full = el.dataset.hash;
    const shown = el.textContent;

    navigator.clipboard.writeText(full).then(() => {
        el.textContent = "copied";
        el.classList.add("text-success");
        el.classList.remove("hover:text-warning");

        setTimeout(() => {
            el.textContent = shown;
            el.classList.remove("text-success");
            el.classList.add("hover:text-warning");
        }, 1200);
    });
}

export async function createDownloadList(container) {
    const ICONS = {
        windows: "fab fa-windows",
        linux: "fab fa-linux",
    };

    const items = await fetchReleases();

    if (!items.length) {
        container.innerHTML = /*html*/`
<div class="border border-muted bg-background-alt p-3 text-sm text-muted">
    Unable to load releases. See
    <a href="https://github.com/redasm-dev/redasm/releases" class="text-warning">GitHub Releases</a>.
</div>`;
        return;
    }

    const list = document.createElement("ul");
    list.classList.add("flex", "flex-col", "border", "border-muted");

    for (const [idx, rel] of items.entries()) {
        const li = list.appendChild(document.createElement("li"));
        if (idx > 0) li.classList.add("border-t", "border-muted");

        li.innerHTML = /*html*/`
<a href="${rel.url}" class="flex text-sm items-center gap-x-3 p-3 bg-background-alt hover:bg-warning/5">
    <i class="${ICONS[rel.platform] ?? "fas fa-file"} fa-fw fa-xl text-foreground"></i>
    <div class="flex-1 min-w-0">
        <div class="text-success text-base break-all">${rel.name}</div>
        <div class="flex items-center gap-x-3 flex-wrap mt-1 text-xs text-muted">
            <span class="font-bold px-1 ${rel.prerelease ? "bg-warning text-background" : "border border-primary text-foreground"}">
                ${rel.suffix ?? rel.version}
            </span>
            <span><span class="text-foreground">Size:</span> ${rel.size}</span>
            <span><span class="text-foreground">Date:</span> ${rel.created}</span>
            <span><span class="text-foreground">Downloads:</span> ${rel.downloads}</span>
        </div>
        <div class="flex items-center gap-x-2 text-xs mt-1 text-muted">
            <span class="text-foreground">SHA256:</span>
                <span>${rel.sha256}</span>
        </div>
    </div>
</a>`;
    }

    container.appendChild(list);

    // footer note
    const more = document.createElement("div");
    more.classList.add("flex", "justify-between", "items-center", "flex-wrap",
        "gap-2", "mt-2", "text-xs", "text-muted");
    more.innerHTML = /*html*/`
        <span class="italic">Showing the 3 most recent releases</span>
        <a target="_blank" href="https://github.com/redasm-dev/redasm/releases" class="flex items-center gap-x-1">
            <span>All releases on GitHub</span>
            <i class="fas fa-chevron-right"></i>
        </a>`;
    container.appendChild(more);

    return items.length ? items[0].tag : null;
}

export function createPackageList(container) {
    for (const [i, f] of Packages.entries()) {
        const title_container = container.appendChild(document.createElement("h3"));
        title_container.classList.add("flex", "items-center", "gap-x-3");
        if (i > 0) title_container.classList.add("mt-6");

        const title = title_container.appendChild(document.createElement("div"));
        title.classList.add("font-bold");
        title.textContent = f.channel;

        if (f.official) {
            const title_badge = title_container.appendChild(document.createElement("div"));
            title_badge.classList.add("text-xs", "text-highlight", "opacity-75", "border", "border-highlight", "px-1", "rounded");
            title_badge.textContent = "Official";
        }

        const code = f.commands.map(x => {
            if (x.startsWith("#")) return `<span class="text-success">${x}</span>`;
            if (x.startsWith("-")) return `<span class="pl-2">${x}</span>`
            return x;
        }).join("\n");

        const content = container.appendChild(document.createElement("pre"));
        content.classList.add("text-code", "text-sm", "overflow-x-auto",
            "whitespace-pre-wrap", "break-all", "pl-4");
        content.innerHTML = `<code>${code}</code>`;
    }
}
