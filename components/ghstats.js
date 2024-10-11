class GitHubStats extends HTMLElement {
    REPO = "https://github.com/REDasmOrg/REDasm"
    URL = "https://raw.githubusercontent.com/REDasmOrg/redasm.github.io/refs/heads/data/repository.json";
    BORDER_COLOR = "#3d444d";
    COLOR_L = "#1f262e";
    COLOR_R = "#0d1117";

    connectedCallback() {
        this.innerHTML = /*html*/`
            <ul class="flex text-xs font-bold">
                <li class="border border-[${this.BORDER_COLOR}] py-1 px-3 rounded-l-sm bg-[${this.COLOR_L}]">
                    <a href="${this.REPO}" target="_blank" data-default>
                        <i class="far fa-star fa-lg"></i>
                        Star
                    </a>
                </li>
                <li id="ghstats__count" class="border border-[${this.BORDER_COLOR}] py-1 px-2 rounded-r-sm bg-[${this.COLOR_R}]"></li>
            </ul>
        `;

        window.requestAnimationFrame(async () => {
            const count = this.querySelector("#ghstats__count");
            const response = await fetch(this.URL);

            if (response.ok) {
                const repository = await response.json();
                count.textContent = repository.stargazers_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            else
                count.textContent = "N/A";
        });
    }
}

window.customElements.define("gh-stats", GitHubStats);
