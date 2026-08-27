import React from 'react';

function GrapProductList(props) {
  const { products } = props;
  const list = (products || []).filter(Boolean);

  return (
    <div className="grap-product-list">
      {list.map((product, index) => (
        <div className="grap-product-row" key={product.id || index}>
          <img
            className="grap-product-thumb"
            src={
              product.image ||
              product.photo?.[0]?.downloadUrl ||
              'https://via.placeholder.com/56'
            }
            alt={product.title}
            loading="lazy"
          />
          <div className="grap-product-info">
            <span className="grap-product-title">{product.title}</span>
            <span className="grap-product-amount">{product.amount}</span>
          </div>
        </div>
      ))}

      <style>{`
        .grap-product-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          max-height: 260px;
          overflow-y: auto;
        }

        .grap-product-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
        }

        .grap-product-thumb {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
          background: var(--bg-card);
          flex-shrink: 0;
        }

        .grap-product-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          flex: 1;
        }

        .grap-product-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .grap-product-amount {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--accent-strong);
        }
      `}</style>
    </div>
  );
}

export default GrapProductList;
