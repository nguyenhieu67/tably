function Tably(selector, options = {}) {
    this.container = document.querySelector(selector);

    if (!this.container) {
        console.error(`Tably: No container found for selector '${selector}'`);
        return;
    }
    this.tabs = Array.from(this.container.querySelectorAll("li a"));
    if (!this.tabs.length) {
        console.error(`Tabzy: No tabs found inside the container`);
        return;
    }

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                console.error(
                    `Tabzy: No panel found for selector '${tab.getAttribute(
                        "href"
                    )}'`
                );
            }
            return panel;
        })
        .filter(Boolean);

    if (this.tabs.length !== this.panels.length) return;

    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tably.prototype._init = function () {
    this._tabActivate(this.tabs[0]);

    this.tabs.forEach((tab) => {
        tab.onclick = () => this._handelTabClick(event, tab);
    });
};

Tably.prototype._handelTabClick = function (event, tab) {
    event.preventDefault();

    this._tabActivate(tab);
};

Tably.prototype._tabActivate = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tably--active");
    });

    tab.closest("li").classList.add("tably--active");

    this.panels.forEach((panel) => (panel.hidden = true));

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;
};

Tably.prototype.switch = function (input) {
    let tabActive = null;
    if (typeof input === "string") {
        tabActive = this.tabs.find((tab) => tab.getAttribute("href") === input);

        if (!tabActive) {
            console.error(`Tabzy: No panel found with ID '${input}'`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabActive = input;
    }

    if (!tabActive) {
        console.error(`Tabzy: Invalid input '${input}'`);
        return;
    }

    this._tabActivate(tabActive);
};

Tably.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach((panel) => (panel.hidden = false));
    this.container = null;
    this.tabs = null;
    this.panels = null;
};
