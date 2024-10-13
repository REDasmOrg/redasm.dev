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

async function fetchReleases() {
    const URL = "https://raw.githubusercontent.com/REDasmOrg/redasm.github.io/refs/heads/data/releases.json";

    try {
        const response = await fetch(URL);

        if (response.ok) {
            const releases = await response.json();

            return releases.reduce((acc, r) => {
                if (r.draft || !r.assets.length) return acc;

                for (let a of r.assets) {
                    acc.push({
                        version: r.tag_name,
                        prerelease: r.prerelease,
                        name: a.name,
                        url: a.browser_download_url,
                        created: new Date(a.created_at).toLocaleString(),
                        downloads: a.download_count,
                        size: getFileSize(a.size),
                    });
                }

                return acc;
            }, []);
        }
        else
            console.error(response.statusText);
    }
    catch (error) {
        console.error(error.messasge)
    }

    return [];
}

const PACKAGES = [
    {
        os: "Arch (Stable)",
        package: "redasm",
        url: "https://aur.archlinux.org/packages/redasm",
    },
    {
        os: "Arch (Git)",
        package: "redasm-git",
        url: "https://aur.archlinux.org/packages/redasm-git",
    },
    {
        os: "Debian",
        package: "redasm",
        url: "http://phd-sid.ethz.ch/debian/redasm",
    },
    {
        os: "Gentoo",
        package: "redasm",
        url: "https://gpo.zugaina.org/dev-util/redasm",
    },
    {
        os: "FreeBSD",
        package: "redasm",
        url: "https://www.freshports.org/devel/redasm",
    },
    {
        os: "Haiku",
        package: "redasm",
        url: "https://ports-mirror.haiku-os.org/redasm",
    },

];

async function createReleasesTable(app, container) {
    container.appendChild(app.createTable({
        class: "w-full",
        header: ["Name", "Size", "Date", "Version", "Downloads"],
        headerclass: "text-left",
        rows: await fetchReleases(),

        delegate: row => {
            return /*html*/`
                <td>
                    <div class="flex mr-2 gap-x-2">
                        <a href="${row.url}" class="flex-1">${row.name}</a>

                        ${row.prerelease ? /*html*/
                    `<span class="border rounded px-1 
                                  bg-warning text-background
                                  font-bold text-xs">PRERELEASE</span>` : ""}
                    </div>
                </td>
                <td>${row.size}</td>
                <td>${row.created}</td>
                <td>${row.version}</td>
                <td>${row.downloads}</td>
            `;
        }
    }));
}

function createPackagesTable(app, container) {
    container.appendChild(app.createTable({
        class: "w-full",
        caption: "Unofficial packages created by the community",
        captionclass: "text-left",
        header: ["OS", "Package Name", "URL"],
        headerclass: "text-left",
        rows: PACKAGES,

        delegate: row => {
            return /*html*/`
                <td>${row.os}</td>
                <td>${row.package}</td>
                <td><a href="${row.url}">${row.url}</a></td>
            `;
        }
    }));
}

export default {
    title: "Download",

    template: /*html*/`
        <article class="download">
            <tab-container>
                <tab-panel id="download__releases" title="Releases">
                </tab-panel>
                <tab-panel title="Nightly Builds">
                    Nightly builds are provided by 
                    <a href="https://github.com/REDasmOrg/REDasm/actions/workflows/build.yml">GitHub Actions</a>.<br>
                    They provides the latest features and bugfixes, but they can be unstable.
                </tab-panel>
                <tab-panel id="download__packages" title="Packages">
                </tab-panel>
            </tab-container>
        </article>
    `,

    delegate: function(app, template) {
        createReleasesTable(app, template.querySelector("#download__releases"));
        createPackagesTable(app, template.querySelector("#download__packages"));
    }
};

