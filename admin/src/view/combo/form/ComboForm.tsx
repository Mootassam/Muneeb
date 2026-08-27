import React, { useEffect, useMemo, useState } from 'react';
import { i18n } from 'src/i18n';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import ProductService from 'src/modules/product/productService';

function formatCurrency(value) {
  const num = parseFloat(value) || 0;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function ComboForm(props) {
  const record = props.record || {};

  const [title, setTitle] = useState(record.title || '');
  const [titleError, setTitleError] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState<Record<string, true>>(
    () => {
      const initial: Record<string, true> = {};
      (record.products || [])
        .filter((p) => p.product)
        .forEach((p) => {
          initial[p.product.id] = true;
        });
      return initial;
    },
  );
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await ProductService.list(
          { type: 'normal' },
          'title_ASC',
          null,
          null,
        );
        setAllProducts(response.rows || []);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  const productsById = useMemo(() => {
    const map: Record<string, any> = {};
    allProducts.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) {
      return allProducts;
    }
    const q = search.trim().toLowerCase();
    return allProducts.filter((p) =>
      (p.title || '').toLowerCase().includes(q),
    );
  }, [allProducts, search]);

  const selectedProductIds = Object.keys(selectedProducts);
  const total = selectedProductIds.reduce((sum, id) => {
    return sum + (parseFloat(productsById[id]?.amount) || 0);
  }, 0);
  const isAllSelected =
    allProducts.length > 0 &&
    allProducts.every((p) => selectedProducts[p.id] !== undefined);

  const doToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProducts({});
      return;
    }

    const next: Record<string, true> = {};
    allProducts.forEach((p) => {
      next[p.id] = true;
    });
    setSelectedProducts(next);
  };

  const doToggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const next = { ...prev };
      if (next[product.id] !== undefined) {
        delete next[product.id];
      } else {
        next[product.id] = true;
      }
      return next;
    });
  };

  const doSubmit = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    props.onSubmit(record.id, {
      title: title.trim(),
      products: selectedProductIds,
    });
  };

  return (
    <div className="combo-form">
      <div className="combo-field">
        <label className="combo-label required" htmlFor="combo-title">
          {i18n('entities.combo.fields.title')}
        </label>
        <input
          id="combo-title"
          type="text"
          className={`combo-input ${titleError ? 'is-invalid' : ''}`}
          placeholder={i18n('entities.combo.new.namePlaceholder')}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) {
              setTitleError(false);
            }
          }}
        />
        {titleError && (
          <div className="combo-error">
            {i18n('entities.combo.fields.title')} is required
          </div>
        )}
      </div>

      <div className="combo-products-header">
        <div>
          <h6 className="combo-products-title">
            {i18n('entities.combo.fields.selectProducts')}
          </h6>
          <span className="combo-total">
            {i18n('entities.combo.fields.total')}: (
            {formatCurrency(total)} USDT)
          </span>
        </div>
        <div className="combo-select-all">
          <label className="combo-select-all-label">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={doToggleSelectAll}
            />
            &nbsp;{i18n('entities.combo.fields.selectAll')}
          </label>
          <span className="combo-selected-count">
            {selectedProductIds.length} selected
          </span>
        </div>
      </div>

      <div className="combo-search">
        <i className="fas fa-search combo-search-icon" />
        <input
          type="text"
          className="combo-search-input"
          placeholder={i18n('entities.combo.fields.searchByName')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="combo-products-table-wrapper">
        <table className="combo-products-table">
          <thead>
            <tr>
              <th className="combo-col-checkbox" />
              <th>{i18n('entities.combo.fields.product')}</th>
            </tr>
          </thead>
          <tbody>
            {loadingProducts && (
              <tr>
                <td colSpan={2} className="combo-loading-cell">
                  {i18n('table.loading')}
                </td>
              </tr>
            )}
            {!loadingProducts && filteredProducts.length === 0 && (
              <tr>
                <td colSpan={2} className="combo-loading-cell">
                  {i18n('table.noData')}
                </td>
              </tr>
            )}
            {!loadingProducts &&
              filteredProducts.map((product) => {
                const checked = selectedProducts[product.id] !== undefined;
                return (
                  <tr
                    key={product.id}
                    className={checked ? 'combo-row-checked' : ''}
                  >
                    <td className="combo-col-checkbox">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => doToggleProduct(product)}
                      />
                    </td>
                    <td>
                      <div className="combo-product-cell">
                        <img
                          className="combo-product-thumb"
                          src={
                            product.image ||
                            product.photo?.[0]?.downloadUrl ||
                            'https://via.placeholder.com/40'
                          }
                          alt={product.title}
                          loading="lazy"
                        />
                        <div className="combo-product-info">
                          <span className="combo-product-title">
                            {product.title}
                          </span>
                          <span className="combo-product-price">
                            {formatCurrency(product.amount)} USDT
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="combo-footer">
        <button
          type="button"
          className="combo-submit-btn"
          disabled={props.saveLoading}
          onClick={doSubmit}
        >
          <ButtonIcon loading={props.saveLoading} />
          {!props.saveLoading &&
            (props.isEditing ? i18n('common.save') : i18n('common.create'))}
        </button>
      </div>

      <style>{`
        .combo-form {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
          border: 1px solid #eef1f5;
        }

        .combo-field {
          margin-bottom: 20px;
          max-width: 480px;
        }

        .combo-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .combo-label.required::after {
          content: ' *';
          color: #e53e3e;
        }

        .combo-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          color: #1a202c;
        }

        .combo-input:focus {
          outline: none;
          border-color: #7c6cf0;
          box-shadow: 0 0 0 3px rgba(124, 108, 240, 0.15);
        }

        .combo-input.is-invalid {
          border-color: #f56565;
        }

        .combo-error {
          margin-top: 6px;
          font-size: 12px;
          color: #e53e3e;
        }

        .combo-products-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-top: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .combo-products-title {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 700;
          color: #1a202c;
        }

        .combo-total {
          font-size: 12px;
          color: #64748b;
        }

        .combo-select-all {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .combo-select-all-label {
          font-size: 13px;
          color: #1a202c;
          cursor: pointer;
        }

        .combo-selected-count {
          font-size: 12px;
          color: #94a3b8;
        }

        .combo-search {
          position: relative;
          margin-bottom: 12px;
        }

        .combo-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          font-size: 13px;
        }

        .combo-search-input {
          width: 100%;
          padding: 9px 12px 9px 34px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
        }

        .combo-search-input:focus {
          outline: none;
          border-color: #7c6cf0;
          box-shadow: 0 0 0 3px rgba(124, 108, 240, 0.15);
        }

        .combo-products-table-wrapper {
          max-height: 420px;
          overflow-y: auto;
          border: 1px solid #eef1f5;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .combo-products-table {
          width: 100%;
          border-collapse: collapse;
        }

        .combo-products-table thead th {
          position: sticky;
          top: 0;
          background: #f8fafc;
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          padding: 10px 12px;
          border-bottom: 2px solid #eef1f5;
          z-index: 1;
        }

        .combo-products-table tbody td {
          padding: 8px 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .combo-row-checked {
          background: #f5f3ff;
        }

        .combo-col-checkbox {
          width: 36px;
        }

        .combo-product-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .combo-product-thumb {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          object-fit: cover;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .combo-product-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .combo-product-title {
          font-size: 13px;
          color: #1a202c;
        }

        .combo-product-price {
          font-size: 12px;
          font-weight: 600;
          color: #16a34a;
        }

        .combo-loading-cell {
          text-align: center;
          padding: 30px !important;
          color: #94a3b8;
        }

        .combo-footer {
          display: flex;
          justify-content: flex-end;
        }

        .combo-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-width: 100px;
          justify-content: center;
          padding: 11px 28px;
          border: none;
          border-radius: 10px;
          background: #6c5ce7;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .combo-submit-btn:hover:not(:disabled) {
          background: #5b4bd6;
        }

        .combo-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default ComboForm;
