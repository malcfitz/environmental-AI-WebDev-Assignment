document.addEventListener("DOMContentLoaded", () => {
    
    // ===== Parallax Scrolling and Home Background=====
    const sections = document.querySelectorAll(".parallax-section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible");
            }
        });
    }, { threshold: [0.2, 0.5, 0.8] });

    sections.forEach(section => observer.observe(section));

    // Clouds move right when scrolling
    const clouds = document.querySelector(".clouds");
    const trees = document.querySelector(".trees");
    const ground = document.querySelector(".ground");

    if (clouds || trees || ground) {
        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;

            if (clouds) {
                clouds.style.backgroundPositionX = `${scrollY * 0.25}px`;
            }
            if (trees) {
                trees.style.transform = `translateY(${scrollY * -0.1}px)`;
            }
            if (ground) {
                ground.style.transform = `translateY(${scrollY * -0.05}px)`;
            }
        });
    }

    // ===== Leaflet Map =====
    const mapElement = document.getElementById("map");
    if (mapElement) {
        const map = L.map(mapElement, {
            minZoom: 1.5,
            maxZoom: 3,
            worldCopyJump: false,
            maxBounds: [[-90, -180], [90, 180]],
            maxBoundsViscosity: 0.0,
            zoomSnap: 0.1,
            zoomDelta: 0.1
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
            noWrap: true
        }).addTo(map);

        const projects = [
            { name: "Google DeepMind", coords: [51.51671206508627, -0.12698453081687888], category: "Energy", description: "Reduced data center cooling energy by 40%. Forecasts wind energy for better grid use.", link: "https://deepmind.google/discover/blog/using-ai-to-fight-climate-change/" },
            { name: "ClimateAI", coords: [37.7749, -122.4194], category: "Agriculture", description: "Provides climate risk modeling for agriculture and supply chains.", link: "https://climate.ai/" },
            { name: "Amp Robotics", coords: [39.7392, -104.9903], category: "SupplyChain", description: "AI-powered robots identify and sort recyclables with high accuracy.", link: "https://ampsortation.com/" },
            { name: "Microsoft AI for Earth", coords: [47.6062, -122.3321], category: "Agriculture", description: "Funds AI tools for agriculture, water conservation, and biodiversity projects.", link: "https://news.microsoft.com/apac/features/ai-for-earth-helping-save-the-planet-with-data-science/" },
            { name: "IBM Sustainable Supply Chain", coords: [40.7128, -74.0060], category: "SupplyChain", description: "Uses AI and blockchain to make supply chains transparent and sustainable.", link: "https://www.ibm.com/resources/business-operations/supply-chain-sustainability" },
            { name: "CropX", coords: [-41.2289967026433, 174.75479336600654], category: "Agriculture", description: "Uses soil sensors and AI to deliver precision irrigation and fertilization insights.", link: "https://cropx.com/" },
            { name: "VeriTree", coords: [51.50769029313562, -0.0738895335098064], category: "Agriculture", description: "Combines AI, geospatial technology, and blockchain to verify ecosystem restoration projects.", link: "https://www.veritree.com/tree-planting" },
            { name: "TreeFera", coords: [-40.9006, 174.8860], category: "SupplyChain", description: "An adaptive, AI-enabled data fabric delivering plot-level clarity for global supply chains.", link: "https://www.treefera.com/" },
            { name: "C3.ai", coords: [37.51424268508439, -122.19995246114722], category: "Energy", description: "It offers AI-powered platforms to companies in energy, defense, manufacturing, and finance.", link: "https://c3.ai/" },
            { name: "Planet Labs", coords: [52.50488348377332, 13.3297157260634], category: "Agriculture", description: "Operates the largest fleet of Earth-imaging satellites to monitor environmental changes.", link: "https://www.planet.com/" },
            { name: "Sylvera", coords: [51.529738506506035, -0.09354308873979802], category: "CarbonOffset", description: "Uses AI and satellite data to rate carbon offset projects.", link: "https://www.planet.com/" }
        ];

        let markers = [];

        function addMarkers(filterCategory = "all") {
            markers.forEach(m => map.removeLayer(m));
            markers = [];

            const categoryColors = {
                "Energy": "green",
                "Agriculture": "orange",
                "SupplyChain": "blue",
                "CarbonOffset": "purple"
            };

            projects.forEach(p => {
                if (filterCategory !== "all" && p.category !== filterCategory) return;

                const color = categoryColors[p.category] || "gray";

                const customIcon = L.divIcon({
                    className: "custom-marker",
                    html: `<i class="fa-solid fa-location-dot" style="color:${color}; font-size: 24px;"></i>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                    popupAnchor: [0, -24]
                });

                const marker = L.marker(p.coords, { icon: customIcon }).addTo(map);

                marker.on("click", () => {
                    const modalBody = document.getElementById("projectModalBody");
                    if (modalBody) {
                        modalBody.innerHTML = `
                            <h4>${p.name}</h4>
                            <p>${p.description}</p>
                            <a href="${p.link}" target="_blank">Learn More</a>
                        `;
                        const modal = new bootstrap.Modal(document.getElementById('projectModal'));
                        modal.show();
                    }
                });

                markers.push(marker);
            });

            if (filterCategory !== "all" && markers.length) {
                const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
                map.flyToBounds(bounds, { padding: [80, 80], duration: 1 });
                setTimeout(() => {
                    if (map.getZoom() < 1.7) map.setZoom(1.7);
                }, 1000);
            }
        }

        addMarkers("all");
        map.setView([20, 20], 1.7);

        const filterSelect = document.getElementById("projectFilter");
        if (filterSelect) {
            filterSelect.addEventListener("change", () => {
                const selected = filterSelect.value;
                addMarkers(selected);

                if (selected === "all") {
                    map.setView([20, 20], 1.7);
                } else if (markers.length) {
                    const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
                    map.flyToBounds(bounds, { padding: [80, 80], duration: 1 });
                    setTimeout(() => {
                        if (map.getZoom() < 1.7) map.setZoom(1.7);
                    }, 1000);
                }
            });
        }
    }

    // ===== Like Buttons =====
    const likedIds = new Set();
    let previousOrder = [];

    function bindLikeButtons() {
        document.querySelectorAll('.like-btn').forEach(button => {
            const id = button.dataset.id;

            if (likedIds.has(id)) {
                button.disabled = true;
                button.classList.remove('btn-success');
                button.classList.add('btn-secondary');
                return;
            }

            if (button.dataset.bound) return;
            button.dataset.bound = true;

            button.addEventListener('click', async (e) => {
                e.preventDefault();
                if (button.disabled) return;

                const form = button.closest('form');
                const tokenInput = form.querySelector('input[name="__RequestVerificationToken"]');
                const token = tokenInput ? tokenInput.value : '';

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'RequestVerificationToken': token
                        },
                        body: `id=${encodeURIComponent(id)}`
                    });

                    const data = await response.json();
                    if (data.success) {
                        const countSpan = button.querySelector('.like-count');
                        if (countSpan) countSpan.textContent = data.newLikeCount;

                        likedIds.add(id);
                        button.disabled = true;
                        button.textContent = `Liked (${data.newLikeCount})`;
                        button.classList.remove('btn-success');
                        button.classList.add('btn-secondary');

                        reloadPosts();
                    } else {
                        alert(data.message || "You already liked this image.");
                        likedIds.add(id);
                        button.disabled = true;
                        button.classList.remove('btn-success');
                        button.classList.add('btn-secondary');
                        button.textContent = 'Liked';
                    }
                } catch (err) {
                    console.error("Error liking image:", err);
                }
            });
        });
    }

    bindLikeButtons();

    // ===== Reload & Sort Posts =====
    function reloadPosts() {
        $.ajax({
            url: '/AIImage/Index',
            type: 'GET',
            success: function (data) {
                const container = $('#postsContainer');
                const newItems = $(data).find('#postsContainer .image-item');

                const sortedItems = newItems.toArray().sort((a, b) => {
                    const aCount = parseInt($(a).find('.like-count').text()) || 0;
                    const bCount = parseInt($(b).find('.like-count').text()) || 0;
                    return bCount - aCount;
                });

                // Detect if order changed
                const newOrder = sortedItems.map(item => item.id);
                const orderChanged = JSON.stringify(previousOrder) !== JSON.stringify(newOrder);
                previousOrder = newOrder;

                container.empty();
                sortedItems.forEach(item => container.append(item));

                reapplyAlternatingLayout();
                bindLikeButtons();

                // Animate only if order changed
                if (orderChanged) {
                    sortedItems.forEach(item => {
                        item.classList.remove('pop-animate');
                        void item.offsetWidth; // force reflow
                        item.classList.add('pop-animate');
                    });
                }
            },
            error: function () {
                console.error('Failed to reload posts.');
            }
        });
    }

    // ===== Alternating Layout & Colors =====
    function reapplyAlternatingLayout() {
        const items = document.querySelectorAll("#postsContainer .image-item");

        items.forEach((item, index) => {
            const row = item.querySelector(".row");
            if (!row) return;

            const cols = Array.from(row.children);
            if (cols.length !== 2) return;

            const [first, second] = cols;

            // For even index: image left, text right
            const imageIsFirst = first.querySelector("img") !== null;
            const shouldImageBeFirst = index % 2 === 0;

            if (imageIsFirst !== shouldImageBeFirst) {
                row.insertBefore(second, first);
            }

            // Apply alternating background color to the text box
            const textBox = item.querySelector(".text-box");
            if (textBox) {
                textBox.classList.remove('alt-bg-light', 'alt-bg-dark');
                textBox.classList.add(index % 2 === 0 ? 'alt-bg-light' : 'alt-bg-dark');
            }
        });
    }

    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const prefix = counter.getAttribute('data-prefix') || '';
                const suffix = counter.getAttribute('data-suffix') || '';
                let count = 0;
                const increment = target / 100;

                const updateCounter = () => {
                    count += increment;
                    if (count < target) {
                        counter.textContent = formatNumber(Math.ceil(count), prefix, suffix);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = formatNumber(target, prefix, suffix);
                    }
                };
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ===== Helper to format number =====
    function formatNumber(num, prefix = '', suffix = '') {
        return prefix + num.toLocaleString() + suffix;
    }

});