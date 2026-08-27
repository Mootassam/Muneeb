import React, { useEffect, useState } from 'react';
import { i18n } from '../../../i18n';

const STEPS = [
  { icon: '⚡', key: 'initiatingOrder' },
  { icon: '🔍', key: 'searchingMarketplaces' },
  { icon: '🏬', key: 'searchingMerchants' },
  { icon: '📦', key: 'orderFound' },
  { icon: '✅', key: 'matchingSuccessful' },
];

const STEP_DURATION = 1000;
const TOTAL_DURATION = STEPS.length * STEP_DURATION;

function ProcessingOrderModal(props) {
  const { onComplete } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [barFilled, setBarFilled] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setBarFilled(true));

    const stepTimer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1 < STEPS.length ? prev + 1 : prev));
    }, STEP_DURATION);

    const doneTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, TOTAL_DURATION);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(stepTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="processing-overlay">
      <div className="processing-card">
        <div className="processing-title">
          {i18n('pages.grab.processingOrder.title')}
        </div>

        <div className="processing-progress-track">
          <div
            className="processing-progress-fill"
            style={{ width: barFilled ? '100%' : '0%' }}
          />
        </div>

        <div className="processing-steps">
          {STEPS.map((step, index) => {
            let stateClass = 'upcoming';
            if (index === activeIndex) {
              stateClass = 'active';
            } else if (index < activeIndex) {
              stateClass = 'done';
            }

            return (
              <div
                className={`processing-step processing-step--${stateClass}`}
                key={step.key}
              >
                <span className="processing-step-icon">{step.icon}</span>
                <span className="processing-step-label">
                  {i18n(`pages.grab.processingOrder.${step.key}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .processing-overlay {
          position: fixed;
          inset: 0;
          background: var(--overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1100;
          font-family: "Poppins", sans-serif;
        }

        .processing-card {
          width: 100%;
          max-width: 340px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px 20px;
          box-shadow: 0 25px 60px -15px rgba(15, 17, 17, 0.35);
        }

        .processing-title {
          text-align: center;
          color: var(--text-primary);
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .processing-progress-track {
          height: 6px;
          background: var(--bg-surface-2);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .processing-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-grad-start), var(--accent-grad-end));
          border-radius: 6px;
          transition: width ${TOTAL_DURATION}ms linear;
        }

        .processing-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .processing-step {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          border: 1px solid transparent;
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }

        .processing-step-icon {
          font-size: 15px;
          line-height: 1;
        }

        .processing-step--upcoming {
          background: var(--bg-card-alt);
          border-color: var(--border);
          color: var(--text-muted);
        }

        .processing-step--active {
          background: linear-gradient(90deg, var(--accent-grad-start), var(--accent-grad-end));
          border-color: var(--accent-border);
          color: var(--accent-text-on);
          box-shadow: 0 6px 16px -6px rgba(255, 138, 0, 0.6);
        }

        .processing-step--done {
          background: var(--success-bg);
          border-color: var(--success);
          color: var(--success);
        }
      `}</style>
    </div>
  );
}

export default ProcessingOrderModal;
