const all_tabs = document.querySelectorAll(".");

function activeTabs() {
    all_tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tab.classList.add("active");
        })
    });
}

activeTabs();