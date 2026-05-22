/* ================================================
   STACKLY — Master Vanilla JS Logic (FIXED)
   Dark Theme | Full Hero | Mobile Menu | All Fixes
   ================================================ */

(function(){
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  if(preloader){
    const hidePreloader = () => {
      preloader.classList.add('hidden');
      setTimeout(()=>{ if(preloader && preloader.parentNode){ preloader.style.display='none'; } }, 700);
    };
    window.addEventListener('load', () => setTimeout(hidePreloader, 1400));
    setTimeout(hidePreloader, 2400);
  }

  /* ---------- PARTICLE SYSTEM ---------- */
  const heroParticles = document.getElementById('heroParticles');
  if(heroParticles){
    for(let i=0;i<25;i++){
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left = Math.random()*100+'%';
      p.style.top = Math.random()*100+'%';
      p.style.animationDelay = Math.random()*8+'s';
      p.style.animationDuration = (6+Math.random()*6)+'s';
      const size = 3 + Math.random()*6;
      p.style.width = size+'px';
      p.style.height = size+'px';
      const colors = ['var(--accent)','var(--accent-2)','var(--accent-3)'];
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      heroParticles.appendChild(p);
    }
  }

  /* ---------- YEAR ---------- */
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- HEADER SCROLL ---------- */
  const header = document.getElementById('siteHeader');
  if(header){
    const onScroll = () => {
      if(window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- MOBILE NAV ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  const body = document.body;

  const openMobile = () => {
    if(!mobileNav) return;
    mobileNav.classList.add('open');
    if(hamburger) hamburger.classList.add('active');
    body.classList.add('no-scroll');
    mobileNav.setAttribute('aria-hidden','false');
  };
  const closeMobile = () => {
    if(!mobileNav) return;
    mobileNav.classList.remove('open');
    if(hamburger) hamburger.classList.remove('active');
    body.classList.remove('no-scroll');
    mobileNav.setAttribute('aria-hidden','true');
  };

  if(hamburger) hamburger.addEventListener('click', () => {
    if(mobileNav.classList.contains('open')) closeMobile();
    else openMobile();
  });
  if(mobileClose) mobileClose.addEventListener('click', closeMobile);
  if(mobileNav){
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
  }

  /* ---------- HERO SLIDER (6 SLIDES - FULL BANNER) ---------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  
  if(slides.length && dotsWrap){
    let current = 0;
    let heroTimer = null;
    slides.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'dot' + (i===0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
    const dots = dotsWrap.querySelectorAll('.dot');
    const goTo = idx => {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    };
    const stopHero = () => {
      if(heroTimer){
        clearInterval(heroTimer);
        heroTimer = null;
      }
    };
    const startHero = () => {
      if(prefersReducedMotion) return;
      stopHero();
      heroTimer = setInterval(() => goTo(current + 1), 5000);
    };
    
    if(heroPrev) heroPrev.addEventListener('click', () => goTo(current - 1));
    if(heroNext) heroNext.addEventListener('click', () => goTo(current + 1));
    
    const heroEl = document.querySelector('.hero');
    if(heroEl){
      heroEl.addEventListener('mouseenter', stopHero);
      heroEl.addEventListener('mouseleave', startHero);
    }
    document.addEventListener('visibilitychange', () => {
      if(document.hidden) stopHero();
      else startHero();
    });
    startHero();
    
    document.addEventListener('keydown', e => {
      if(e.key === 'ArrowLeft') goTo(current - 1);
      if(e.key === 'ArrowRight') goTo(current + 1);
    });
  }

  /* ---------- 3D TILT EFFECT ---------- */
  const tiltTargets = document.querySelectorAll('.product-card');
  if(finePointer && !prefersReducedMotion){
    tiltTargets.forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - .5;
        const y = (e.clientY - rect.top) / rect.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-6px)`;
      });
      el.addEventListener('mouseleave', () => { 
        el.style.transform = ''; 
      });
    });
  }

  /* ---------- INTERSECTION OBSERVER REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add('visible');
          const children = e.target.querySelectorAll('.product-card, .feat, .testimonial-card');
          children.forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            setTimeout(() => {
              child.style.transition = 'all 0.6s cubic-bezier(.2,.7,.2,1)';
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, i * 100);
          });
          io.unobserve(e.target);
        }
      });
    },{ threshold: .12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- PARALLAX SCROLL ---------- */
  const parallaxEls = document.querySelectorAll('.hero-slide-bg');
  if(parallaxEls.length && !prefersReducedMotion && window.innerWidth > 860){
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      parallaxEls.forEach(el => {
        const parent = el.closest('.hero-slide');
        if(parent && parent.classList.contains('active')){
          el.style.transform = `translateY(${scrolled * 0.3}px) scale(1.08)`;
        }
      });
    }, { passive: true });
  }

  /* ---------- FASHION TRACK SLIDER ---------- */
  const track = document.getElementById('fashionTrack');
  const fPrev = document.getElementById('fashionPrev');
  const fNext = document.getElementById('fashionNext');
  if(track && fPrev && fNext){
    let offset = 0;
    const cardW = () => {
      const first = track.querySelector('.product-card');
      if(!first) return 240;
      const gap = parseInt(getComputedStyle(track).gap) || 18;
      return first.getBoundingClientRect().width + gap;
    };
    const maxOffset = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
    const apply = () => { 
      track.style.transform = `translateX(-${offset}px)`; 
    };
    fNext.addEventListener('click', () => {
      offset = Math.min(offset + cardW(), maxOffset());
      apply();
    });
    fPrev.addEventListener('click', () => {
      offset = Math.max(offset - cardW(), 0);
      apply();
    });
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if(Math.abs(diff) > 50){
        if(diff > 0) { offset = Math.min(offset + cardW(), maxOffset()); }
        else { offset = Math.max(offset - cardW(), 0); }
        apply();
      }
    }, { passive: true });
    window.addEventListener('resize', () => { offset = Math.min(offset, maxOffset()); apply(); });
  }

  /* ---------- CART ENGINE ---------- */
  const cart = [];
  const cartCountEl = document.getElementById('cartCount');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');

  const formatINR = n => new Intl.NumberFormat('en-IN', {
    style:'currency',
    currency:'INR',
    maximumFractionDigits:0
  }).format(n);

  const renderCart = () => {
    if(!cartItemsEl || !cartCountEl || !cartTotalEl) return;
    const totalQty = cart.reduce((s,i)=>s+i.qty,0);
    cartCountEl.textContent = totalQty;
    cartCountEl.classList.remove('bump');
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('bump');

    if(!cart.length){
      cartItemsEl.innerHTML = '<p class="cart-empty">Your bag is currently empty.</p>';
      cartTotalEl.textContent = formatINR(0);
      return;
    }
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.qty;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.style.animationDelay = (idx * 0.1) + 's';
      row.innerHTML = `
        <img src="${item.img}" alt="${item.name}" />
        <div class="info">
          <h6>${item.name}</h6>
          <div class="ci-price">${formatINR(item.price)}</div>
          <div class="qty">
            <button data-act="dec" data-idx="${idx}">-</button>
            <span>${item.qty}</span>
            <button data-act="inc" data-idx="${idx}">+</button>
          </div>
        </div>
        <button class="remove" data-act="rm" data-idx="${idx}" aria-label="Remove">&times;</button>
      `;
      cartItemsEl.appendChild(row);
    });
    cartTotalEl.textContent = formatINR(total);
  };

  const openCart = () => {
    if(!cartDrawer) return;
    cartDrawer.classList.add('open');
    if(cartBackdrop) cartBackdrop.classList.add('open');
    body.classList.add('no-scroll');
    cartDrawer.setAttribute('aria-hidden','false');
  };
  const closeCart = () => {
    if(!cartDrawer) return;
    cartDrawer.classList.remove('open');
    if(cartBackdrop) cartBackdrop.classList.remove('open');
    body.classList.remove('no-scroll');
    cartDrawer.setAttribute('aria-hidden','true');
  };

  if(cartToggle) cartToggle.addEventListener('click', openCart);
  if(cartClose) cartClose.addEventListener('click', closeCart);
  if(cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  if(cartItemsEl){
    cartItemsEl.addEventListener('click', e => {
      const btn = e.target.closest('button[data-act]');
      if(!btn) return;
      const idx = parseInt(btn.dataset.idx, 10);
      const act = btn.dataset.act;
      if(isNaN(idx) || !cart[idx]) return;
      if(act === 'inc') cart[idx].qty++;
      else if(act === 'dec'){ cart[idx].qty--; if(cart[idx].qty<=0) cart.splice(idx,1); }
      else if(act === 'rm') cart.splice(idx,1);
      renderCart();
    });
  }

  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name || 'Product';
      const price = parseInt(btn.dataset.price, 10) || 0;
      const img = btn.dataset.img || '';
      const existing = cart.find(i => i.name === name);
      if(existing) existing.qty++;
      else cart.push({ name, price, img, qty: 1 });

      btn.classList.add('added');
      const oldText = btn.textContent;
      btn.textContent = 'Added';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.textContent = oldText;
      }, 1200);
      renderCart();
      openCart();
    });
  });
  renderCart();

  /* ---------- COUNTDOWN ---------- */
  const cdH = document.getElementById('cdH');
  const cdM = document.getElementById('cdM');
  const cdS = document.getElementById('cdS');
  if(cdH && cdM && cdS){
    const end = Date.now() + (12*3600 + 34*60 + 56) * 1000;
    const pad = n => String(n).padStart(2,'0');
    const tick = () => {
      let diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000); diff -= h*3600000;
      const m = Math.floor(diff / 60000); diff -= m*60000;
      const s = Math.floor(diff / 1000);
      cdH.textContent = pad(h); cdM.textContent = pad(m); cdS.textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- NEWSLETTER FORM ---------- */
  const newsForm = document.getElementById('newsForm');
  if(newsForm){
    const nName = document.getElementById('nName');
    const nEmail = document.getElementById('nEmail');
    const nPhone = document.getElementById('nPhone');
    const nNameErr = document.getElementById('nNameErr');
    const nEmailErr = document.getElementById('nEmailErr');
    const nPhoneErr = document.getElementById('nPhoneErr');
    const success = document.getElementById('newsSuccess');

    const nameRegex = /^[A-Za-z\s.'-]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    const showErr = (el, msg) => { if(el){ el.textContent = msg; el.classList.add('show'); } };
    const clearErr = el => { if(el){ el.textContent=''; el.classList.remove('show'); } };

    if(nName){
      nName.addEventListener('input', () => {
        if(/[0-9!@#$%^&*()_+=\[\]{};:"\\|,<>\/?]/.test(nName.value)){
          showErr(nNameErr, 'Numbers and special characters are not allowed');
        } else clearErr(nNameErr);
      });
    }
    if(nEmail){
      nEmail.addEventListener('input', () => {
        if(nEmail.value && !emailRegex.test(nEmail.value)) showErr(nEmailErr, 'Please enter a valid email address');
        else clearErr(nEmailErr);
      });
    }
    if(nPhone){
      nPhone.addEventListener('input', () => {
        nPhone.value = nPhone.value.replace(/\D/g,'').slice(0,10);
        if(nPhone.value && !phoneRegex.test(nPhone.value)) showErr(nPhoneErr, 'Enter valid 10-digit Indian mobile number');
        else clearErr(nPhoneErr);
      });
    }

    newsForm.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      if(!nName || !nameRegex.test(nName.value.trim())){
        showErr(nNameErr, 'Numbers and special characters are not allowed'); ok = false;
      }
      if(!nEmail || !emailRegex.test(nEmail.value.trim())){
        showErr(nEmailErr, 'Please enter a valid email address'); ok = false;
      }
      if(!nPhone || !phoneRegex.test(nPhone.value.trim())){
        showErr(nPhoneErr, 'Enter valid 10-digit Indian mobile number'); ok = false;
      }
      if(ok && success){
        success.classList.add('show');
        newsForm.reset();
        setTimeout(() => success.classList.remove('show'), 4000);
      }
    });
  }

  /* ---------- 404 GO BACK ---------- */
  const goBack = document.getElementById('goBackBtn');
  if(goBack){
    goBack.addEventListener('click', () => {
      if(window.history.length > 1) window.history.back();
      else window.location.href = 'index.html';
    });
  }

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- ESC CLOSES OVERLAYS ---------- */
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      if(mobileNav && mobileNav.classList.contains('open')) closeMobile();
      if(cartDrawer && cartDrawer.classList.contains('open')) closeCart();
    }
  });

  /* ---------- MAGNETIC BUTTONS ---------- */
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-ghost, .btn-add');
  if(finePointer && !prefersReducedMotion){
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        btn.style.transform = `translate(${x*0.2}px, ${y*0.2}px) scale(1.02)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- SCROLL PROGRESS ---------- */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:var(--grad-2);z-index:10000;transition:width .1s ease;';
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });

  /* ---------- WISHLIST TOGGLE ---------- */
  document.querySelectorAll('.p-action.wish').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const svg = btn.querySelector('svg');
      if(btn.classList.contains('active')){
        svg.setAttribute('fill', 'currentColor');
        btn.style.background = 'linear-gradient(135deg,#ff6b6b,#ff4a4a)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'transparent';
      } else {
        svg.setAttribute('fill', 'none');
        btn.style.background = 'rgba(15,23,41,.9)';
        btn.style.color = 'var(--ink)';
        btn.style.borderColor = 'rgba(255,255,255,.1)';
      }
    });
  });

})();