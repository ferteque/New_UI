/*

EPGenius.org

/

*/

// JavaScript Document

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');
    const mobileMenuCta = document.querySelector('.mobile-menu-cta');
    const mobileMenuCtaButton = document.querySelector('.mobile-menu-cta a');
    const mobileMenuLogo = document.querySelector('.mobile-menu-logo');

    // Check if essential elements exist
    if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
        return;
    }

    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        lockScroll();

        // Reset and trigger animations for links
        mobileMenuLinks.forEach((link, index) => {
            if (link) {
                link.style.animation = 'none';
                link.style.opacity = '0';
                link.style.transform = 'translateX(20px)';

                // Apply animation with delay
                setTimeout(() => {
                    if (link) {
                        link.style.animation = `slideInLeft 0.4s ease forwards`;
                    }
                }, 250 + (index * 100));
            }
        });

        // Animate CTA button
        if (mobileMenuCta) {
            mobileMenuCta.style.animation = 'none';
            mobileMenuCta.style.opacity = '0';
            mobileMenuCta.style.transform = 'translateY(20px)';

            setTimeout(() => {
                if (mobileMenuCta) {
                    mobileMenuCta.style.animation = 'slideInUp 0.4s ease forwards';
                }
            }, 100);
        }
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        unlockScroll();
    }

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close mobile menu
    mobileMenuClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
    });

    mobileMenuOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
    });

    // Close menu when clicking on navigation links
    mobileMenuLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        }
    });

    // Close menu when clicking on CTA button
    if (mobileMenuCtaButton) {
        mobileMenuCtaButton.addEventListener('click', (e) => {
            if (mobileMenuCtaButton.getAttribute('href') === '#') {
                e.preventDefault();
            }
            closeMobileMenu();
        });
    }

    // Close menu when clicking on logo
    if (mobileMenuLogo) {
        mobileMenuLogo.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Prevent body scroll when menu is open
    if (mobileMenu) {
        mobileMenu.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        });
    }
}

// Initialize mobile menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
    initializeMobileMenu();
}

// Config loader (add once at top level)
let config = {};
async function loadConfig() {
    try {
        const response = await fetch('/static/config.json');
        config = await response.json();
    } catch (err) {
        console.error('Config load failed:', err);
    }
}

// Provider SINGLE select
function initProviderSelect() {
    const providerSelect = document.getElementById('providerSelect');
    if (!providerSelect) return;
    
    const selected = providerSelect.querySelector('.select-selected');
    const items = providerSelect.querySelector('.select-items');
    const hiddenInput = document.getElementById('service_name');
    
    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        items.classList.toggle('select-hide');
        selected.classList.toggle('select-arrow-active');
    });
    
    items.querySelectorAll('div').forEach(option => {
        option.addEventListener('click', function() {
            selected.textContent = this.textContent;
            hiddenInput.value = this.dataset.value;
            items.classList.add('select-hide');
            selected.classList.remove('select-arrow-active');
        });
    });
    
    // Close when clicking outside
    document.addEventListener('click', function() {
        items.classList.add('select-hide');
        selected.classList.remove('select-arrow-active');
    });
}

// Countries MULTI select with ID parameter
function initCountriesSelect(selectId, hiddenInputId) {
    const countriesSelect = document.getElementById(selectId);
    if (!countriesSelect) return;
    
    if (countriesSelect.dataset.initialized === 'true') return;
    countriesSelect.dataset.initialized = 'true';
    
    const selected = countriesSelect.querySelector('.multi-selected');
    const items = countriesSelect.querySelector('.multi-items');
    const hiddenInput = document.getElementById(hiddenInputId);
    
    selected.addEventListener('click', function(e) {
        e.stopPropagation();
        items.classList.toggle('select-hide');
        selected.classList.toggle('multi-arrow-active');
    });
    
    items.querySelectorAll('div').forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateCountriesSelected();
        });
    });
    
    function updateCountriesSelected() {
        const selectedCountries = Array.from(items.querySelectorAll('.selected'))
            .map(el => el.dataset.value);
        hiddenInput.value = selectedCountries.join(',');
        selected.textContent = selectedCountries.length ? 
            `${selectedCountries.length} countries selected` : 
            'Countries';
    }
    
    document.addEventListener('click', function(e) {
        if (!countriesSelect.contains(e.target)) {
            items.classList.add('select-hide');
            selected.classList.remove('multi-arrow-active');
        }
    });
}

// Update populateCountriesSelect to work with both
function populateCountriesSelect(selectId) {
    const countriesItems = document.querySelector(`#${selectId} .multi-items`);
    if (!countriesItems || !config.countries) {
        return;
    }
    if (countriesItems.children.length === 0) {
        countriesItems.innerHTML = config.countries.map(c => 
            `<div data-value="${c}">${c}</div>`
        ).join('');
    }
}

// Update the initialization function
async function initShareDropdowns() {
    await loadConfig();
    populateProviderSelect();
    populateCountriesSelect('countriesSelectShare');
    populateCountriesSelect('countriesSelectUpdate');
    initProviderSelect();
    initCountriesSelect('countriesSelectShare', 'countriesShare');
    initCountriesSelect('countriesSelectUpdate', 'countriesUpdate');
}

function populateProviderSelect() {
    const providerItems = document.querySelector('#providerSelect .select-items');
    if (!providerItems || !config.providers) return;
    providerItems.innerHTML = config.providers.map(p => 
        `<div data-value="${p}">${p}</div>`
    ).join('');
}

// Scroll lock helpers
let scrollPosition = 0;

function lockScroll() {
    scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
}

function unlockScroll() {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
}

// Generate Matrix Rain Effect
function generateMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${i * 20}px`;
        column.style.animationDuration = `${Math.random() * 5 + 10}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;

        // Generate random characters for the column
        let text = '';
        const charCount = Math.floor(Math.random() * 20 + 10);
        for (let j = 0; j < charCount; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + ' ';
        }
        column.textContent = text;

        matrixRain.appendChild(column);
    }
}

// Generate Floating Particles
function generateParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 20}s`;

        particlesContainer.appendChild(particle);
    }
}

// Generate Data Streams
function generateDataStreams() {
    const dataStreams = document.getElementById('dataStreams');
    const streamCount = 10;

    for (let i = 0; i < streamCount; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.top = `${Math.random() * 100}%`;
        stream.style.left = `-300px`;
        stream.style.animationDelay = `${Math.random() * 5}s`;
        stream.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;

        dataStreams.appendChild(stream);
    }
}

// Initialize background effects
generateMatrixRain();
generateParticles();
generateDataStreams();

// Regenerate matrix rain on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const matrixRain = document.getElementById('matrixRain');
        matrixRain.innerHTML = '';
        generateMatrixRain();
    }, 250);
});

// Interactive mouse glow effect (throttled for performance)
let mouseTimer;
document.addEventListener('mousemove', (e) => {
    if (!mouseTimer) {
        mouseTimer = setTimeout(() => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Move orbs slightly based on mouse position
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.02;
                const x = (mouseX - window.innerWidth / 2) * speed;
                const y = (mouseY - window.innerHeight / 2) * speed;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });

            // Make nearby particles glow brighter (desktop only)
            if (window.innerWidth > 768) {
                const particles = document.querySelectorAll('.particle');
                particles.forEach(particle => {
                    const rect = particle.getBoundingClientRect();
                    const particleX = rect.left + rect.width / 2;
                    const particleY = rect.top + rect.height / 2;
                    const distance = Math.sqrt(Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2));

                    if (distance < 150) {
                        const brightness = 1 - (distance / 150);
                        particle.style.boxShadow = `0 0 ${20 + brightness * 30}px rgba(232, 212, 191, ${0.5 + brightness * 0.5})`;
                        particle.style.transform = `scale(${1 + brightness * 0.5})`;
                    } else {
                        particle.style.boxShadow = '';
                        particle.style.transform = '';
                    }
                });
            }

            mouseTimer = null;
        }, 16); // ~60fps
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default and scroll if href is more than just '#'
        if (href && href.length > 1) {
            e.preventDefault();
            if (href === '#top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(15, 8, 5, 0.95)';
        nav.style.boxShadow = '0 0 30px rgba(232, 212, 191, 0.2)';
    } else {
        nav.style.background = 'rgba(15, 8, 5, 0.9)';
        nav.style.boxShadow = 'none';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

// Button effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(232, 212, 191, 0.6)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// Stats counter animation
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        let count = 0;
        
        const duration = 1000;
        const steps = Math.min(target, 100);
        const increment = target / steps;
        const interval = duration / steps;
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                clearInterval(timer);
                count = target;
            }
            const suffix = stat.textContent.replace(/[\d]/g, '');
            stat.textContent = Math.floor(count) + suffix;
        }, interval);
    });
};

// Glitch effect on hover for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch1 0.3s ease-in-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
    });
});

// Random cyber text effects
const cyberTexts = ['CONNECTING...', 'CONNECTED TO EPGENIUS', 'PLAYLIST ACTIVE', 'EPG LOADED'];

setInterval(() => {
    const randomText = cyberTexts[Math.floor(Math.random() * cyberTexts.length)];
    const tempElement = document.createElement('div');
    tempElement.textContent = randomText;
    tempElement.style.cssText = `
        position: fixed;
        top: ${Math.random() * 100}vh;
        left: ${Math.random() * 100}vw;
        color: var(--primary-cyan);
        font-size: 0.8rem;
        font-weight: 700;
        z-index: 1000;
        opacity: 0.7;
        pointer-events: none;
        animation: fadeOut 3s ease-out forwards;
        text-shadow: 0 0 10px var(--primary-cyan);
    `;
    document.body.appendChild(tempElement);

    setTimeout(() => {
        document.body.removeChild(tempElement);
    }, 3000);
}, 5000);

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 0.7; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-50px); }
    }
`;
document.head.appendChild(style);

async function showDonateModal() {
    const modal = document.createElement('div');
    modal.id = 'donateLinksModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Donation Links</h3>
            </div>
            <div class="modal-body">
                <p style="text-align: center;">Loading donation links...</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    lockScroll();
    
    try {
        const response = await fetch('/playlists');
        const playlists = await response.json();
        
        const donations = playlists
            .filter(p => p.donation_info && p.donation_info !== '!')
            .reduce((acc, curr) => {
                if (!acc.find(d => d.user === curr.reddit_user)) {
                    acc.push({ user: curr.reddit_user, url: curr.donation_info });
                }
                return acc;
            }, [])
            .sort((a, b) => a.user.localeCompare(b.user));
        
        const donationButtons = donations
            .map(d => `<button class="donate-link-btn" data-url="${d.url}">Donate to ${d.user}</button>`)
            .join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Donation Links</h3>
                </div>
                <div class="modal-body">
                    <h3 style="color: var(--primary-cyan); text-align: center; margin: 0 0 1rem 0; font-size: 1.3rem;">Support EPGenius</h3>
                    <button class="donate-link-btn epgenius-donate" data-url="https://cwallet.com/tZK4DRBG5" style="width: 100%;">Donate to Ferteque</button>
                    <button class="donate-link-btn epgenius-donate" data-url="https://ko-fi.com/greenspeedracer" style="width: 100%; margin-bottom: 2rem;">Donate to greenspeedracer</button>
                    
                    <h3 style="color: var(--primary-cyan); text-align: center; margin: 0 0 1rem 0; font-size: 1.3rem;">Support Playlist Creators</h3>
                    ${donationButtons || '<p style="text-align: center;">No donation links available at this time.</p>'}
                </div>
                <div class="button-container" style="justify-content: center;">
                    <button class="modal-button" id="closeDonateModalBtn">Go Back</button>
                </div>
            </div>
        `;
        
        modal.querySelectorAll('.donate-link-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.open(btn.dataset.url, '_blank', 'noopener,noreferrer');
            });
        });
        
        const closeBtn = modal.querySelector('#closeDonateModalBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeDonateModal);
        }
        
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeDonateModal();
            }
        });
        
    } catch (error) {
        console.error('Error fetching donation links:', error);
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Donation Links</h3>
                </div>
                <div class="modal-body">
                    <p style="text-align: center; color: var(--primary-orange);">Failed to load donation links. Please try again later.</p>
                </div>
                <div class="button-container" style="justify-content: center;">
                    <button class="modal-button" id="closeDonateModalBtn">Go Back</button>
                </div>
            </div>
        `;
        
        const closeBtn = modal.querySelector('#closeDonateModalBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeDonateModal);
        }
    }
}

function closeDonateModal() {
  const modal = document.getElementById('donateLinksModal');
  if (modal) {
    modal.remove();
  }
  document.getElementById('playlistModal').style.display = 'block';
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const disclaimerModal = document.getElementById('disclaimerModal');
    const playlistModal = document.getElementById('playlistModal');
    const shareCategoriesModal = document.getElementById('shareCategoriesModal');
    
    if (event.target === disclaimerModal) {
        disclaimerModal.style.display = "none";
        unlockScroll();
    }
    if (event.target === playlistModal) {
        playlistModal.style.display = "none";
        unlockScroll();
    }
    if (event.target === shareCategoriesModal) {
        shareCategoriesModal.style.display = "none";
        unlockScroll();
    }
});

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active from all tabs and content
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Add active to clicked tab
        tab.classList.add('active');

        // Show corresponding content
        const targetId = tab.dataset.tab;
        document.getElementById(targetId).classList.add('active');
    });
});

// Store playlist data globally
let playlistsData = [];

// Load playlists dynamically
function loadPlaylists() {
    fetch("/playlists")
        .then(res => res.json())
        .then(data => {
            playlistsData = data; // Store the data
            renderPlaylists(data); // Render the cards

            // Calculate total downloads from playlist data
            const totalDownloads = data.reduce((sum, playlist) => sum + (Number(playlist.clicks) || 0), 0);
            const totalPlaylists = data.length;

            // Update stats header
            const downloadsStat = document.querySelector('.stats-grid .stat-item:nth-child(3) .stat-number');
            const playlistsStat = document.querySelector('.stats-grid .stat-item:nth-child(1) .stat-number');
            if (downloadsStat) {
                downloadsStat.textContent = totalDownloads;    
            }
            if (playlistsStat) {
                playlistsStat.textContent = totalPlaylists;
            }

            animateStats();
        })
        .catch(err => console.error('Error loading playlists:', err));
}

// Render playlist cards
function renderPlaylists(data) {
    const tileContainer = document.getElementById("tileContainer");
    tileContainer.innerHTML = ''; // Clear existing content

    data.forEach((row) => {
        const card = document.createElement("div");
        card.className = "playlist-card";

        const [day, month, year] = row.timestamp.split('/');
        const date = new Date(year, month - 1, day);
        const formattedDate = date.toLocaleDateString();

        card.innerHTML = `
            <h3>${row.id}. ${row.reddit_user} | ${row.service_name}</h3>
            <ul class="plan-playlists">
                <li>
                    <div class="label">Countries</div>
                    <div class="value limited-text">${row.countries}</div>
                </li>
                <li>
                    <div class="label">Categories</div>
                    <div class="value limited-text">${row.main_categories}</div>
                </li>
                <li>
                    <div class="label">Last Updated</div>
                    <div class="value">${formattedDate}</div>
                </li>
                <li>
                    <div class="label">Downloads</div>
                    <div class="value">${row.clicks}</div>
                </li>
            </ul>
        `;

        // attach owner for this card
        card.dataset.owner = row.reddit_user;

        // click handler for this card
        card.addEventListener('click', function () {
            const owner = this.dataset.owner || '';
            window.currentPlaylistOwner = owner;
            window.currentPlaylistId = row.id;
            window.currentDonationLink = row.donation_info || null;
            window.currentEpgUrl = row.github_epg_url || null;

            const disclaimerModal = document.getElementById('disclaimerModal');
            lockScroll();
            disclaimerModal.style.display = "block";
        });

        tileContainer.appendChild(card);
    });
}

// one-time handler for agree button (OUTSIDE renderPlaylists)
document.getElementById('agreeBtn').addEventListener('click', function () {
    const disclaimerModal = document.getElementById('disclaimerModal');
    const playlistModal = document.getElementById('playlistModal');
    const owner = window.currentPlaylistOwner || '';

    // Wire donate button
    const donateBtn = document.getElementById('donateBtn');
    donateBtn.onclick = function() {
        disclaimerModal.style.display = 'none';
        playlistModal.style.display = 'none';
        showDonateModal();
    };

    disclaimerModal.style.display = "none";
    playlistModal.style.display = "block";
});

// Manual button - opens manual modal
document.getElementById('manualBtn').addEventListener('click', function() {
    const epgUrl = window.currentEpgUrl;

    document.getElementById('manualEpgLink').value = epgUrl || 'No EPG available';

    document.getElementById('playlistModal').style.display = 'none';
    document.getElementById('manualModal').style.display = 'block';
});

// Download M3U button - calls /manual and downloads
document.getElementById('downloadM3uBtn').addEventListener('click', async function() {
    const selectedID = window.currentPlaylistId;
    const btn = this;
    btn.disabled = true;
    btn.textContent = 'Downloading...';

    try {
        const response = await fetch('/manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedID })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        const filename = `raw_playlist_${selectedID}.m3u`;
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        btn.textContent = 'Downloaded!';
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'Download M3U';
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        alert('Error downloading M3U file');
        btn.disabled = false;
        btn.textContent = 'Download M3U';
    }
});

// Copy EPG button
document.getElementById('copyEpgBtn').addEventListener('click', function() {
    const input = document.getElementById('manualEpgLink');
    if (input.value === 'No EPG available') {
        alert('No EPG URL available');
        return;
    }
    navigator.clipboard.writeText(input.value).then(() => {
        this.textContent = 'Copied!';
        setTimeout(() => this.textContent = 'Copy', 2000);
    });
});

// Close manual modal
document.getElementById('closeManualBtn').addEventListener('click', function() {
    document.getElementById('manualModal').style.display = 'none';
    document.getElementById('playlistModal').style.display = 'block';
});

// Preview List + EPG button
document.getElementById('previewBtn').addEventListener('click', function() {
    const id = window.currentPlaylistId;
    const epgUrl = window.currentEpgUrl;

    if (!id) {
        alert('No playlist selected.');
        return;
    }

    // const m3uUrl = `${window.location.origin}/m3u/${id}`;
    // const targetUrl = `${window.location.origin}/epgdisplayer?m3u=${encodeURIComponent(m3uUrl)}&epg=${encodeURIComponent(epgUrl || '')}`;

    const m3uUrl = `/m3u/${id}`;
    const targetUrl = `/epgdisplayer?m3u=${encodeURIComponent(m3uUrl)}&epg=${encodeURIComponent(epgUrl || '')}`;

    window.open(targetUrl, '_blank', 'noopener');
});

// Google Drive button in playlist modal
document.querySelector('#playlistModal .button-container button:first-child').addEventListener('click', function() {
    document.getElementById('playlistModal').style.display = 'none';
    document.getElementById('googleDriveModal').style.display = 'block';
    watchFormatInputs();
});

document.getElementById('cancelDriveBtn').addEventListener('click', function() {
    document.getElementById('googleDriveModal').style.display = 'none';
    document.getElementById('playlistModal').style.display = 'block';
});

// Sort and re-render playlists
function sortPlaylists(sortBy) {
    let sortedData = [...playlistsData]; // Create a copy
    
    switch(sortBy) {
        case 'ID':
            sortedData.sort((a, b) => a.id - b.id);
            break;
        case 'Downloads':
            sortedData.sort((a, b) => b.clicks - a.clicks); // Descending
            break;
        case 'LastModified':
            sortedData.sort((a, b) => {
                const dateA = parseDate(a.timestamp);
                const dateB = parseDate(b.timestamp);
                return dateB - dateA; // Most recent first
            });
            break;
        case 'Service':
            sortedData.sort((a, b) => a.service_name.localeCompare(b.service_name));
            break;
        case 'ListOwner':
            sortedData.sort((a, b) => a.reddit_user.localeCompare(b.reddit_user));
            break;
    }
    
    renderPlaylists(sortedData);
}

// Helper function to parse dd/mm/yyyy dates
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}

// Open the playlist modal with the selected playlist data
function openPlaylistModal(playlistData) {
    window.selectedPlaylist = playlistData;
    const playlistModal = document.getElementById('playlistModal');
    playlistModal.style.display = 'block';
}

// Custom dropdown functionality
function initCustomSelect() {
    const selectSelected = document.querySelector('.select-selected');
    const selectItems = document.querySelector('.select-items');
    const options = selectItems.querySelectorAll('div');

    // Toggle dropdown
    selectSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('select-arrow-active');
        selectItems.classList.toggle('select-hide');
        
        // Update which option to hide based on current selection
        updateDropdownOptions();
    });

    // Handle option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            selectSelected.textContent = this.textContent;
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
            
            // Update dropdown to hide newly selected option
            updateDropdownOptions();
            
            // Trigger sorting
            sortPlaylists(value);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        selectItems.classList.add('select-hide');
        selectSelected.classList.remove('select-arrow-active');
    });

    // Function to hide currently selected option
    function updateDropdownOptions() {
        const currentValue = selectSelected.textContent.trim();
        options.forEach(option => {
            if (option.textContent.trim() === currentValue) {
                option.style.display = 'none';
            } else {
                option.style.display = '';
            }
        });
    }

    // Initialize on load
    updateDropdownOptions();
}

// Supporter Update Categories button
document.getElementById('categoriesBtn').addEventListener('click', function() {
    document.getElementById('playlistModal').style.display = 'none';
    document.getElementById('categoriesModal').style.display = 'block';
    loadCategories(window.currentPlaylistId);
});

// Load categories table
async function loadCategories(id) {
    try {
        const response = await fetch(`/get_categories/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const container = document.getElementById("categoriesContainer");
        container.innerHTML = "";

        const table = document.createElement('table');
        table.classList.add('categories-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const thAutoUpdate = document.createElement('th');
        thAutoUpdate.textContent = "Enabled";

        const thCategoryName = document.createElement('th');
        thCategoryName.textContent = "Category";

        headerRow.appendChild(thAutoUpdate);
        headerRow.appendChild(thCategoryName);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        data.groups.forEach(group => {
            const row = document.createElement('tr');

            const checkboxCell = document.createElement('td');
            const sortValue = (group.auto_update === true || group.auto_update === 1) ? '1' : '0';
            checkboxCell.dataset.sortValue = sortValue;
            checkboxCell.textContent = sortValue === '1' ? '✅' : '❌';

            const labelCell = document.createElement('td');
            labelCell.textContent = group.name;

            row.appendChild(checkboxCell);
            row.appendChild(labelCell);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);

        makeCategoriesTableSortable(table);
    } catch (error) {
        console.error('Error loading categories:', error);
        document.getElementById("categoriesContainer").innerHTML =
            '<p>Error loading categories. Please try again.</p>';
    }
}

function makeCategoriesTableSortable(table) {
    const headers = table.querySelectorAll('th');
    headers.forEach((th, colIndex) => {
        th.style.cursor = 'pointer';
        let asc = true;

        th.addEventListener('click', () => {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));

            rows.sort((a, b) => {
                const aCell = a.children[colIndex];
                const bCell = b.children[colIndex];

                const aVal = colIndex === 0
                    ? (aCell.dataset.sortValue || '0')
                    : aCell.textContent.toLowerCase();
                const bVal = colIndex === 0
                    ? (bCell.dataset.sortValue || '0')
                    : bCell.textContent.toLowerCase();

                if (aVal < bVal) return asc ? -1 : 1;
                if (aVal > bVal) return asc ? 1 : -1;
                return 0;
            });

            rows.forEach(row => tbody.appendChild(row));
            asc = !asc;
        });
    });
}

// Categories modal close handlers
document.getElementById('closeCategoriesBtn').addEventListener('click', function() {
    document.getElementById('categoriesModal').style.display = 'none';
    document.getElementById('playlistModal').style.display = 'block';
});

// watchFormatInputs initialization
function watchFormatInputs() {
    const m3uInput = document.getElementById('m3u');
    const xtreamInputs = [
        document.getElementById('dns'), 
        document.getElementById('username'), 
        document.getElementById('password')
    ];

    function checkM3U() {
        const hasText = m3uInput.value.trim().length > 0;
        xtreamInputs.forEach(input => input.disabled = hasText);
    }

    function checkXtream() {
        const hasText = xtreamInputs.some(input => input.value.trim().length > 0);
        m3uInput.disabled = hasText;
    }

    // Clear any existing listeners
    m3uInput.oninput = null;
    xtreamInputs.forEach(input => input.oninput = null);

    // Add listeners
    m3uInput.oninput = checkM3U;
    xtreamInputs.forEach(input => input.oninput = checkXtream);
}

// Run it directly when Google Drive modal opens (in your Google Drive button handler)
document.querySelector('#playlistModal .button-container button:first-child').addEventListener('click', function() {
    document.getElementById('playlistModal').style.display = 'none';
    document.getElementById('googleDriveModal').style.display = 'block';
    watchFormatInputs(); 
});

// uploadToGoogleDrive
const CLIENT_ID = '385455010248-stgruhhb6geh32kontlgi7g929tmfgqa.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

async function uploadToGoogleDrive(blob, filename, listID) {
    return new Promise((resolve, reject) => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (response) => {
                if (response.error) {
                    reject(response);
                    return;
                }
                
                try {
                    const accessToken = response.access_token;
                    
                    const metadata = {
                        name: filename,
                        mimeType: 'application/octet-stream'
                    };
                    
                    const form = new FormData();
                    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                    form.append('file', blob);
                    
                    const uploadRes = await fetch(
                        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
                        {
                            method: 'POST',
                            headers: { 'Authorization': 'Bearer ' + accessToken },
                            body: form
                        }
                    );
                    
                    const { id: fileId } = await uploadRes.json();
                    
                    await fetch(
                        `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + accessToken,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                role: 'writer',
                                type: 'user',
                                emailAddress: 'ferteque@repository-456118.iam.gserviceaccount.com'
                            })
                        }
                    );
                    
                    await fetch(
                        `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + accessToken,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                role: 'reader',
                                type: 'anyone'
                            })
                        }
                    );
                    
                    await fetch('/api/files', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ list_id: listID, drive_file_id: fileId, filename })
                    });
                    
                    resolve({ fileId, downloadLink: `https://drive.usercontent.google.com/download?id=${fileId}&confirm=t` });
                    
                } catch (err) {
                    reject(err);
                }
            }
        });
        
        tokenClient.requestAccessToken({ prompt: '' });
    });
}

function showDriveLoading() {
    document.getElementById('uploadDriveBtn').disabled = true;
    document.getElementById('uploadDriveBtn').textContent = 'Processing...';
}

function hideDriveLoading() {
    document.getElementById('uploadDriveBtn').disabled = false;
    document.getElementById('uploadDriveBtn').textContent = 'Upload to Google Drive';
}

// Click Upload to Google Drive
document.getElementById('uploadDriveBtn').addEventListener('click', async function () {
    const m3uInput = document.getElementById('m3u').value.trim();
    const hostInput = document.getElementById('dns').value.trim();
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value.trim();

    let dns, username, password;

    if (m3uInput) {
        try {
            const url = new URL(m3uInput);
            const params = new URLSearchParams(url.search);
            username = params.get('username');
            password = params.get('password');
            dns = url.host;

            if (!username || !password) {
                alert('The entered URL is not correct. Follow the placeholder example or use Xtream credentials instead.');
                return;
            }
        } catch (e) {
            alert('Invalid M3U URL');
            return;
        }
    } else if (hostInput || userInput || passInput) {
        if (!hostInput || !userInput || !passInput) {
            alert('Please fill in DNS, username, and password, or clear them and use M3U.');
            return;
        }
        dns = hostInput.replace(/^https?:\/\/|\/$/g, '');
        username = userInput;
        password = passInput;
    } else {
        alert('Please provide either an M3U URL or Xtream credentials.');
        return;
    }

    const selectedID = window.currentPlaylistId;
    if (!selectedID) {
        alert('No playlist selected.');
        return;
    }

    showDriveLoading();

    try {
        const response = await fetch('/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedID, dns, username, password })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const disposition = response.headers.get('Content-Disposition');
        let filename = `modified_playlist_${selectedID}.m3u`;
        if (disposition && disposition.indexOf('filename=') !== -1) {
            const match = disposition.match(/filename="?([^"]+)"?/);
            if (match && match[1]) filename = match[1];
        }

        const blob = await response.blob();
        const result = await uploadToGoogleDrive(blob, filename, selectedID);

        document.getElementById('googleDriveModal').style.display = 'none';

        const epgUrl = window.currentEpgUrl || 'No EPG available';

        const playlistUrl = `https://drive.usercontent.google.com/download?id=${result.fileId}&confirm=t`;

        document.getElementById('drivePlaylistLink').value = playlistUrl;
        document.getElementById('driveEpgLink').value = epgUrl;
        document.getElementById('driveSuccessModal').style.display = 'block';

    } catch (err) {
        console.error(err);
        alert('Failed to process or upload to Google Drive.');
    } finally {
        hideDriveLoading();
    }
});

function submitPlaylist(formData) {
    console.log('submitPlaylist called');
    fetch('/upload_playlist', {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        console.log('Response received:', response.status); 
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Response data:', data);

        document.getElementById('Wait4').style.display = 'none';
        
        if (data.error) return alert(data.error);

        const container = document.getElementById('shareGroupList');
        container.innerHTML = '';

        const table = document.createElement('table');
        table.style.cssText = 'width: 100%; border-collapse: collapse; margin: 1rem 0;';

        data.groups.forEach(group => {
            const row = document.createElement('tr');
            row.style.cssText = 'cursor: pointer; height: 50px; background: rgba(255,255,255,0.05);';

            const checkboxCell = document.createElement('td');
            checkboxCell.style.cssText = 'padding: 1rem; width: 60px; text-align: center; vertical-align: middle;';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = group.id;
            checkbox.style.cssText = 'width: 20px; height: 20px; accent-color: cyan;';
            checkboxCell.appendChild(checkbox);

            const labelCell = document.createElement('td');
            labelCell.style.cssText = 'padding: 1rem; color: white; font-size: 15px; vertical-align: middle;';
            labelCell.textContent = group.name;

            row.appendChild(checkboxCell);
            row.appendChild(labelCell);
            table.appendChild(row);
            
            row.addEventListener('click', function (e) {
                if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
            });
        });

        container.appendChild(table);

        // Show share categories modal
        document.getElementById("shareModal").style.display = 'none';
        document.getElementById("shareCategoriesModal").style.display = "flex";
        document.getElementById('shareSelect_categories').style.display = 'block';
        document.getElementById("shareSubmitGroups").style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('Wait4').style.display = 'none';
        alert('Error uploading M3U file');
    });
}

function submitShareGroups() {
    const checkboxes = document.querySelectorAll('#shareGroupList input[type="checkbox"]');
    const selectedGroups = Array.from(checkboxes).map(cb => ({
        id: parseInt(cb.value),
        auto_update: cb.checked ? 1 : 0
    }));

    fetch('/save_selected_groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groups: selectedGroups })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
    })
    .then(data => {
            document.getElementById("shareSubmitGroups").style.display = "none";
            document.getElementById('shareGroupList').style.display = "none";
            document.getElementById('shareSelect_categories').style.display = 'none';
            
            const successMsg = document.getElementById("shareSuccessMsg");
            const successButtons = document.getElementById("shareSuccessButtons");
            successMsg.textContent = "Playlist successfully submitted! Thanks for contributing!";
            successMsg.className = "status-success";
            successMsg.style.display = "block";
            successButtons.style.display = "flex";
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error saving groups");
        });
    }

function updatePlaylist(formData) {
    fetch('/update_playlist', {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        document.getElementById('Wait5').style.display = 'none';
        
        if (data.error) return alert(data.error);

        const container = document.getElementById('shareGroupList');
        container.innerHTML = '';

        const table = document.createElement('table');
        table.style.cssText = 'width: 100%; border-collapse: collapse; margin: 1rem 0;';

        data.groups.forEach(group => {
            const row = document.createElement('tr');
            row.style.cssText = 'cursor: pointer; height: 50px; background: rgba(255,255,255,0.05);';

            const checkboxCell = document.createElement('td');
            checkboxCell.style.cssText = 'padding: 1rem; width: 60px; text-align: center; vertical-align: middle;';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = group.id;
            if (group.auto_update === 1) checkbox.checked = true;  
            checkbox.style.cssText = 'width: 20px; height: 20px; accent-color: cyan;';
            checkboxCell.appendChild(checkbox);

            const labelCell = document.createElement('td');
            labelCell.style.cssText = 'padding: 1rem; color: white; font-size: 15px; vertical-align: middle;';
            labelCell.textContent = group.name;

            row.appendChild(checkboxCell);
            row.appendChild(labelCell);
            table.appendChild(row);
            
            row.addEventListener('click', function (e) {
                if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
            });
        });

        container.appendChild(table);

        document.getElementById("updateModal").style.display = 'none';
        document.getElementById("shareCategoriesModal").style.display = "flex";
        document.getElementById('shareSelect_categories').style.display = 'block';
        document.getElementById("shareSubmitGroups").style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('Wait5').style.display = 'none';
        alert("Incorrect List ID or Password");
    });
}

//Edit Credentials
function editCredentials(formData) {
    const statusEl = document.getElementById("editCredsStatus");
    const waitEl = document.getElementById("Wait6");

    function showStatus(message, type = "info") {
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-${type}`;
            statusEl.style.display = "block";
        } else {
            alert(message);
        }
    }

    fetch('/edit_creds_file', {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        const data = await response.json().catch(() => null);

        if (waitEl) waitEl.style.display = "none";

        if (!response.ok) {
            const message = data?.error || 'Unknown server error';
            showStatus(message, "error");
            throw new Error(message);
        }

        if (data?.error) {
            showStatus(data.error, "error");
        } else {
            showStatus("Credentials Updated!", "success");
            console.log("✅ File updated successfully:", data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (waitEl) waitEl.style.display = "none";
        showStatus(error.message || 'Network error', "error");
    });
}

function openHowtoModal(imageSrc) {
    const modal = document.getElementById('howtoImageModal');
    const modalImg = document.getElementById('howtoModalImage');
    modal.style.display = "block";
    modalImg.src = imageSrc;
    document.body.style.overflow = 'hidden';
}

const botons = document.querySelectorAll('.step-thumb');

botons.forEach(boto => {
    boto.addEventListener('click', (e) => {
	const rutaImatge = e.target.src;
        openHowtoModal(rutaImatge);
    });
});

function closeHowtoModal() {
    const modal = document.getElementById('howtoImageModal');
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
}

const modal = document.getElementById('howtoImageModal');
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'howtoImageModal' || e.target.classList.contains('howto-modal-close')) {
            closeHowtoModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeHowtoModal();
    }
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadPlaylists();
    initCustomSelect();

    document.querySelectorAll(".password-wrapper").forEach(wrapper => {
        const input = wrapper.querySelector("input");
        const btn = wrapper.querySelector(".toggle-password");
        if (!input || !btn) return;

        const openEye = btn.querySelector(".eye-open");
        const closedEye = btn.querySelector(".eye-closed");

        btn.addEventListener("click", () => {
            const show = input.type === "password";
            input.type = show ? "text" : "password";

            openEye.style.display = show ? "none" : "block";
            closedEye.style.display = show ? "block" : "none";
        });
    });
    
    // Add sorting listener
    const orderBySelect = document.getElementById('orderBy');
    if (orderBySelect) {
        orderBySelect.addEventListener('change', (e) => {
            sortPlaylists(e.target.value);
        });
    }
    
    // Share Playlist Modal handlers
    const sharePlaylistBtn = document.getElementById('sharePlaylistBtn');
    if (sharePlaylistBtn) {
        sharePlaylistBtn.addEventListener('click', () => {
            document.getElementById('shareModal').style.display = 'block';
            setTimeout(initShareDropdowns, 300);
        });
    }
    
    const closeShareModal = document.getElementById('closeShareModal');
    if (closeShareModal) {
        closeShareModal.addEventListener('click', () => {
            document.getElementById('shareModal').style.display = 'none';
        });
    }

    const cancelShareBtn = document.getElementById('cancelShareBtn');
    if (cancelShareBtn) {
        cancelShareBtn.addEventListener('click', () => {
            document.getElementById('shareModal').style.display = 'none';
        });
    }

    const closeShareCategoriesModal = document.getElementById('closeShareCategoriesModal');
    if (closeShareCategoriesModal) {
        closeShareCategoriesModal.addEventListener('click', () => {
            document.getElementById('shareCategoriesModal').style.display = 'none';
        });
    }

    const shareSubmitGroupsBtn = document.getElementById('shareSubmitGroups');
    if (shareSubmitGroupsBtn) {
        shareSubmitGroupsBtn.addEventListener('click', submitShareGroups);
    }
    
    const closeCategoriesModal = document.getElementById('closeCategoriesModal');
    if (closeCategoriesModal) {
        closeCategoriesModal.addEventListener('click', () => {
            document.getElementById('categoriesModal').style.display = 'none';
        });
    }
    
    const submitPlaylistForm = document.getElementById('submitPlaylistForm');
    if (submitPlaylistForm) {
        submitPlaylistForm.addEventListener('submit', function(e) { 
            e.preventDefault();
            console.log('Form submitted');
            
            const formData = new FormData(this);
            console.log('FormData created');
            
            document.getElementById('Wait4').style.display = 'block';
            submitPlaylist(formData);
        });
    }
    
    const submitSelectedGroupsBtn = document.getElementById('submitSelectedGroups');
    if (submitSelectedGroupsBtn) {
        submitSelectedGroupsBtn.addEventListener('click', submitSelectedGroups);
    }

    const updatePlaylistBtn = document.getElementById('updatePlaylistBtn');
    if (updatePlaylistBtn) {
        updatePlaylistBtn.addEventListener('click', () => {
            document.getElementById('updateModal').style.display = 'block';
            setTimeout(initShareDropdowns, 300);
        });
    }

    const closeUpdateModal = document.getElementById('closeUpdateModal');
    if (closeUpdateModal) {
        closeUpdateModal.addEventListener('click', () => {
            document.getElementById('updateModal').style.display = 'none';
        });
    }

    const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
    if (cancelUpdateBtn) {
        cancelUpdateBtn.addEventListener('click', () => {
            document.getElementById('updateModal').style.display = 'none';
        });
    }

    const updatePlaylistForm = document.getElementById('updatePlaylistForm');
    if (updatePlaylistForm) {
        updatePlaylistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            document.getElementById('Wait5').style.display = 'block';
            updatePlaylist(formData);
        });
    }

    const editCredentialsBtn = document.getElementById('editCredentialsBtn');
    if (editCredentialsBtn) {
        editCredentialsBtn.addEventListener('click', () => {
            document.getElementById('editCredsModal').style.display = 'block';
        });
    }

    const closeEditCreds = document.getElementById('closeEditCreds');
    if (closeEditCreds) {
        closeEditCreds.addEventListener('click', () => {
            document.getElementById('editCredsModal').style.display = 'none';
        });
    }

    const cancelEditCreds = document.getElementById('cancelEditCreds');
    if (cancelEditCreds) {
        cancelEditCreds.addEventListener('click', () => {
            document.getElementById('editCredsModal').style.display = 'none';
        });
    }

    const editCredsForm = document.getElementById('editCredsForm');
    if (editCredsForm) {
        editCredsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            document.getElementById('Wait6').style.display = 'block';
            editCredentials(formData);
        });
    }

    const closeShareSuccessBtn = document.getElementById("closeShareSuccessBtn");
    if (closeShareSuccessBtn) {
        closeShareSuccessBtn.addEventListener('click', () => {
            document.getElementById("shareCategoriesModal").style.display = 'none';
        });
    }

    const closeSuccessBtn = document.getElementById("closeSuccessBtn");
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            document.getElementById("editCredentialsModal").style.display = 'none';
        });
    }

    const driveSuccessModal = document.getElementById('driveSuccessModal');
    if (driveSuccessModal) {
        const mobileCloseBtn = driveSuccessModal.querySelector('.mobile-close-btn');
        if (mobileCloseBtn) {
            mobileCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                driveSuccessModal.style.display = 'none';
                unlockScroll();
            });
        }
    }

    const copyPlaylistBtn = document.getElementById('copyPlaylistBtn');
    if (copyPlaylistBtn) {
        copyPlaylistBtn.addEventListener('click', function() {
            const input = document.getElementById('drivePlaylistLink');
            navigator.clipboard.writeText(input.value).then(() => {
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = 'Copy';
                }, 2000);
            });
        });
    }

    const copyDriveEpgBtn = document.getElementById('copyDriveEpgBtn');
    if (copyDriveEpgBtn) {
        copyDriveEpgBtn.addEventListener('click', function() {
            const input = document.getElementById('driveEpgLink');
            if (input.value === 'No EPG available') {
                alert('No EPG URL available');
                return;
            }
            navigator.clipboard.writeText(input.value).then(() => {
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = 'Copy';
                }, 2000);
            });
        });
    }

    const closeDriveSuccessBtn = document.getElementById('closeDriveSuccessBtn');
    if (closeDriveSuccessBtn) {
        closeDriveSuccessBtn.addEventListener('click', () => {
            document.getElementById('driveSuccessModal').style.display = 'none';
        });
    }

    const nextStepsBtn = document.getElementById('nextStepsBtn');
    if (nextStepsBtn) {
        nextStepsBtn.addEventListener('click', () => {
            const newWindow = window.open('', '_blank');
            newWindow.location.href = window.location.origin + '/#step5';
            setTimeout(() => {
                newWindow.document.querySelector('[data-tab="howto"]').click();
                const step5 = newWindow.document.getElementById('step5');
                const navHeight = 78;
                const elementPosition = step5.getBoundingClientRect().top;
                const offsetPosition = elementPosition + newWindow.pageYOffset - navHeight;
                newWindow.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 500);
        });
    }

    const registerInstructionsBtn = document.getElementById('registerInstructionsBtn');
    if (registerInstructionsBtn) {
        registerInstructionsBtn.addEventListener('click', () => {
            const newWindow = window.open('', '_blank');
            newWindow.location.href = window.location.origin + '/#step6';
            setTimeout(() => {
                newWindow.document.querySelector('[data-tab="howto"]').click();
                const step6 = newWindow.document.getElementById('step6');
                const navHeight = 78;
                const elementPosition = step6.getBoundingClientRect().top;
                const offsetPosition = elementPosition + newWindow.pageYOffset - navHeight;
                newWindow.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 500);
        });
    }
});






