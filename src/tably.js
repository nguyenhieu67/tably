const $ = document.querySelector.bind(document);

function Tably(selector, options = {}) {
    this.container = document.querySelector(selector);

    if (!this.container) {
        console.error(
            `Tably: No container found for selector ${this.container} `
        );
        return;
    }

    this.tabs = Array.from(document.querySelectorAll("li a"));
    if (!this.tabs.length) {
        console.error(`Tably: No tas found inside the container`);
        return;
    }

    this.panels = this.tabs
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

    if (this.tabs.length !== this.panels.length) return;

    this._originHTML = this.container.innerHTML;

    this._panelHidden = () => {
        this.panels.forEach((panel) => (panel.hidden = true));
    };

    this._panelActiveHidden = (panel = this.panels[0]) => {
        const panelActive = panel;
        return (panelActive.hidden = false);
    };

    this._init();
}

Tably.prototype._init = function () {
    this._activeTab(this.tabs[0]);

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => this._handelTabClick(event, tab);
    });
};

Tably.prototype._handelTabClick = function (event, tab) {
    event.preventDefault();

    this._activeTab(tab);
};

Tably.prototype._activeTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tably--active");
    });

    tab.closest("li").classList.add("tably--active");

    this.panels.forEach((panel) => (panel.hidden = true));

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;
};

Tably.prototype.switch = function () {};

Tably.prototype.destroy = function () {};

const tabs = new Tably("#tabs", {});
// tabs.destroy();
