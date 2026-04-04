// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-04TNP3T1WR');

// Simple snap loading animation
window.addEventListener('load', function () {
    const loadingAnimation = document.getElementById('loadingAnimation');
    if (loadingAnimation) {
        setTimeout(() => {
            loadingAnimation.style.display = 'none';
        }, 100);
    }
});

// Scroll indicator
const scrollIndicator = document.getElementById('scrollIndicator');
if (scrollIndicator) {
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollIndicator.classList.add('visible');
        } else {
            scrollIndicator.classList.remove('visible');
        }
    });

    scrollIndicator.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navbar scroll effect and mobile menu
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        const spans = mobileMenu.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                navLinks.classList.remove('active');
                const spans = mobileMenu.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}

// Brutalist Intersection Observer (Pop In)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-entrance, .fade-in, .slide-in-left, .slide-in-right, .feature-card').forEach(el => {
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 50);
}

const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent) || 0;
                if (target > 0) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Office Bearers Year selector functionality
document.addEventListener('DOMContentLoaded', function () {
    const yearRadios = document.querySelectorAll('input[name="year"]');
    const teamGrids = document.querySelectorAll('.team-grid');

    yearRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            teamGrids.forEach(grid => grid.classList.remove('active'));
            const selectedGrid = document.getElementById(`team-${this.value}`);
            if (selectedGrid) {
                selectedGrid.classList.add('active');
            }
        });
    });
});

// FAQ Toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Hero animations matching brutalist style
window.addEventListener('load', function () {
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const desc = document.querySelector('.hero-description');
    const cta = document.querySelector('.hero-cta');

    if (title) title.classList.add('pop-in');
    setTimeout(() => { if (subtitle) subtitle.classList.add('pop-in'); }, 100);
    setTimeout(() => { if (desc) desc.classList.add('pop-in'); }, 200);
    setTimeout(() => { if (cta) cta.classList.add('pop-in'); }, 300);

    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const parallaxItems = document.querySelectorAll('.hero-visuals [data-speed]');

    if (hero && parallaxItems.length) {
        hero.addEventListener('pointermove', (event) => {
            const rect = hero.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const offsetY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            const shiftX = offsetX * 36;
            const shiftY = offsetY * 26;
            const noiseX = offsetX * 10;
            const noiseY = offsetY * 10;
            const noiseStrength = Math.min(0.32, Math.max(0, Math.abs(offsetX) + Math.abs(offsetY)) * 0.16);
            const contentX = offsetX * 18;
            const contentY = offsetY * 12;
            const contentRotate = offsetX * 3;

            hero.style.setProperty('--hero-shift-x', `${shiftX}px`);
            hero.style.setProperty('--hero-shift-y', `${shiftY}px`);
            hero.style.setProperty('--hero-noise-x', `${noiseX}`);
            hero.style.setProperty('--hero-noise-y', `${noiseY}`);
            hero.style.setProperty('--hero-noise', `${noiseStrength}`);

            if (heroContent) {
                heroContent.style.transform = `translate(${contentX}px, ${contentY}px) rotate(${contentRotate}deg)`;
            }

            parallaxItems.forEach(item => {
                const speed = parseFloat(item.dataset.speed) || 0.12;
                const action = item.dataset.action || 'follow';
                const base = item.dataset.base || '';
                const multiplier = action === 'repel' ? -1.8 : 1.5;
                const x = offsetX * 48 * speed * multiplier;
                const y = offsetY * 38 * speed * multiplier;
                const rotate = offsetX * 14 * speed * (action === 'repel' ? -1 : 1);
                item.style.transform = `${base} translate(${x}px, ${y}px) rotate(${rotate}deg)`;
                item.style.opacity = `${0.78 + Math.min(0.42, Math.abs(offsetX * offsetY) * 0.42)}`;
            });
        });

        hero.addEventListener('pointerleave', () => {
            hero.style.setProperty('--hero-shift-x', '0px');
            hero.style.setProperty('--hero-shift-y', '0px');
            hero.style.setProperty('--hero-noise-x', '0px');
            hero.style.setProperty('--hero-noise-y', '0px');
            hero.style.setProperty('--hero-noise', '0');
            if (heroContent) {
                heroContent.style.transform = 'translate(0px, 0px) rotate(0deg)';
            }
            parallaxItems.forEach(item => {
                const base = item.dataset.base || '';
                item.style.transform = base ? `${base} translate(0px, 0px)` : 'translate(0px, 0px)';
                item.style.opacity = '';
            });
        });
    }
});

// Benefits Data with Font Awesome Icons
const benefitsData = [
    {
        icon: '<i class="fas fa-book-open fa-3x"></i>',
        title: 'IEEE eLearning Library',
        description: 'A vast digital library with numerous in-demand courses and research papers.'
    },
    {
        icon: '<i class="fas fa-envelope fa-3x"></i>',
        title: 'Free @ieee.org Email',
        description: 'With GoogleApps@IEEE, members gain robust messaging capabilities with email, calendar, and contact services.'
    },
    {
        icon: '<i class="fas fa-graduation-cap fa-3x"></i>',
        title: 'Scholarships & Grants',
        description: 'IEEE offers a variety of scholarships, grants, and fellowships for IEEE Student members.'
    },
    {
        icon: '<i class="fas fa-plane fa-3x"></i>',
        title: 'Student Travel Grant',
        description: 'Financial support for student travel to IEEE conferences and events worldwide.'
    },
    {
        icon: '<i class="fas fa-chart-bar fa-3x"></i>',
        title: 'IEEE Standards',
        description: 'Access to IEEE standards that shape technology development globally.'
    },
    {
        icon: '<i class="fas fa-female fa-3x"></i>',
        title: 'Women in Engineering',
        description: 'Supporting and promoting women in engineering and technology fields.'
    },
    {
        icon: '<i class="fas fa-globe fa-3x"></i>',
        title: 'Global Networking',
        description: 'Connect with over 400,000 members across 160 countries worldwide.'
    },
    {
        icon: '<i class="fas fa-file-alt fa-3x"></i>',
        title: 'Technical Publications',
        description: 'Access to IEEE Xplore Digital Library with millions of technical documents.'
    }
];

// Activities Data
const activitiesData = [
    {
        date: 'Nov 2023',
        image: 'events/Signal/sps1.heic',
        title: 'Signal 2.0',
        description: 'Flagship programme of IEEE SPS Kerala Chapter hosted by MBITS.'
    },
    {
        date: 'Sep 2025',
        image: 'events/Yess nit Calicut .jpg',
        title: 'IEEE YESS 25',
        description: '180 students from our campus attended IEEE YESS 25 hosted at NIT Calicut'
    },
    {
        date: 'Sep 2025',
        image: 'events/SIH.jpg',
        title: 'SIH College level',
        description: 'Successfully organized College level competition of SIH 2025'
    },
    {
        date: 'Jun 2025',
        image: 'events/leet.jpg',
        title: 'DSA Training',
        description: 'A hands-on training program designed to strengthen your grasp of DSA.'
    },
    {
        date: 'Aug 2024',
        image: 'events/MDC.jpg',
        title: 'Membership Development',
        description: 'Guest lecture series featuring industry leaders sharing insights.'
    },
    {
        date: 'May 2025',
        image: 'events/kcbm.jpg',
        title: 'Cybersecurity Session',
        description: 'Platform for students to present their research projects.'
    },
    {
        date: 'Jan 2025',
        image: 'events/hack.jpg',
        title: 'Tin-Her_Hack 3.0',
        description: 'Hackathon exclusively for girl students to enrich their hack skills.'
    },
    {
        date: 'Jul 2025',
        image: 'events/wieevent.jpg',
        title: 'PCB Design Workshop',
        description: 'A 3 day PCB design workshop in collaboration with industrial experts.'
    },
];

// Function to create infinite loop for benefits
function createInfiniteBenefitsLoop() {
    const benefitsTrack = document.getElementById('benefitsTrack');
    if(!benefitsTrack) return;
    const copies = 3;
    const colors = ['bg-pink', 'bg-blue', 'bg-lime', 'bg-yellow', 'bg-lavender'];

    for (let i = 0; i < copies; i++) {
        benefitsData.forEach((benefit, index) => {
            const benefitCard = document.createElement('div');
            const colorClass = colors[index % colors.length];
            benefitCard.className = `benefit-card brutal-card ${colorClass}`;
            benefitCard.innerHTML = `
                <div class="benefit-icon">
                    ${benefit.icon}
                </div>
                <div class="benefit-content">
                    <h3>${benefit.title}</h3>
                    <p>${benefit.description}</p>
                </div>
            `;
            benefitsTrack.appendChild(benefitCard);
        });
    }
}

// Function to render normal distribution of activities
function renderActivitiesGrid() {
    const eventsGrid = document.getElementById('eventsGrid');
    if(!eventsGrid) return;
    const colors = ['bg-yellow', 'bg-lime', 'bg-pink', 'bg-lavender', 'bg-blue'];

    activitiesData.forEach((activity, index) => {
        const activityCard = document.createElement('div');
        const colorClass = colors[index % colors.length];
        activityCard.className = `activity-card brutal-card ${colorClass}`;
        activityCard.setAttribute('data-activity', activity.title.toLowerCase().replace(/\s+/g, '-'));
        activityCard.innerHTML = `
            <div class="activity-date brutal-badge">${activity.date}</div>
            <div class="activity-image brutal-border">
                <img src="${activity.image}" alt="${activity.title}" loading="lazy" onerror="this.src='https://placehold.co/400x300/e6d5ff/000000?text=Event'">
            </div>
            <div class="activity-content">
                <h3>${activity.title}</h3>
                <p>${activity.description}</p>
            </div>
        `;
        eventsGrid.appendChild(activityCard);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    createInfiniteBenefitsLoop();
    renderActivitiesGrid();
});
