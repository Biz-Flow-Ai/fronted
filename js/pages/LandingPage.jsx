const { useState, useEffect, useRef } = React;

function LandingPage() {
  const [pricingStart, setPricingStart] = useState(0);
  const heroRightRef = useRef(null);
  const particlesRef = useRef(null);
  const sphereParticlesRef = useRef(null);
  const connectorSvgRef = useRef(null);
  const premiumStageRef = useRef(null);
  const sphereRef = useRef(null);

  const plans = Array.isArray(window.plans) ? window.plans : [];
  const plansPerPage = 3;
  const safeIndex = (index) => plans.length ? ((index % plans.length) + plans.length) % plans.length : 0;

  const visiblePlans = plans.length ? Array.from({ length: plansPerPage }, (_, idx) => plans[safeIndex(pricingStart + idx)]) : [];
  const prevPlan = plans.length ? plans[safeIndex(pricingStart - 1)] : null;
  const nextPlan = plans.length ? plans[safeIndex(pricingStart + plansPerPage)] : null;

  useEffect(() => {
    // Плавающие частицы в Hero секции
    const heroRight = heroRightRef.current;
    if (heroRight && !heroRight.dataset.init) {
      heroRight.dataset.init = '1';
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'hero-particle';
        const size = Math.random() * 4 + 2;
        const dx = (Math.random() - 0.5) * 120;
        const dy = -(Math.random() * 120 + 40);
        const blue = Math.random() > 0.5;
        p.style.cssText = `
          width:${size}px; height:${size}px;
          left:${20 + Math.random() * 60}%;
          top:${20 + Math.random() * 60}%;
          background: ${blue ? 'rgba(0,163,255,0.7)' : 'rgba(123,97,255,0.7)'};
          --pdx:${dx}px; --pdy:${dy}px;
          animation-duration:${Math.random() * 5 + 4}s;
          animation-delay:${Math.random() * 6}s;
        `;
        fragment.appendChild(p);
      }
      for (let i = 0; i < 4; i++) {
        const l = document.createElement('div');
        l.className = 'energy-line';
        l.style.cssText = `
          width:${60 + Math.random() * 80}px;
          left:${10 + Math.random() * 60}%;
          top:${15 + Math.random() * 70}%;
          transform: rotate(${-30 + Math.random() * 60}deg);
          animation-delay:${Math.random() * 3}s;
          animation-duration:${2.5 + Math.random() * 2}s;
        `;
        fragment.appendChild(l);
      }
      heroRight.appendChild(fragment);
    }

    // Частицы в секции преимуществ (Premium section)
    const field = particlesRef.current;
    if (field && !field.dataset.init) {
      field.dataset.init = '1';
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < 36; i++) {
        const s = document.createElement('span');
        s.className = 'spark';
        const size = Math.random() * 3 + 1;
        s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${Math.random()*14+8}s;animation-delay:${Math.random()*12}s;`;
        fragment.appendChild(s);
      }
      field.appendChild(fragment);
    }

    // Внутренние частицы сферы
    const wrap = sphereParticlesRef.current;
    if (wrap && !wrap.dataset.init) {
      wrap.dataset.init = '1';
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'sp';
        const size = Math.random() * 3 + 1;
        const dx = (Math.random() - 0.5) * 80;
        const dy = (Math.random() - 0.5) * 80;
        p.style.cssText = `width:${size}px;height:${size}px;left:${40+Math.random()*20}%;top:${40+Math.random()*20}%;--dx:${dx}px;--dy:${dy}px;animation-duration:${Math.random()*4+3}s;animation-delay:${Math.random()*5}s;`;
        fragment.appendChild(p);
      }
      wrap.appendChild(fragment);
    }

    // Анимация появления при скролле (IntersectionObserver для производительности)
    const nodes = document.querySelectorAll('.node');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    nodes.forEach(n => observer.observe(n));

    // SVG коннекторы (линии связи)
    function buildConnectors() {
      const svg = connectorSvgRef.current;
      const stage = premiumStageRef.current;
      const sphereEl = sphereRef.current;
      if (!svg || !stage || !sphereEl) return;
      
      const stageRect = stage.getBoundingClientRect();
      const sphereRect = sphereEl.getBoundingClientRect();
      
      const toLocal = el => {
        const r = el.getBoundingClientRect();
        return { x: r.left - stageRect.left + r.width / 2, y: r.top - stageRect.top + r.height / 2 };
      };
      
      const cx = sphereRect.left - stageRect.left + sphereRect.width / 2;
      const cy = sphereRect.top  - stageRect.top  + sphereRect.height / 2;
      const radius = sphereRect.width / 2;
      
      svg.innerHTML = '';
      svg.setAttribute('viewBox', `0 0 ${stageRect.width} ${stageRect.height}`);

      const fragment = document.createDocumentFragment();
      nodes.forEach(node => {
        const p = toLocal(node);
        const dist = Math.hypot(p.x - cx, p.y - cy);
        const ratio = radius / dist;
        const startX = cx + (p.x - cx) * ratio;
        const startY = cy + (p.y - cy) * ratio;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${startX},${startY} L${p.x},${p.y}`);
        path.setAttribute('stroke', 'rgba(0,163,255,0.25)');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        fragment.appendChild(path);
      });
      svg.appendChild(fragment);
    }

    buildConnectors();
    
    // Оптимизированная обработка изменения размера окна
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildConnectors, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <main>
      <Hero heroRightRef={heroRightRef} />
      <HeroStats />
      <PremiumAdvantages 
        particlesRef={particlesRef} 
        sphereParticlesRef={sphereParticlesRef} 
        connectorSvgRef={connectorSvgRef}
        premiumStageRef={premiumStageRef}
        sphereRef={sphereRef}
      />
      <Pricing
        visiblePlans={visiblePlans}
        prevPlan={prevPlan}
        nextPlan={nextPlan}
        onPrev={() => setPricingStart(p => (p - 1 + (plans.length || 1)) % (plans.length || 1))}
        onNext={() => setPricingStart(p => (p + 1) % (plans.length || 1))}
      />
    </main>
  );
}

window.LandingPage = LandingPage;
