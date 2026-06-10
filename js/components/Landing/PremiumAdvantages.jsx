function PremiumAdvantages({ particlesRef, sphereParticlesRef, connectorSvgRef, premiumStageRef, sphereRef }) {
  return (
    <section className="premium-advantages" id="advantages">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      <div className="particle-field" ref={particlesRef} />
      <div className="premium-inner">
        <div className="premium-header">
          <div className="premium-badge">
            <span className="premium-badge-dot" />Возможности
          </div>
          <h2 className="premium-title">Всё, что нужно<br /><em>входному менеджеру</em></h2>
          <p className="premium-subtitle">BizFlow AI берёт рутину на себя, чтобы вы могли сосредоточиться на клиентах и развитии бизнеса.</p>
        </div>
        <div className="premium-stage" ref={premiumStageRef}>
          <svg className="connector-svg" ref={connectorSvgRef} xmlns="http://www.w3.org/2000/svg" />
          <div className="premium-nodes" id="leftNodes">
            {leftNodes.map((item, i) => (
              <div className="node node-left" key={i}>
                <div className="node-card">
                  <div className="node-index">{item.n}</div>
                  <div className="node-title">{item.title}</div>
                  <div className="node-desc">{item.desc}</div>
                </div>
                <span className="conn-dot" />
              </div>
            ))}
          </div>
          <div className="sphere-wrap">
            <div className="sphere-outer-glow" />
            <div className="sphere" ref={sphereRef}>
              <div className="sphere-body">
                <div className="sphere-grid">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(129,140,248,1)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="200" height="200" fill="url(#grid)"/>
                    <ellipse cx="100" cy="100" rx="40" ry="100" fill="none" stroke="rgba(129,140,248,0.6)" strokeWidth="0.5"/>
                    <ellipse cx="100" cy="100" rx="80" ry="100" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="0.5"/>
                    <ellipse cx="100" cy="100" rx="100" ry="40" fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="0.5"/>
                    <ellipse cx="100" cy="100" rx="100" ry="70" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="0.5"/>
                  </svg>
                </div>
                <div className="sphere-equator" />
                <div className="sphere-particles" ref={sphereParticlesRef} />
                <div className="sphere-scan" />
              </div>
              <div className="ring ring-1"><div className="ring-dot" /></div>
              <div className="ring ring-2" />
              <div className="ring ring-3"><div className="ring-dot" style={{top:'auto',bottom:'-2px'}} /></div>
              <div className="sphere-label">AI</div>
            </div>
          </div>
          <div className="premium-nodes" id="rightNodes">
            {rightNodes.map((item, i) => (
              <div className="node node-right" key={i}>
                <div className="node-card">
                  <div className="node-index">{item.n}</div>
                  <div className="node-title">{item.title}</div>
                  <div className="node-desc">{item.desc}</div>
                </div>
                <span className="conn-dot" />
              </div>
            ))}
          </div>
        </div>
        <div className="premium-banner">
          <div className="banner-glow" />
          <div className="banner-text-wrap">
            <div className="banner-title">AI работает 24/7, чтобы вы не теряли прибыль</div>
            <div className="banner-text">Меньше рутины — больше довольных клиентов и роста для бизнеса.</div>
          </div>
          <button className="banner-cta">Начать бесплатно →</button>
        </div>
      </div>
    </section>
  );
}
