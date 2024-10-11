class TabPanel extends HTMLElement {
    static get observedAttributes() {
        return ["selected"];
    }

    get title() {
        return this.getAttribute("title") || "";
    }

    get selected() {
        return this.hasAttribute("selected");
    }

    set selected(v) {
        if (v)
            this.setAttribute("selected", true);
        else
            this.removeAttribute("selected")
    }

    connectedCallback() {
        this.role = "tabpanel";
        this._checkVisibility();
    }

    attributeChangedCallback(name, oldvalue, newvalue) {
        if (name === "selected")
            this._checkVisibility();
    }

    _checkVisibility() {
        this.style.display = this.selected ? "block" : "none";
    }
}

class TabContainer extends HTMLElement {
    connectedCallback() {
        this.panels = this.querySelectorAll("tab-panel");

        this.tablist = this.insertBefore(document.createElement("div"), this.firstElementChild);
        this.tablist.classList.add("flex", "font-bold", "border-background", "border-b-2");
        this.tablist.role = "tablist";

        window.requestAnimationFrame(() => {
            let selected = -1;

            this.panels.forEach((tp, i) => {
                this._addButton(tp, i);
                tp.classList.add("py-2");

                if (tp.selected)
                    selected = i;
            });

            if (selected == -1)
                selected = 0;

            this.selectTab(selected);
        });
    }

    _addButton(item, i) {
        const b = document.createElement("button");
        b.classList.add("py-2", "px-3");
        b.innerText = item.title || `Tab ${i + 1}`;
        b.role = "tab";
        b.addEventListener("click", () => this.selectTab(i));
        this.tablist.append(b);
    }

    selectTab(idx) {
        if (idx < 0 || idx >= this.panels.length)
            return;

        for (let i = 0; i < this.panels.length; i++) {
            this.panels[i].selected = i === idx;

            if (i == idx)
                this.tablist.children[i].classList.add("bg-primary");
            else
                this.tablist.children[i].classList.remove("bg-primary");
        }
    }
}

window.customElements.define("tab-panel", TabPanel);
window.customElements.define("tab-container", TabContainer);
