import { AppComponent } from "$app";
import Features from "$lib/features.js";

class Supported extends AppComponent {
    static get tag() { return "x-supported"; }

    static get template() {
        return /*html*/`
<div class="flex flex-col gap-y-3 text-sm">
    <div class="supported-matrix hidden md:grid grid-cols-3 bg-background-alt divide-x divide-muted border border-muted"></div>
    <div class="supported-matrix-mobile md:hidden flex flex-col gap-y-3"></div>
    <div class="supported-legend bg-background-alt border border-muted"></div>
</div>
`;
    }

    onCreated() {
        this._createMatrix();
        this._createMatrixMobile();
        this._createLegend();
    }

    _createMatrix() {
        const s_matrix = this.querySelector(".supported-matrix");

        for (const mi of Features.matrix) {
            const matrix_item = s_matrix.appendChild(document.createElement("div"));

            const container = matrix_item.appendChild(document.createElement("div"));
            container.classList.add("flex", "items-center", "uppercase", "pl-3", "py-3", "gap-x-3",
                "border-b", "border-muted");

            const icon = container.appendChild(document.createElement("i"));
            icon.classList.add("text-primary", "fas", "fa-fw", "fa-lg", mi.icon);

            const text = container.appendChild(document.createElement("span"));
            text.classList.add("flex-1", "pr-3");
            text.textContent = mi.title;

            const items_container = matrix_item.appendChild(document.createElement("div"));
            items_container.classList.add("p-3");
            this._createMatrixItems(items_container, mi.items);
        }
    }

    _createMatrixMobile() {
        const s_matrix = this.querySelector(".supported-matrix-mobile");

        const ul = s_matrix.appendChild(document.createElement("ul"));
        ul.classList.add("flex", "flex-col", "gap-y-1");

        for (const [i, mi] of Features.matrix.entries()) {
            const li = ul.appendChild(document.createElement("li"));
            const button = li.appendChild(document.createElement("button"));
            button.classList.add("cursor-pointer", "w-full", "px-2", "py-1", "uppercase", "border", "border-muted", "text-muted", "bg-background-alt", "matrix-container-button");
            button.type = "button";
            button.textContent = mi.title;

            const item_container = s_matrix.appendChild(document.createElement("div"));
            item_container.classList.add("p-2", "hidden", "bg-background-alt", "border", "border-muted", "matrix-container");

            this._createMatrixItems(item_container, mi.items);

            button.addEventListener("click", () => {
                const buttons = s_matrix.querySelectorAll(".matrix-container-button");
                const containers = s_matrix.querySelectorAll(".matrix-container");

                buttons.forEach(x => {
                    x.classList.remove("bg-primary");
                    x.classList.add("border", "border-muted", "bg-background-alt", "text-muted");
                });

                buttons[i].classList.add("bg-primary");
                buttons[i].classList.remove("border", "border-muted", "bg-background-alt", "text-muted");

                containers.forEach(x => x.classList.add("hidden"));
                containers[i].classList.remove("hidden");
            });

            // select first item
            if (!i) button.click();
        }
    }

    _createLegend() {
        const s_legend = this.querySelector(".supported-legend");

        const container = s_legend.appendChild(document.createElement("div"));
        container.classList.add("mx-auto", "grid", "grid-cols-2", "md:flex", "justify-between", "gap-2", "md:gap-6", "p-3");

        for (const tier of Features.tiers)
            container.appendChild(this._createTierIcon(tier, true));
    }

    _createTierIcon(tier, label) {
        const icon_el = document.createElement("div");
        icon_el.classList.add("w-[24px]", "h-[24px]", "flex", "justify-center",
            "items-center", "p-1", "border",
            Features.tier_details[tier].border, Features.tier_details[tier].text);
        icon_el.textContent = tier;

        if (label !== true) return icon_el;

        const tier_el = document.createElement("div");
        tier_el.classList.add("flex", "gap-x-2", "items-center");

        tier_el.appendChild(icon_el);

        const text_el = tier_el.appendChild(document.createElement("div"));
        text_el.classList.add("flex-1");
        text_el.textContent = Features.tier_details[tier].description;

        return tier_el;
    }

    _createMatrixItems(container, items) {
        for (const item of items) {
            const item_container = container.appendChild(document.createElement("div"));
            item_container.classList.add("grid", "grid-cols-3", "md:grid-cols-4", "py-1", "gap-x-3");

            const item_text = item_container.appendChild(document.createElement("div"));
            item_text.classList.add("col-span-2", "md:col-span-3");
            item_text.textContent = item.text;

            item_container.appendChild(this._createTierIcon(item.tier));
        }
    }
}

Supported.register();

