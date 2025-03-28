function Tably(selector, options = {}) {
    this.opt = Object.assign(
        {
            activeClassName: "tably--active",
            remember: false,
            onChange: null,
        },
        options
    );
    this.container = document.querySelector(selector);

    if (!this.container) {
        console.error(`Tably: No container found for selector '${selector}'`);
        return;
    }
    this.tabs = Array.from(this.container.querySelectorAll("li a"));
    if (!this.tabs.length) {
        console.error(`Tably: No tabs found inside the container`);
        return;
    }

    this.panels = this._getPanels();

    if (this.tabs.length !== this.panels.length) return;

    this.paramsKey = this._regular(selector);
    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tably.prototype._getPanels = function () {
    return this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                console.error(
                    `Tably: No panel found for selector '${tab.getAttribute(
                        "href"
                    )}'`
                );
            }
            return panel;
        })
        .filter(Boolean);
};

Tably.prototype._init = function () {
    const params = new URLSearchParams(location.search);
    tabSelector = params.get(`${this.paramsKey}`);

    const tab =
        (this.opt.remember &&
            tabSelector &&
            this.tabs.find(
                (tab) => this._regular(tab.getAttribute("href")) === tabSelector
            )) ||
        this.tabs[0];

    this.currentTab = tab;
    this._activateTab(tab, false, false);

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => {
            event.preventDefault();

            this._tryActivateTab(tab);
        };
    });
};

Tably.prototype._tryActivateTab = function (selector) {
    if (this.currentTab !== selector) {
        this.currentTab = selector;
        this._activateTab(selector);
    }
};

Tably.prototype._activateTab = function (
    tab,
    triggerOnChange = true,
    update = this.opt.remember
) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove(this.opt.activeClassName);
    });

    tab.closest("li").classList.add(this.opt.activeClassName);

    this.panels.forEach((panel) => (panel.hidden = true));

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if (update) {
        const params = new URLSearchParams(location.search);
        params.set(this.paramsKey, this._regular(tab.getAttribute("href")));
        history.replaceState(null, null, `?${params}`);
    }

    if (triggerOnChange && typeof this.opt.onChange === "function") {
        this.opt.onChange({
            tab,
            panel: panelActive,
        });
    }
};

Tably.prototype._regular = function (selector) {
    if (!selector) {
        console.error("////");
        return;
    }
    return selector.replace(/[^a-zA-Z0-9]/g, "");
};

Tably.prototype.switch = function (input) {
    const tab =
        typeof input === "string"
            ? this.tabs.find((tab) => tab.getAttribute("href") === input)
            : this.tabs.includes(input)
            ? input
            : null;

    if (!tab) {
        console.error(`Tabzy: Invalid input '${input}'`);
        return;
    }

    this._tryActivateTab(tab);
};

Tably.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach((panel) => (panel.hidden = false));
    this.container = null;
    this.tabs = null;
    this.panels = null;
    this.currentTab = null;
};
