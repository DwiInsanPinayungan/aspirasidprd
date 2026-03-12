document.addEventListener('DOMContentLoaded', () => {
    // --- FITUR BARU: Sinkronisasi Pengaturan dari Admin Dashboard ---
    function applyWebConfig() {
        const config = JSON.parse(localStorage.getItem('web_config'));
        if(config) {
            // Site Title & Meta
            if(config.title) {
                const navTitle = document.getElementById('site-title-nav');
                const footerTitle = document.getElementById('site-title-footer');
                if(navTitle) navTitle.innerText = config.title;
                if(footerTitle) footerTitle.innerText = config.title;
                document.title = config.title;
            }
            if(config.meta_title) {
                const metaTitle = document.getElementById('meta-title');
                if(metaTitle) metaTitle.innerText = config.meta_title;
                document.title = config.meta_title;
            }
            if(config.meta_description) {
                const metaDesc = document.getElementById('meta-description');
                if(metaDesc) metaDesc.content = config.meta_description;
            }

            // Logos
            if(config.logo_header) {
                const logoHeader = document.getElementById('logo-header');
                if(logoHeader) logoHeader.src = config.logo_header;
            }
            if(config.logo_footer) {
                const logoFooter = document.getElementById('logo-footer');
                if(logoFooter) logoFooter.src = config.logo_footer;
            }

            // Hero
            if(config.hero_url) {
                const heroImg = document.getElementById('hero-img');
                if(heroImg) heroImg.src = config.hero_url;
            }
            if(config.hero_subtitle) {
                const heroSub = document.getElementById('hero-subtitle');
                if(heroSub) heroSub.innerText = config.hero_subtitle;
            }

            // Primary Color
            if(config.primary_color) {
                document.documentElement.style.setProperty('--primary', config.primary_color);
            }

            // About & Address
            if(config.about_us) {
                const footerAbout = document.getElementById('footer-about-us');
                if(footerAbout) footerAbout.innerText = config.about_us;
            }
            if(config.office_address) {
                const officeAddr = document.getElementById('office-address');
                if(officeAddr) {
                    officeAddr.innerText = config.office_address;
                    officeAddr.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.office_address)}`;
                }
            }

            // Contact
            if(config.email) {
                const contactEmail = document.getElementById('contact-email');
                if(contactEmail) {
                    contactEmail.innerText = config.email;
                    contactEmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${config.email}`;
                }
            }
            if(config.phone) {
                const contactPhone = document.getElementById('contact-phone');
                if(contactPhone) {
                    contactPhone.innerText = config.phone;
                    contactPhone.href = `tel:${config.phone.replace(/[^0-9]/g, '')}`;
                }
            }

            // Social Media
            const socialMap = {
                'facebook': config.social_facebook,
                'twitter': config.social_twitter,
                'instagram': config.social_instagram,
                'youtube': config.social_youtube
            };
            for (const [key, val] of Object.entries(socialMap)) {
                const el = document.getElementById(`social-${key}`);
                if (el) {
                    if (val) {
                        el.href = val;
                        el.style.display = 'flex';
                    } else {
                        el.style.display = 'none';
                    }
                }
            }
        }
    }

    // Jalankan sinkronisasi saat halaman dimuat
    // --- DATA INITIALIZATION ---
    const API_BASE_URL = 'http://localhost:3000'; // Mengarah ke backend lokal (node server.js)

    function updateLandingStats() {
        const elTotalAspirasi = document.getElementById('totalAspirasi');
        if(!elTotalAspirasi) return;

        fetch(`${API_BASE_URL}/api/aspirations`)
            .then(res => res.json())
            .then(data => {
                elTotalAspirasi.innerText = data.length.toLocaleString('id-ID');
            })
            .catch(err => console.error("Gagal ambil stats:", err));
    }

    updateLandingStats();
    applyWebConfig();

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        // Change icon
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-link, .btn-primary');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });


    // Form Validation & Submission
    const aspirasiForm = document.getElementById('aspirasiForm');
    
    // Toggle input "Lainnya" untuk Kabupaten/Kota
    const kabupatenSelect = document.getElementById('kabupaten');
    const kabupatenLainnyaInput = document.getElementById('kabupaten_lainnya');

    if(kabupatenSelect && kabupatenLainnyaInput) {
        kabupatenSelect.addEventListener('change', function() {
            if (this.value === 'Lainnya') {
                kabupatenLainnyaInput.style.display = 'block';
                kabupatenLainnyaInput.required = true;
            } else {
                kabupatenLainnyaInput.style.display = 'none';
                kabupatenLainnyaInput.required = false;
                kabupatenLainnyaInput.value = ''; // Reset form
            }
        });
    }
    
    // Toggle input "Lainnya" untuk Kategori Aspirasi
    const kategoriSelect = document.getElementById('kategori');
    const kategoriLainnyaInput = document.getElementById('kategori_lainnya');

    if(kategoriSelect && kategoriLainnyaInput) {
        kategoriSelect.addEventListener('change', function() {
            if (this.value === 'Lainnya') {
                kategoriLainnyaInput.style.display = 'block';
                kategoriLainnyaInput.required = true;
            } else {
                kategoriLainnyaInput.style.display = 'none';
                kategoriLainnyaInput.required = false;
                kategoriLainnyaInput.value = ''; // Reset form
            }
        });
    }

    const emailInput = document.getElementById('email');
    const kebijakanInput = document.getElementById('kebijakan');
    const submitBtnAction = document.getElementById('submitBtn');
    
    if(kebijakanInput && submitBtnAction && emailInput) {
        const checkFormValidity = () => {
            const isEmailFilled = emailInput.value.trim() !== '';
            const isPolicyChecked = kebijakanInput.checked;
            submitBtnAction.disabled = !(isEmailFilled && isPolicyChecked);
        };

        // Pastikan sinkronisasi saat halaman di-refresh
        checkFormValidity();
        
        kebijakanInput.addEventListener('change', checkFormValidity);
        emailInput.addEventListener('input', checkFormValidity);
    }

    if(aspirasiForm) {
        aspirasiForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default submission
            
            // Basic validation
            let isValid = true;
            
            const email = document.getElementById('email').value.trim();
            const nik = document.getElementById('nik').value;

            // Strict Email Check
            if (!email) {
                Swal.fire({
                    icon: 'error',
                    title: 'Email Wajib Diisi',
                    text: 'Anda harus mencantumkan alamat email untuk mengirim aspirasi.',
                    confirmButtonColor: '#d32f2f'
                });
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Email Tidak Valid',
                    text: 'Silakan masukkan format email yang benar (contoh: nama@email.com).',
                    confirmButtonColor: '#d32f2f'
                });
                isValid = false;
            } else if (nik.length !== 16) {
                Swal.fire({
                    icon: 'warning',
                    title: 'NIK Tidak Valid',
                    text: 'Nomor Induk Kependudukan (NIK) harus berjumlah 16 digit angka.',
                    confirmButtonColor: '#d32f2f'
                });
                isValid = false;
            }

            if(isValid) {
                // Simulate sending data API call with button loading state
                const submitBtnAction = document.getElementById('submitBtn');
                const originalText = submitBtnAction.innerHTML;
                
                submitBtnAction.disabled = true;
                submitBtnAction.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
                
                // Ciptakan No Tiket Random
                const nomorTiket = "#JTM-" + Math.floor(1000 + Math.random() * 9000);
                
                // Ambil Value dari Form
                const aspirasiData = {
                    tiket: nomorTiket,
                    nama: document.getElementById('nama').value,
                    nik: nik,
                    email: document.getElementById('email').value,
                    kategori: document.getElementById('kategori').value,
                    kabupaten: document.getElementById('kabupaten').value === 'Lainnya' ? document.getElementById('kabupaten_lainnya').value : document.getElementById('kabupaten').value,
                    judul: document.getElementById('judul').value,
                    isi: document.getElementById('isi').value,
                    tanggal: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'})
                };

                // REAL API CALL: Kirim ke Database Backend
                fetch(`${API_BASE_URL}/api/aspirations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(aspirasiData)
                })
                .then(response => response.json())
                .then(data => {
                    // Reset Button
                    submitBtnAction.disabled = false;
                    submitBtnAction.innerHTML = originalText;
                    
                    // Show SweetAlert Success Popup
                    Swal.fire({
                        icon: 'success',
                        title: 'Aspirasi Berhasil Dikirim!',
                        html: `Terima kasih atas laporan Anda. Aspirasi Anda telah tercatat dengan nomor tiket <b>${nomorTiket}</b> dan akan segera kami proses oleh tim DPRD Jatim.`,
                        confirmButtonText: 'Kembali ke Beranda',
                        confirmButtonColor: '#d32f2f',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            aspirasiForm.reset(); 
                            if(submitBtnAction) submitBtnAction.disabled = true;

                            // Update Statistik Realtime dari Backend
                            updateLandingStats();
                            
                            // Scroll balik ke atas
                            setTimeout(() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    submitBtnAction.disabled = false;
                    submitBtnAction.innerHTML = originalText;
                    Swal.fire('Gagal!', 'Terjadi kesalahan saat mengirim data ke server.', 'error');
                });
            }
        });
    }

    // --- FITUR BARU: Popup Pelajari Alur ---
    const btnPelajariAlur = document.getElementById('btn-pelajari-alur');
    if (btnPelajariAlur) {
        btnPelajariAlur.addEventListener('click', function(e) {
            e.preventDefault();
            
            Swal.fire({
                title: '<span style="color: var(--primary); font-weight: 800;">Alur Aspirasi Digital</span>',
                html: `
                    <p style="color: #666; margin-bottom: 20px;">Ikuti 4 langkah mudah untuk menyampaikan aspirasi Anda:</p>
                    <div class="flow-modal-steps">
                        <div class="flow-step-item">
                            <div class="flow-step-number">1</div>
                            <div class="flow-step-content">
                                <h4>Tulis Laporan</h4>
                                <p>Lengkapi formulir dengan data diri valid dan detail aspirasi Anda.</p>
                            </div>
                        </div>
                        <div class="flow-step-item">
                            <div class="flow-step-number">2</div>
                            <div class="flow-step-content">
                                <h4>Proses Verifikasi</h4>
                                <p>Tim kami akan memvalidasi kelengkapan data dan substansi laporan.</p>
                            </div>
                        </div>
                        <div class="flow-step-item">
                            <div class="flow-step-number">3</div>
                            <div class="flow-step-content">
                                <h4>Tindak Lanjut</h4>
                                <p>Aspirasi diteruskan ke Komisi terkait di DPRD Jatim untuk dibahas.</p>
                            </div>
                        </div>
                        <div class="flow-step-item">
                            <div class="flow-step-number">4</div>
                            <div class="flow-step-content">
                                <h4>Selesai & Tanggapan</h4>
                                <p>Dapatkan jawaban/solusi resmi atas aspirasi yang telah Anda sampaikan.</p>
                            </div>
                        </div>
                    </div>
                `,
                confirmButtonText: 'Saya Mengerti',
                confirmButtonColor: 'var(--primary)',
                customClass: {
                    popup: 'premium-flow-modal'
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
        });
    }

    // FAQ Accordion Interactivity
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = question.nextElementSibling;
            
            // Periksa apakah item ini sudah aktif
            const isActive = faqItem.classList.contains('active');
            
            // Tutup semua FAQ yang terbuka terlebih dahulu (opsional: agar hanya 1 yg terbuka)
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Jika sebelumnya tidak aktif, maka buka akordion ini
            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
            }
        });
    });
});
