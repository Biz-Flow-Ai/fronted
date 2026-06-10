function Pricing({ visiblePlans = [], prevPlan = null, nextPlan = null, onPrev = () => {}, onNext = () => {} }) {
  const hasPlans = Array.isArray(visiblePlans) && visiblePlans.length > 0;
  if (!hasPlans) return null;

  return (
    <div className="pricing-section" id="pricing">
      <div className="pricing-inner">
        <div className="section-label">Тарифы</div>
        <div className="section-title">Начните бесплатно</div>
        <div className="pricing-carousel">
          <div className="carousel-row">
            <button className="carousel-btn carousel-btn-side" type="button" onClick={onPrev} aria-label="Предыдущие тарифы">‹</button>
            <div className="pricing-window">
              <div className="preview-frame preview-left">
                <div className="price-card preview">
                  <div className="price-plan">{prevPlan?.name ?? ''}</div>
                  <div className="price-amount">{prevPlan?.price ?? ''} <span>{prevPlan?.period ?? ''}</span></div>
                  <div className="price-desc">{prevPlan?.desc ?? ''}</div>
                </div>
              </div>
              <div className="pricing-grid">
                {visiblePlans.map((plan, i) => {
                  const safePlan = plan || {};
                  return (
                    <div className={`price-card${safePlan.popular ? " popular" : ""}`} key={i}>
                      {safePlan.popular && <div className="popular-badge">Популярный</div>}
                      <div className="price-plan">{safePlan.name ?? ''}</div>
                      <div className="price-amount">{safePlan.price ?? ''} <span>{safePlan.period ?? ''}</span></div>
                      <div className="price-desc">{safePlan.desc ?? ''}</div>
                      <ul className="price-features">
                        {(safePlan.features || []).map((f, j) => <li key={j}>{f}</li>)}
                      </ul>
                      {safePlan.limitations && safePlan.limitations.length > 0 && (
                        <ul className="price-limitations">
                          {safePlan.limitations.map((lim, j) => <li key={j} className="limitation-item">{lim}</li>)}
                        </ul>
                      )}
                      {safePlan.additional && safePlan.additional.length > 0 && (
                        <div className="price-additional">
                          <div className="additional-title">Дополнительно:</div>
                          <ul className="additional-list">
                            {safePlan.additional.map((add, j) => <li key={j} className="additional-item">{add}</li>)}
                          </ul>
                        </div>
                      )}
                      <button className={`price-btn${safePlan.primary ? " primary" : ""}`}>{safePlan.btn ?? ''}</button>
                    </div>
                  );
                })}
              </div>
              <div className="preview-frame preview-right">
                <div className="price-card preview">
                  <div className="price-plan">{nextPlan?.name ?? ''}</div>
                  <div className="price-amount">{nextPlan?.price ?? ''} <span>{nextPlan?.period ?? ''}</span></div>
                  <div className="price-desc">{nextPlan?.desc ?? ''}</div>
                </div>
              </div>
            </div>
            <button className="carousel-btn carousel-btn-side" type="button" onClick={onNext} aria-label="Следующие тарифы">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
