    const STORE_URL = '/kamaji/api/pcnow/00_09_000/user/stores';

    const newStyle = document.createElement('style');
    newStyle.innerText = `
        .scroll-arrow {
            display: none !important;
        }
        .ui-mode-pointer .games-list.games-list {
            height: auto !important;
        }

        .ui-mode-pointer .games-list.games-list .slider {
            height: auto !important;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            transform: none !important;
        }

        .ui-mode-pointer .games-list-tile.games-list-tile.games-list-tile {
            width: 100%;
            height: 100%;
            margin: 0;
        }
        .psp-search-bar {
            position: fixed;
            z-index: 100;
            display: block;
            padding: 1em;
            width: calc(100% - 10px);
            top: 50px;
            left: 0;
        }
        .ui-mode-pointer.ui-mode-pointer .category-tile>.title {
            padding: 2em 1.2em;
            position: sticky;
            top: 53px;
            background: inherit;
            z-index: 99;
        }

        .ui-mode-pointer.ui-mode-pointer .category-tile {
            background: #222;
        }

        .ui-mode-pointer.ui-mode-pointer .category-tile:nth-child(odd) {
            background: #333;
        }
        .catalog-list {
            padding-top: 53px;
            display: flex;
            flex-direction: column;
        }

        .PLAYHISTORY {
            order: -1;
        }
    `;

    const PSPP_WaitForCatalogListLoad = () => {
        // Observe DOM mutations (changes to the structure)
        const observer = new MutationObserver(async () => {
            const catalogList = document.querySelector(".catalog-list");

            // Check if catalog list is loaded
            if (catalogList) {
                // Remove observer
                observer.disconnect();
                // Create input for search
                const input = document.createElement('input');
                input.classList.add('psp-search-bar');
                input.placeholder = 'Search (loading...)';
                catalogList.prepend(input);

                PSPP_RemoveDuplicates();
                await PSPP_LoadGameNames();

                input.placeholder = 'Search';

                const games = Array.from(document.querySelectorAll('[data-game]'));

                // Listen for input changes
                input.addEventListener('input', () => {
                    // Filter games based on search query
                    const v = input.value.toLowerCase();
                    games.forEach((game) => {
                        const gameName = game.getAttribute('data-game-name');
                        if ((gameName && gameName.toLowerCase().includes(v)) || v == '') {
                            game.style.display = 'block';
                        } else {
                            game.style.display = 'none';
                        }
                    });
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        document.querySelector('body').appendChild(newStyle);
    };

    // Load all the lists to retrieve the game names
    const PSPP_LoadGameNames = async () => {
        const promises = [];
        const lists = await PSPP_GetGameLists();
        lists.forEach((el) => {
            const url = `${el}?start=0&size=1000`;
            promises.push(fetch(url).then((response) => response.json()));
        });

        return Promise.all(promises).then((data) => {
            data.forEach(({links}) => {
                links.forEach(({name, id}) => {
                    const tiles = Array.from(document.querySelectorAll(`[data-game="${id}"]`));
                    tiles.forEach((tile) => {
                        tile.setAttribute('data-game-name', name);
                    });
                });
            });
        });
    };

    // Get the base url from the store url
    const PSPP_GetBaseUrl = () => {
        return new Promise((resolve) => {
            fetch(STORE_URL)
                .then((response) => response.json())
                .then(({data}) => {
                    resolve(data.base_url);
                });
            });
    }

    // Use the base url to get the game lists
    const PSPP_GetGameLists = async () => {
        const url = await PSPP_GetBaseUrl();
        return new Promise((resolve) => {
            fetch(url)
                .then((response) => response.json())
                .then(({links}) => {
                    resolve(links.map(({url}) => url));
                });
        });
    }

    // Sliders have duplicates, so we need to remove them
    const PSPP_RemoveDuplicates = () => {
        const sliders = Array.from(document.querySelectorAll('.games-list .slider'));
        sliders.forEach((slider) => {
            const ids = [];
            const children = Array.from(slider.children);
            children.forEach((entry) => {
                const id = entry.getAttribute('data-game');
                if (ids.includes(id)) {
                    entry.remove();
                } else {
                    ids.push(id);
                }
            });
        });
    }

    document.addEventListener("DOMContentLoaded", PSPP_WaitForCatalogListLoad);
