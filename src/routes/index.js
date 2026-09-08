import "$lib/components/badge.js";
import "$lib/components/snippet.js";
import "$lib/components/section.js";
import "$lib/components/featuregrid.js";
import "$lib/components/tabcontainer.js";
import "$lib/components/supported.js";
import "$lib/components/notice.js";
import { createDownloadList, createPackageList } from "$lib/downloads.js";
import { updateCIStatus } from "$lib/ci.js";
import { AppPage } from "$app";

export default class HomePage extends AppPage {
    static get tag() { return "home-page"; }

    static get template() {
        return /*html*/`
<article class="py-6 gap-y-3">
    <div class="border-b border-muted">
        <div class="flex px-7 md:px-14 gap-y-3 pb-10">
            <div class="flex-1 flex flex-col gap-y-8">
                <div class="leading-[1.15]">
                    <h1 class="text-[1.9rem] mb-1 font-bold tracking-[-0.02em]"><span class="text-primary">RE</span>Dasm</h1>
                    <h5 class="text-muted tracking-[0.08em]">The Open Source Disassembler</h5>
                </div>
                <p class="leading-[1.75]">
                    For hobbyists and professional reverse engineers.<br>
                    Free forever<span class="cursor"></span>
                </p>
                <div class="flex gap-x-3">
                    <x-badge class="my-1" color="foreground" label="language" value="C/C++"></x-badge>
                    <x-badge class="my-1" color="foreground" label="license" value="GPL3"></x-badge>
                </div>
            </div>
            <div class="flex flex-col gap-y-3 text-right">
                <div class="flex flex-col gap-y-1">
                    <div>
                        <a data-default class="tracking-[0.08em] inline-flex items-center gap-x-2 bg-primary hover:bg-highlight hover:text-background text-foreground uppercase text-sm px-4 py-2" href="#download">
                            <i class="fas fa-download"></i>
                            <span>download</span>
                        </a>
                    </div>
                    <div>
                        <a data-default class="tracking-[0.08em] inline-flex items-center gap-x-2 bg-muted hover:bg-highlight hover:text-background text-foreground uppercase text-sm px-4 py-2" href="#packages">
                            <i class="fas fa-box-open"></i>
                            <span>packages</span>
                        </a>
                    </div>
                </div>
                <div>
                    <div class="inline-flex items-end gap-x-2 text-muted">
                        <i class="fab fa-windows fa-lg"></i>
                        <i class="fab fa-linux fa-lg"></i>
                    </div>
                </div>
                <div class="flex flex-col gap-y-1">
                    <x-badge id="x-badge-ci" class="uppercase" color="muted" label="     CI" value="C/C++"></x-badge>
                    <x-badge id="x-badge-nightly" class="uppercase" color="muted" label="Nightly" value="GPL3"></x-badge>
                </div>
            </div>
        </div>
        <x-snippet></x-snippet>
    </div>
    <div class="px-14">
        <section>
            <section-title>Overview</section-title>
            <feature-grid class="grid-cols-1 md:grid-cols-2">
                <feature-item heading="Interactive listing">
                    Navigate code and data with cross-references, 
                    rename symbols renaming, add comments and display control flow graph.
                </feature-item>
                <feature-item heading="Plugin architecture">
                    REDasm provides a C API, they are carefully designed to be simple and intuitive to use.<br>
                    C API makes easy to integrate other programming languages and core library is
                    designed to be used headless for automated analysis.
                </feature-item>
            </feature-grid>
        </section>

        <section class="flex flex-col gap-y-3">
            <section-title>Features</section-title>
            <x-supported></x-supported>
        </section>

        <section id="download" class="flex flex-col gap-y-3">
            <section-title>Download</section-title>
            <div class="grid md:grid-cols-2 gap-3">
                <x-notice color="error" icon="fa-hand" class="p-3 text-sm">
                    <h5 class="uppercase font-bold pb-3">BETA status</h5>
                    <p>
                        REDasm is beta-quality software and it does not represent the final product.<br>
                        The latest version available is <span class="font-bold" id="latest-version"></span>: see 
                        <a id="latest-version-url" href="#">GitHub</a>
                        for changelog.
                    </p>
                </x-notice>
                <x-notice color="warning" icon="fa-moon" class="p-3 text-sm">
                    <h5 class="uppercase font-bold pb-3">Nightly Builds</h5>
                    <p>
                        <a href="https://github.com/redasm-dev/redasm/releases#release-nightly">Nightly builds</a>
                        are automatically generated from the latest commits, giving you access to the newest features and fixes.
                    </p>
                </x-notice>
            </div>
            <div id="home__downloads" class="overflow-auto text-sm"></div>
            <details class="group border border-muted bg-background-alt">
                <summary class="flex items-center p-3 gap-x-2 text-muted cursor-pointer hover:text-foreground hover:bg-background">
                    <i class="fas fa-chevron-right group-open:rotate-90 fa-fw text-primary"></i>
                    <span>Signature Verification</span>
                </summary>
                <div class="p-3 text-xs">
                <p>
                        Builds are signed.<br>
                        Each release ships a <i>.sha256</i> and a matching <i></u>.sha256.asc</i> signature, both available on the
                        <a href="https://github.com/redasm-dev/redasm/releases">GitHub release page</a>.
                </p>
                <pre class="pt-3 text-code overflow-x-auto whitespace-pre-wrap break-all">
                        <code>
<span class="text-success"># import public keys</span>
gpg --keyserver keys.openpgp.org --recv-keys B0C728D7021EEEE9D9B859043AF46EB2201FFB56 <span class="text-success"># releases</span>
gpg --keyserver keys.openpgp.org --recv-keys A2391AFACAE2EE52B35541DD65F948A2F6BB294A <span class="text-success"># nightly</span>

<span class="text-success"># verify linux</span>
gpg --verify REDasm-VERSION-linux-x86_64.AppImage.sha256.asc REDasm-VERSION-linux-x86_64.AppImage.sha256
sha256sum -c REDasm-VERSION-linux-x86_64.AppImage.sha256

<span class="text-success"># verify windows</span>
gpg --verify REDasm-VERSION-windows-x86_64.zip.sha256.asc REDasm-VERSION-windows-x86_64.zip.sha256
sha256sum -c REDasm-VERSION-windows-x86_64.zip.sha256

<span class="text-success"># for nightly builds (replace VERSION with "nightly")</span>
gpg --verify REDasm-nightly-linux-x86_64.AppImage.sha256.asc REDasm-nightly-linux-x86_64.AppImage.sha256
sha256sum -c REDasm-nightly-linux-x86_64.AppImage.sha256
                        </code>
                </pre>
</div>
            </details>
        </section>
        <section id="packages" class="flex flex-col gap-y-3">
            <section-title>Packages</section-title>
            <p>
                REDasm is also available in various package managers, which provides
                a more integrated installation & update experience.
            </p>
            <div id="home__packages">
            </div>
        </section>
    </div>
</article>
`;
    }

    get styles() {
        return `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50%      { opacity: 0; }
            }
            .cursor {
                display: inline-block;
                width: 0.55em;
                height: 3px;
                background: var(--color-foreground);
                animation: blink 1.1s step-end infinite;
                vertical-align: text-bottom;
                margin-bottom: 0;
                margin-left: 3px;
            }
        `;
    }

    onCreated() {
        const URL_BASE = "https://github.com/redasm-dev/redasm/releases/tag";

        createDownloadList(this.querySelector("#home__downloads")).then(v => {
            document.querySelector("#latest-version").textContent = v;
            document.querySelector("#latest-version-url").href = `${URL_BASE}/${v}`;
        });

        createPackageList(this.querySelector("#home__packages"));
        updateCIStatus();
    }
}
