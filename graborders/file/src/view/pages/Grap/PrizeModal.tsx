import React, { useState, useEffect } from 'react';
import Dates from 'src/view/shared/utils/Dates';
import { i18n } from "../../../i18n";

function PrizeModal(props) {
    const { items, number, hideModal, submit } = props;
    const [isSpinning, setIsSpinning] = useState(true);
    const [showPrize, setShowPrize] = useState(false);
    const [glowIntensity, setGlowIntensity] = useState(0);

    const calcule__total = (price, comission) => {
        const total = (parseFloat(comission) / 100) * parseFloat(price);
        return total.toFixed(3);
    };

    useEffect(() => {
        // Start the spinning animation
        const spinTimer = setTimeout(() => {
            setIsSpinning(false);
            setShowPrize(true);
        }, 2000);

        // Glow effect animation
        const glowInterval = setInterval(() => {
            setGlowIntensity(prev => (prev + 1) % 3);
        }, 500);

        return () => {
            clearTimeout(spinTimer);
            clearInterval(glowInterval);
        };
    }, []);

    const getGlowClass = () => {
        const intensities = ['glow-soft', 'glow-medium', 'glow-strong'];
        return intensities[glowIntensity];
    };

    return (
        <div className="prize-modal-overlay">
            {/* Animated Background Elements */}
            <div className="floating-coins">
                <div className="coin coin-1">💰</div>
                <div className="coin coin-2">💎</div>
                <div className="coin coin-3">🪙</div>
                <div className="coin coin-4">💵</div>
                <div className="coin coin-5">💰</div>
            </div>

            <div className="confetti-container">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className={`confetti confetti-${i + 1}`}>🎉</div>
                ))}
            </div>

            <div className="prize-modal-container">
                <div className={`prize-modal-content ${getGlowClass()}`}>

                    {/* Close Button */}
                    <div className="close-button" onClick={hideModal}>
                        <i className="fa fa-times"></i>
                    </div>

                    {/* Header with Crown */}
                    <div className="prize-header">
                        <div className="crown-icon">👑</div>
                        <h2 className="prize-title">{i18n('pages.prizeModal.congratulations')}</h2>
                        <div className="crown-icon">👑</div>
                    </div>

                    {/* Spinning Prize Area */}
                    <div className="prize-display-area">
                        {isSpinning ? (
                            <div className="spinning-wheel">
                                <div className="wheel-inner">
                                    <div className="wheel-segment">🎁</div>
                                    <div className="wheel-segment">💎</div>
                                    <div className="wheel-segment">💰</div>
                                    <div className="wheel-segment">🏆</div>
                                </div>
                                <div className="spinning-text">{i18n('pages.prizeModal.spinning')}</div>
                            </div>
                        ) : (
                            <div className="prize-reveal">
                                <div className="prize-badge">{i18n('pages.prizeModal.prizeWon')}</div>
                                <div className="prize-item">
                                    <div className="prize-image-frame">
                                        {items?.photo && items?.photo[0]?.downloadUrl && (
                                            <img
                                                src={items?.photo[0]?.downloadUrl}
                                                alt={items?.title}
                                                className="prize-img"
                                            />
                                        )}
                                        <div className="sparkle sparkle-1">✨</div>
                                        <div className="sparkle sparkle-2">✨</div>
                                        <div className="sparkle sparkle-3">✨</div>
                                    </div>
                                    <div className="prize-details">
                                        <h3 className="prize-name">{items?.title}</h3>
                                        <div className="prize-amount-glow">
                                            {items?.amount} {i18n('pages.prizeModal.currency')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Prize Breakdown */}
                    <div className="prize-breakdown">
                        <div className="breakdown-header">{i18n('pages.prizeModal.prizeBreakdown')}</div>
                        <div className="breakdown-grid">
                            <div className="breakdown-item">
                                <span>{i18n('pages.prizeModal.totalAmount')}</span>
                                <span className="amount-gold">{items?.amount} {i18n('pages.prizeModal.currency')}</span>
                            </div>
                            <div className="breakdown-item highlight">
                                <span>{i18n('pages.prizeModal.yourWinnings')}</span>
                                <span className="winning-amount">
                                    {items?.amount} {i18n('pages.prizeModal.currency')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="prize-actions">
                        <button
                            className="btn-claim-glow"
                            onClick={submit}
                            disabled={isSpinning}
                        >
                            {i18n('pages.prizeModal.claimPrize')}
                        </button>
                    </div>

                    {/* Celebration Message */}
                    {showPrize && (
                        <div className="celebration-message">
                            {i18n('pages.prizeModal.celebrationMessage')}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .prize-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, 
                        rgba(106, 17, 203, 0.95) 0%, 
                        rgba(37, 117, 252, 0.95) 50%, 
                        rgba(255, 23, 68, 0.95) 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px;
                    z-index: 10000;
                    backdrop-filter: blur(10px);
                    overflow: hidden;
                }

                /* Floating Coins Animation */
                .floating-coins {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .coin {
                    position: absolute;
                    font-size: 20px;
                    animation: float 3s ease-in-out infinite;
                }

                .coin-1 { top: 10%; left: 5%; animation-delay: 0s; }
                .coin-2 { top: 15%; right: 5%; animation-delay: 0.5s; }
                .coin-3 { bottom: 25%; left: 10%; animation-delay: 1s; }
                .coin-4 { bottom: 15%; right: 10%; animation-delay: 1.5s; }
                .coin-5 { top: 35%; left: 50%; animation-delay: 2s; }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(180deg); }
                }

                /* Confetti Animation */
                .confetti-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .confetti {
                    position: absolute;
                    font-size: 14px;
                    animation: confetti-fall 3s linear infinite;
                }

                @keyframes confetti-fall {
                    0% { 
                        transform: translateY(-100px) rotate(0deg); 
                        opacity: 1;
                    }
                    100% { 
                        transform: translateY(100vh) rotate(360deg); 
                        opacity: 0;
                    }
                }

                /* Generate confetti positions */
                ${Array.from({ length: 15 }).map((_, i) => `
                    .confetti-${i + 1} {
                        left: ${Math.random() * 100}%;
                        animation-delay: ${Math.random() * 3}s;
                        animation-duration: ${2 + Math.random() * 2}s;
                    }
                `).join('')}

                .prize-modal-container {
                    width: 100%;
                    height: 100%;
                    max-width: 100%;
                    max-height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    perspective: 1000px;
                }

                .prize-modal-content {
                    background: linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.95) 0%, 
                        rgba(255, 245, 245, 0.98) 100%);
                    border-radius: 20px;
                    padding: 20px 15px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    border: 3px solid;
                    border-image: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4, #45b7d1) 1;
                    position: relative;
                    overflow-y: auto;
                    overflow-x: hidden;
                    transition: all 0.3s ease;
                    width: 100%;
                    max-width: 95%;
                    max-height: 95vh;
                    margin: 10px;
                }

                /* Close Button */
                .close-button {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 35px;
                    height: 35px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    border: 2px solid #E2E8F0;
                }

                .close-button:hover {
                    background: #F56565;
                    color: white;
                }

                .glow-soft {
                    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5),
                                0 0 60px rgba(255, 107, 107, 0.3);
                }

                .glow-medium {
                    box-shadow: 0 0 40px rgba(255, 215, 0, 0.7),
                                0 0 80px rgba(255, 107, 107, 0.5);
                }

                .glow-strong {
                    box-shadow: 0 0 50px rgba(255, 215, 0, 0.9),
                                0 0 100px rgba(255, 107, 107, 0.7);
                }

                .prize-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    margin-top: 10px;
                }

                .crown-icon {
                    font-size: 24px;
                    animation: bounce 2s ease-in-out infinite;
                }

                .prize-title {
                    background: linear-gradient(45deg, #FFD700, #FF6B6B, #4ECDC4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 20px;
                    font-weight: 900;
                    text-align: center;
                    margin: 0;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                    animation: text-glow 2s ease-in-out infinite alternate;
                }

                @keyframes text-glow {
                    from { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); }
                    to { text-shadow: 2px 2px 20px rgba(255, 215, 0, 0.5); }
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                .prize-display-area {
                    margin: 20px 0;
                    min-height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .spinning-wheel {
                    text-align: center;
                }

                .wheel-inner {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 15px;
                    animation: spin 1s linear infinite;
                }

                .wheel-segment {
                    font-size: 30px;
                    animation: bounce 1s ease-in-out infinite;
                }

                .wheel-segment:nth-child(1) { animation-delay: 0s; }
                .wheel-segment:nth-child(2) { animation-delay: 0.2s; }
                .wheel-segment:nth-child(3) { animation-delay: 0.4s; }
                .wheel-segment:nth-child(4) { animation-delay: 0.6s; }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .spinning-text {
                    font-size: 16px;
                    font-weight: 700;
                    color: #6a11cb;
                    animation: pulse 1s ease-in-out infinite;
                }

                .prize-reveal {
                    text-align: center;
                    animation: zoomIn 0.5s ease-out;
                    width: 100%;
                }

                @keyframes zoomIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .prize-badge {
                    background: linear-gradient(45deg, #FFD700, #FF6B6B);
                    color: white;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-weight: 900;
                    font-size: 14px;
                    margin-bottom: 15px;
                    display: inline-block;
                    animation: bounce 2s ease-in-out infinite;
                }

                .prize-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                    background: rgba(255, 255, 255, 0.8);
                    padding: 15px;
                    border-radius: 15px;
                    border: 2px solid gold;
                    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
                    width: 100%;
                    max-width: 300px;
                    margin: 0 auto;
                }

                .prize-image-frame {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 3px solid #FFD700;
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                }

                .prize-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .sparkle {
                    position: absolute;
                    font-size: 14px;
                    animation: sparkle 2s ease-in-out infinite;
                }

                .sparkle-1 { top: 5px; left: 5px; animation-delay: 0s; }
                .sparkle-2 { top: 5px; right: 5px; animation-delay: 0.5s; }
                .sparkle-3 { bottom: 5px; left: 50%; animation-delay: 1s; }

                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1); }
                }

                .prize-details {
                    text-align: center;
                    width: 100%;
                }

                .prize-name {
                    font-size: 16px;
                    font-weight: 700;
                    color: #2D3748 !important;
                    margin: 0 0 8px 0;
                    line-height: 1.3;
                }

                .prize-amount-glow {
                    font-size: 18px;
                    font-weight: 900;
                    background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .prize-order-info {
                    margin: 15px 0;
                }

                .info-card {
                    background: rgba(255, 255, 255, 0.9);
                    padding: 12px;
                    border-radius: 12px;
                    border: 2px dashed #4ECDC4;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 0;
                    font-size: 14px;
                }

                .info-label {
                    font-weight: 600;
                    color: #4A5568;
                }

                .info-value {
                    font-weight: 700;
                    color: #2D3748;
                }

                .prize-breakdown {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 15px;
                    border-radius: 15px;
                    margin: 15px 0;
                    color: white;
                }

                .breakdown-header {
                    font-size: 16px;
                    font-weight: 900;
                    margin-bottom: 12px;
                    text-align: center;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                }

                .breakdown-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .breakdown-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    font-size: 14px;
                }

                .breakdown-item.highlight {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 12px;
                    border-radius: 8px;
                    border: none;
                    margin-top: 5px;
                }

                .amount-gold {
                    color: #FFD700;
                    font-weight: 900;
                    font-size: 14px;
                }

                .rate-sparkle {
                    color: #4ECDC4;
                    font-weight: 900;
                }

                .winning-amount {
                    color: #FFD700;
                    font-weight: 900;
                    font-size: 16px;
                    animation: pulse 1s ease-in-out infinite;
                }

                .prize-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 20px;
                }

                .btn-claim-glow {
                    background: linear-gradient(45deg, #FFD700, #FF6B6B, #4ECDC4);
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 900;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    animation: glow 2s ease-in-out infinite alternate;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                    width: 100%;
                }

                .btn-claim-glow:hover:not(:disabled) {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
                }

                .btn-claim-glow:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                @keyframes glow {
                    from { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
                    to { box-shadow: 0 0 25px rgba(255, 107, 107, 0.8), 
                                 0 0 35px rgba(78, 205, 196, 0.6); }
                }

                .btn-later {
                    background: transparent;
                    color: #718096;
                    border: 2px solid #E2E8F0;
                    padding: 12px;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                }

                .btn-later:hover {
                    background: #F7FAFC;
                    border-color: #4299E1;
                    color: #4299E1;
                }

                .celebration-message {
                    text-align: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: #FF6B6B;
                    margin-top: 12px;
                    animation: bounce 1s ease-in-out infinite;
                    padding: 0 10px;
                }

                /* Mobile-first responsive design */
                @media (max-width: 480px) {
                    .prize-modal-overlay {
                        padding: 5px;
                    }

                    .prize-modal-content {
                        padding: 15px 10px;
                        max-width: 100%;
                        max-height: 100vh;
                        margin: 0;
                        border-radius: 15px;
                    }

                    .prize-header {
                        gap: 8px;
                        margin-bottom: 15px;
                    }

                    .crown-icon {
                        font-size: 20px;
                    }

                    .prize-title {
                        font-size: 18px;
                    }

                    .prize-display-area {
                        margin: 15px 0;
                        min-height: 120px;
                    }

                    .wheel-segment {
                        font-size: 24px;
                    }

                    .prize-item {
                        padding: 12px;
                        gap: 12px;
                    }

                    .prize-image-frame {
                        width: 70px;
                        height: 70px;
                    }

                    .prize-name {
                        font-size: 15px;
                    }

                    .prize-amount-glow {
                        font-size: 16px;
                    }

                    .info-row {
                        font-size: 13px;
                    }

                    .breakdown-item {
                        font-size: 13px;
                    }

                    .btn-claim-glow {
                        padding: 14px;
                        font-size: 15px;
                    }

                    .close-button {
                        top: 10px;
                        right: 10px;
                        width: 30px;
                        height: 30px;
                    }
                }

                /* Extra small devices */
                @media (max-width: 360px) {
                    .prize-modal-content {
                        padding: 12px 8px;
                    }

                    .prize-title {
                        font-size: 16px;
                    }

                    .prize-header {
                        gap: 5px;
                    margin-bottom: 12px;
                    flex-wrap: wrap;
                    text-align: center;
                    margin-top: 20px;
                    margin-bottom: 15px;
                    padding: 0 5px;
                    gap: 8px;
                    align-items: center;
                    justify-content: center;
                    flex-direction: row;
                    width: 100%;
                    box-sizing: border-box;
                    min-height: auto;
                    line-height: 1.2;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    hyphens: auto;
                    position: relative;
                    z-index: 1;
                    pointer-events: none;
                }

                    .crown-icon {
                        font-size: 18px;
                        flex-shrink: 0;
                    }

                    .prize-title {
                        font-size: 16px;
                        line-height: 1.2;
                        word-break: break-word;
                        hyphens: auto;
                        flex: 1;
                        min-width: 0;
                        margin: 0 5px;
                    }
                }

                /* Landscape mode support */
                @media (max-height: 600px) and (orientation: landscape) {
                    .prize-modal-content {
                        max-height: 90vh;
                        overflow-y: auto;
                        padding: 15px;
                    }

                    .prize-display-area {
                        min-height: 100px;
                        margin: 10px 0;
                    }

                    .prize-item {
                        flex-direction: row;
                        max-width: 100%;
                    }

                    .prize-details {
                        text-align: left;
                    }
                }

                /* Prevent horizontal scroll */
                body.modal-open {
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}

export default PrizeModal;