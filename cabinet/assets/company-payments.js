/* global BizFlowShell */
(function () {
    'use strict';

    const historyData = [
        { date: '21.06.2025', plan: 'Business', amount: '2 990 ₽', status: 'Оплачено', ok: true },
        { date: '21.05.2025', plan: 'Business', amount: '2 990 ₽', status: 'Оплачено', ok: true },
        { date: '21.04.2025', plan: 'Business', amount: '2 990 ₽', status: 'Оплачено', ok: true },
        { date: '21.03.2025', plan: 'Business', amount: '2 990 ₽', status: 'Оплачено', ok: true },
        { date: '21.02.2025', plan: 'Business', amount: '2 990 ₽', status: 'Оплачено', ok: true }
    ];

    function renderCurrentPlan() {
        const el = document.getElementById('currentPlanCard');
        if (!el) return;
        el.innerHTML = `
            <header class="pay-card-head">
                <h3>Текущий тариф</h3>
                <span class="pay-badge pay-badge--active">Активен</span>
            </header>
            <h2 class="pay-current-title">Business</h2>
            <ul class="pay-plan-features pay-plan-features--current">
                <li>✓ До 500 диалогов в месяц</li>
                <li>✓ До 5 ролей AI</li>
                <li>✓ Аналитика и воронка</li>
                <li>✓ Запись на консультацию</li>
            </ul>
            <div class="pay-current-divider"></div>
            <div class="pay-current-to-pay">
                <div class="pay-label">К оплате</div>
                <div class="pay-current-price">2 990 ₽<span>/мес</span></div>
                <div class="pay-next-charge">Следующее списание: 21.07.2025</div>
            </div>
        `;
    }

    function renderHistory() {
        const body = document.getElementById('paymentsHistoryBody');
        if (!body) return;
        body.innerHTML = historyData.map(row => `
            <tr>
                <td>${row.date}</td>
                <td>${row.plan}</td>
                <td>${row.amount}</td>
                <td class="pay-status ${row.ok ? 'pay-status--ok' : ''}">${row.ok ? '✓' : ''} ${row.status}</td>
            </tr>
        `).join('');
    }

    function renderSubscriptionDetails() {
        const el = document.getElementById('subscriptionDetails');
        if (!el) return;
        const rows = [
            { label: 'Статус', value: 'Активна', badge: 'pay-badge pay-badge--active' },
            { label: 'Тариф', value: 'Business' },
            { label: 'Период', value: '21.06.2025 — 21.07.2025' },
            { label: 'Следующее списание', value: '21.07.2025' },
            { label: 'Сумма', value: '2 990 ₽' }
        ];
        el.innerHTML = rows.map(r => `
            <div class="pay-detail-row">
                <span>${r.label}</span>
                ${r.badge ? `<span class="${r.badge}">${r.value}</span>` : `<strong>${r.value}</strong>`}
            </div>
        `).join('');
    }

    function bindMethodTabs() {
        const tabs = document.querySelectorAll('.pay-method-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const method = tab.dataset.method;
                const cardView = document.getElementById('methodCardView');
                let alt = document.getElementById('methodAltView');
                if (method === 'card') {
                    cardView.style.display = '';
                    if (alt) alt.style.display = 'none';
                } else {
                    cardView.style.display = 'none';
                    if (!alt) {
                        alt = document.createElement('div');
                        alt.id = 'methodAltView';
                        alt.className = 'pay-method-alt';
                        cardView.parentNode.appendChild(alt);
                    }
                    const label = method === 'sbp' ? 'СБП' : 'ЮMoney';
                    alt.innerHTML = `
                        <p>Выбран способ оплаты — <strong>${label}</strong>.</p>
                        <p>Подключение произойдёт после подтверждения оплаты.</p>
                    `;
                    alt.style.display = '';
                }
            });
        });
    }

    function bindSaveCard() {
        const btn = document.getElementById('saveCardBtn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const origText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Сохраняем...';
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = '✓ Карта сохранена';
                setTimeout(() => (btn.textContent = origText), 2500);
            }, 1200);
        });
    }

    function bindInvoice() {
        const btn = document.getElementById('requestInvoiceBtn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const orig = btn.textContent;
            btn.textContent = '✓ Запрос отправлен';
            setTimeout(() => (btn.textContent = orig), 2500);
        });
    }

    function bindPlanButtons() {
        document.querySelectorAll('.pay-plan-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const plan = btn.dataset.plan || 'тариф';
                console.log('Переход на тариф:', plan);
            });
        });
    }

    function init() {
        if (window.BizFlowShell && typeof BizFlowShell.ready === 'object' && BizFlowShell.ready && typeof BizFlowShell.ready.then === 'function') {
            BizFlowShell.ready.then(function () {
                renderCurrentPlan();
                renderHistory();
                renderSubscriptionDetails();
                bindMethodTabs();
                bindSaveCard();
                bindInvoice();
                bindPlanButtons();
            });
        } else {
            renderCurrentPlan();
            renderHistory();
            renderSubscriptionDetails();
            bindMethodTabs();
            bindSaveCard();
            bindInvoice();
            bindPlanButtons();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
