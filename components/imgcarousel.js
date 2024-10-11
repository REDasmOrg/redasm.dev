class ImgCarousel extends HTMLElement {
    DEFAULT_INTERVAL = 3000;

    static get observedAttributes() { return ["interval", "index"]; }
    get interval() { return parseInt(this.getAttribute("interval") || this.DEFAULT_INTERVAL); }
    set interval(v) { this.setAttribute("interval", v); }
    get index() { return parseInt(this.getAttribute("index") || 0); }
    set index(v) { this.setAttribute("index", v); }

    connectedCallback() {
        this.pictures = this.querySelectorAll("img");
        this.timerid = null;
        this.manual = 0;

        this.pictures.forEach((x, i) => {
            x.alt = `carousel-${i}`;
            x.classList.add("w-full", "brightness-75");
        });

        window.requestAnimationFrame(() => {
            this.classList.add("block", "relative");
            this._setupControls();
            this._resetLoop();
            this._render(this.index);
            this._setupTimer();
        });
    }

    disconnectedCallback() {
        if (this.timerid != null)
            clearInterval(this.timerid);
    }

    attributeChangedCallback(name, oldvalue, newvalue) {
        switch (name) {
            case "interval": this._setupTimer(); break;
            case "index": this._render(newvalue, oldvalue); break;
            default: break;
        }
    }

    _setupControls() {
        const btnleft = this.appendChild(document.createElement("button"));
        const btnright = this.appendChild(document.createElement("button"));
        btnleft.ariaLabel = "Previous Image";
        btnleft.classList.add("absolute", "left-5", "top-1/2", "opacity-90", "ml-1");
        btnright.ariaLabel = "Next Image";
        btnright.classList.add("absolute", "right-5", "top-1/2", "opacity-90", "mr-1");

        btnleft.addEventListener("click", () => {
            this.manual = true;
            this._moveImage(-1);
        });

        btnright.addEventListener("click", () => {
            this.manual = true;
            this._moveImage(1);
        });

        const icoleft = btnleft.appendChild(document.createElement("i"));
        const icoright = btnright.appendChild(document.createElement("i"));
        icoleft.classList.add("fas", "fa-chevron-left", "fa-lg");
        icoright.classList.add("fas", "fa-chevron-right", "fa-lg");

        this.cntindicators = this.appendChild(document.createElement("ul"));
        this.cntindicators.classList.add("flex", "justify-center", "absolute", "bottom-5", "inset-x-0");

        this.pictures.forEach((_, idx) => {
            const li = this.cntindicators.appendChild(document.createElement("li"));
            const btn = li.appendChild(document.createElement("button"));
            btn.classList.add("opacity-90", "mx-1");
            btn.ariaLabel = `Image ${idx}`;

            const i = btn.appendChild(document.createElement("i"));
            i.classList.add("fas", "fa-circle", "fa-fw", "fa-2xs");
        });
    }

    _setupTimer() {
        this._resetLoop();

        this.timerid = setInterval(() => {
            if (!this.manual)
                this._moveImage(1);
        }, this.interval);
    }

    _render(newindex, oldindex) {
        if (!this.pictures)
            return;

        if (oldindex != null)
            this.pictures[oldindex].classList.add("hidden");

        if (newindex != null)
            this.pictures[newindex].classList.remove("hidden");

        const buttons = this.cntindicators.querySelectorAll("button");

        buttons.forEach((x, i) => {
            if (this.index === i) {
                x.classList.add("text-light");
                x.classList.remove("text-dark");
            }
            else {
                x.classList.add("text-dark");
                x.classList.remove("text-light");
            }
        });
    }

    _resetLoop() {
        if (this.timerid != null)
            clearInterval(this.timerid);

        this.pictures.forEach(x => x.classList.add("hidden"));
        this.index = 0;
    }

    _moveImage(dir) {
        if (dir > 0)
            this.index = Math.abs((this.index + 1) % this.pictures.length);
        else if (dir < 0)
            this.index = Math.abs((this.index - 1) % this.pictures.length);
    }
}

window.customElements.define("img-carousel", ImgCarousel);
