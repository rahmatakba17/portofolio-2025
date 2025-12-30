// Portfolio Junior Developer - Vanilla JS
// Magister Teknik Informatika Unhas

// ========================================
// 1. UTILITY FUNCTIONS
// ========================================
const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ========================================
// 2. SCROLL PROGRESS INDICATOR
// ========================================
class ScrollProgressIndicator {
    constructor() {
        this.progressBar = null;
        this.init();
    }

    init() {
        // Create progress bar element
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        this.progressBar.style.transform = 'scaleX(0)';
        document.body.prepend(this.progressBar);

        // Update on scroll
        window.addEventListener('scroll', debounce(() => this.updateProgress(), 10));
    }

    updateProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height);
        this.progressBar.style.transform = `scaleX(${scrolled})`;
    }
}

// ========================================
// 2. THEME MANAGER
// ========================================
class ThemeManager {
    constructor() {
        this.theme = getInitialTheme();
        this.toggleBtn = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.init();
    }

    init() {
        document.documentElement.classList.toggle('dark', this.theme === 'dark');
        this.updateIcon();
        this.toggleBtn.addEventListener('click', () => this.toggleTheme());

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.classList.toggle('dark', this.theme === 'dark');
        this.updateIcon();
    }

    updateIcon() {
        if (this.theme === 'dark') {
            this.themeIcon.innerHTML = `<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>`;
        } else {
            this.themeIcon.innerHTML = `<path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>`;
        }
    }
}

// ========================================
// 3. NAVIGATION MANAGER
// ========================================
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.sections = document.querySelectorAll('section[id]');
        this.backToTopBtn = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));
        window.addEventListener('scroll', debounce(() => this.handleNavbarScroll(), 10));
        this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        this.backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }

    handleScroll() {
        let current = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        if (window.scrollY > 500) {
            this.backToTopBtn.classList.remove('hidden');
            this.backToTopBtn.classList.add('flex');
        } else {
            this.backToTopBtn.classList.add('hidden');
        }
    }

    handleNavbarScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('shadow-lg', 'glass');
        } else {
            this.navbar.classList.remove('shadow-lg', 'glass');
        }
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('hidden');
        this.mobileMenuBtn.innerHTML = this.mobileMenu.classList.contains('hidden')
            ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`
            : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`;
    }

    closeMobileMenu() {
        this.mobileMenu.classList.add('hidden');
        this.mobileMenuBtn.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
    }
}

// ========================================
// 4. SCROLL REVEAL
// ========================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay for elements in the same container
                    const delay = index * 50;
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
}

// ========================================
// 5. PROJECT FILTER & MODAL
// ========================================
class ProjectManager {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.modal = document.getElementById('project-modal');
        this.modalContent = document.getElementById('modal-content');
        this.closeModalBtn = document.getElementById('close-modal');
        this.readMoreBtns = document.querySelectorAll('.read-more-btn');
        this.init();
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterProjects(e.target.dataset.filter));
        });

        this.readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.openModal(e.target.closest('.project-card')));
        });

        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    filterProjects(category) {
        this.filterBtns.forEach(btn => btn.classList.remove('active', 'bg-blue-600', 'text-white'));
        document.querySelector(`[data-filter="${category}"]`).classList.add('active', 'bg-blue-600', 'text-white');

        this.projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }

    openModal(projectCard) {
        const projectId = projectCard.dataset.project;
        const modalData = this.getModalData(projectId);

        document.getElementById('modal-body').innerHTML = modalData;
        this.modal.classList.remove('hidden');
        this.modal.setAttribute('aria-hidden', 'false');

        setTimeout(() => {
            this.modalContent.classList.remove('scale-95', 'opacity-0');
            this.modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);

        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modalContent.classList.add('scale-95', 'opacity-0');
        this.modalContent.classList.remove('scale-100', 'opacity-100');

        setTimeout(() => {
            this.modal.classList.add('hidden');
            this.modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    getModalData(projectId) {
        const projectData = {
            '1': {
                title: 'Sistem Pendukung Keputusan Pemilihan Laptop',
                problem: 'Mahasiswa sering kebingungan memilih laptop yang sesuai budget dan kebutuhan karena terlalu banyak pilihan dan spesifikasi teknis.',
                solution: 'Membangun platform web yang mengimplementasikan metode TOPSIS untuk memberikan rekomendasi berdasarkan kriteria bobot yang diberikan user.',
                tech: ['Laravel 10', 'MySQL', 'PHP', 'Bootstrap 5', 'TOPSIS Algorithm', 'Chart.js'],
                features: [
                    'Input kriteria dan bobot preferensi',
                    'Perhitungan otomatis dengan metode TOPSIS',
                    'Visualisasi perbandingan dengan chart',
                    'Export hasil ke PDF',
                    'Manajemen database laptop (CRUD)',
                    'Responsive mobile design'
                ],
                demo: 'https://spk-laptop-demo.netlify.app',
                repo: 'https://github.com/username/spk-laptop',
                status: 'Production Ready'
            },
            '2': {
                title: 'Aplikasi Manajemen Tugas Kuliah',
                problem: 'Mahasiswa kesulitan mengorganisir deadline dari banyak mata kuliah dan kolaborasi kelompok yang tidak terstruktur.',
                solution: 'Aplikasi web untuk tracking tugas individu/kelompok dengan notifikasi deadline dan progress tracking nilai.',
                tech: ['Laravel 9', 'Vue.js 3', 'MySQL', 'JWT Auth', 'Laravel Echo', 'Pusher'],
                features: [
                    'Autentikasi multi-role (mahasiswa, dosen)',
                    'Buat & assign tugas kelompok',
                    'Notifikasi deadline via email',
                    'Progress tracking dengan progress bar',
                    'Upload file attachment',
                    'Real-time comment & update'
                ],
                demo: 'https://task-manager-unhas.vercel.app',
                repo: 'https://github.com/username/task-manager',
                status: 'Development'
            },
            '3': {
                title: 'Dashboard Monitoring IoT Greenhouse',
                problem: 'Petani perlu monitoring manual kondisi greenhouse yang tidak efisien dan rentan kesalahan.',
                solution: 'Sistem IoT otomatis dengan dashboard web real-time untuk monitoring suhu, kelembapan, dan kontrol aktuator.',
                tech: ['Node.js', 'Express', 'Socket.io', 'Arduino Uno', 'DHT22 Sensor', 'MongoDB'],
                features: [
                    'Real-time data streaming via WebSocket',
                    'Grafik historis kondisi greenhouse',
                    'Notifikasi alert via WhatsApp',
                    'Kontrol relay otomatis/manual',
                    'Data export ke CSV',
                    'Mobile responsive dashboard'
                ],
                demo: 'https://iot-greenhouse-demo.vercel.app',
                repo: 'https://github.com/username/iot-greenhouse',
                status: 'Prototype'
            },
            '4': {
                title: 'Website Company Profile UMKM',
                problem: 'UMKM lokal membutuhkan website profesional dengan budget terbatas dan kemudahan pengelolaan konten.',
                solution: 'Website company profile custom dengan CMS sederhana untuk manajemen produk dan pesanan.',
                tech: ['HTML5', 'CSS3', 'Vanilla JS', 'PHP Native', 'MySQL', 'Bootstrap 5'],
                features: [
                    'Tampilan produk dengan galeri',
                    'Shopping cart sederhana',
                    'CMS untuk admin (CRUD produk)',
                    'Form pemesanan otomatis',
                    'SEO friendly URL',
                    'Mobile first design'
                ],
                demo: 'https://umkm-profile.netlify.app',
                repo: 'https://github.com/username/umkm-profile',
                status: 'Deployed'
            }
        };

        const data = projectData[projectId];
        if (!data) return '<p>Project data not found.</p>';

        return `
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">Permasalahan</h3>
                    <p class="text-gray-700 dark:text-gray-300">${data.problem}</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">Solusi</h3>
                    <p class="text-gray-700 dark:text-gray-300">${data.solution}</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Teknologi</h3>
                    <div class="flex flex-wrap gap-2">
                        ${data.tech.map(t => `<span class="tech-badge text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">${t}</span>`).join('')}
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Fitur Utama</h3>
                    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                        ${data.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
                <div class="flex flex-wrap gap-4 pt-4">
                    <a href="${data.demo}" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        Live Demo
                    </a>
                    <a href="${data.repo}" target="_blank" class="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white rounded-lg transition-all duration-300">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Repository
                    </a>
                    <span class="inline-flex items-center px-3 py-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
                        Status: ${data.status}
                    </span>
                </div>
            </div>
        `;
    }
}

// ========================================
// 6. CONTACT FORM
// ========================================
class ContactManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.copyEmailBtn = document.getElementById('copy-email');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.copyEmailBtn.addEventListener('click', () => this.copyEmail());
    }

    handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        if (!this.validateForm(data)) {
            this.showNotification('Harap isi semua field dengan benar.', 'error');
            return;
        }

        this.showNotification('Mengirim pesan...', 'info');

        setTimeout(() => {
            this.showNotification('Pesan berhasil terkirim! (Fitur ini menggunakan placeholder)', 'success');
            this.form.reset();
        }, 1500);
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return data.name.length > 2 &&
            emailRegex.test(data.email) &&
            data.subject.length > 5 &&
            data.message.length > 10;
    }

    copyEmail() {
        const email = '[email@example.com]';
        navigator.clipboard.writeText(email).then(() => {
            this.showNotification('Email disalin ke clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Gagal menyalin email.', 'error');
        });
    }

    showNotification(message, type = 'info') {
        const existing = document.getElementById('notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = `fixed top-24 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 transform translate-x-full ${type === 'success' ? 'bg-green-600' :
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ========================================
// 7. CERTIFICATE FILTER
// ========================================
class CertificateManager {
    constructor() {
        this.searchInput = document.getElementById('certificate-search');
        this.filterSelect = document.getElementById('certificate-filter');
        this.certificateCards = document.querySelectorAll('.certificate-card');
        this.init();
    }

    init() {
        this.searchInput.addEventListener('input', debounce(() => this.filterCertificates(), 300));
        this.filterSelect.addEventListener('change', () => this.filterCertificates());
    }

    filterCertificates() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const providerFilter = this.filterSelect.value;

        this.certificateCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const provider = card.dataset.provider;
            const description = card.querySelector('p').textContent.toLowerCase();

            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesProvider = providerFilter === 'all' || provider === providerFilter;

            if (matchesSearch && matchesProvider) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }
}

// ========================================
// 8. LOADING MANAGER
// ========================================
class LoadingManager {
    constructor() {
        this.loader = document.getElementById('loading');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loader.style.opacity = '0';
                setTimeout(() => this.loader.style.display = 'none', 500);
            }, 500);
        });
    }
}

// ========================================
// 9. MAIN INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    new ScrollProgressIndicator();
    new ThemeManager();
    new NavigationManager();
    new ScrollReveal();
    new ProjectManager();
    new ContactManager();
    new CertificateManager();
    new LoadingManager();

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.setAttribute('aria-label', `Scroll to ${link.textContent}`);
    });

    if (!CSS.supports('scroll-behavior', 'smooth')) {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    console.log('🚀 Portfolio Junior Developer Unhas berhasil dimuat dengan desain premium!');
});