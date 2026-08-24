import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { i18n } from 'src/i18n';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import ComboService from 'src/modules/combo/comboService';
import ProductService from 'src/modules/product/productService';

function formatCurrency(value) {
  const num = parseFloat(value) || 0;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function nextAvailablePosition(productPositions, comboList) {
  const used = [
    ...Object.values(productPositions),
    ...comboList.map((c) => c.itemNumber),
  ]
    .map(Number)
    .filter((n) => !isNaN(n));

  return used.length ? Math.max(...used) + 1 : 1;
}

function SequenceForm(props) {
  const record = props.record || {};

  const [title, setTitle] = useState(record.title || '');
  const [titleError, setTitleError] = useState(false);

  const [combos, setCombos] = useState(() =>
    (record.combos || [])
      .filter((c) => c.product)
      .map((c) => ({
        product: {
          id: c.product.id,
          title: c.product.title,
          amount: c.product.amount,
        },
        itemNumber: c.itemNumber,
      })),
  );
  const [selectedCombo, setSelectedCombo] = useState<{
    value: string;
    label: string;
    amount?: any;
  } | null>(null);
  const [taskCountInput, setTaskCountInput] = useState(1);
  const [comboOptions, setComboOptions] = useState<
    Array<{ value: string; label: string; amount?: any }>
  >([]);
  const [loadingCombos, setLoadingCombos] = useState(true);

  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {};
      (record.products || [])
        .filter((p) => p.product)
        .forEach((p) => {
          initial[p.product.id] = p.itemNumber;
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
        const response = await ComboService.list({}, 'title_ASC', null, null);
        setComboOptions(
          (response.rows || []).map((row) => ({
            value: row.id,
            label: row.title,
            amount: row.amount,
          })),
        );
      } finally {
        setLoadingCombos(false);
      }
    })();

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

    const next: Record<string, number> = {};
    let counter = nextAvailablePosition({}, combos);
    allProducts.forEach((p) => {
      next[p.id] = counter++;
    });
    setSelectedProducts(next);
  };

  const doToggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const next = { ...prev };
      if (next[product.id] !== undefined) {
        delete next[product.id];
      } else {
        next[product.id] = nextAvailablePosition(prev, combos);
      }
      return next;
    });
  };

  const doChangeSerial = (productId, value) => {
    const num = value === '' ? 0 : Number(value);
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: isNaN(num) ? 0 : num,
    }));
  };

  const doAddCombo = () => {
    if (!selectedCombo) {
      return;
    }
    const taskCount = Number(taskCountInput);
    if (!taskCount || taskCount < 1) {
      return;
    }

    const newCombo = {
      product: {
        id: selectedCombo.value,
        title: selectedCombo.label,
        amount: selectedCombo.amount,
      },
      itemNumber: taskCount,
    };
    const updatedCombos = [...combos, newCombo];

    setCombos(updatedCombos);
    setSelectedCombo(null);
    setTaskCountInput(nextAvailablePosition(selectedProducts, updatedCombos));
  };

  const doRemoveCombo = (index) => {
    setCombos((prev) => prev.filter((_, i) => i !== index));
  };

  const doSubmit = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    const productsPayload = selectedProductIds.map((id) => ({
      product: id,
      itemNumber: selectedProducts[id],
    }));

    const combosPayload = combos.map((c) => ({
      product: c.product.id,
      itemNumber: c.itemNumber,
    }));

    props.onSubmit(record.id, {
      title: title.trim(),
      products: productsPayload,
      combos: combosPayload,
    });
  };

  return (
    <div className="sq-form">
      <div className="sq-field">
        <label className="sq-label required" htmlFor="sequence-title">
          {i18n('entities.sequence.fields.title')}
        </label>
        <input
          id="sequence-title"
          type="text"
          className={`sq-input ${titleError ? 'is-invalid' : ''}`}
          placeholder={i18n('entities.sequence.new.namePlaceholder')}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) {
              setTitleError(false);
            }
          }}
        />
        {titleError && (
          <div className="sq-error">
            {i18n('entities.sequence.fields.title')} is required
          </div>
        )}
      </div>

      <div className="sq-section-bar">
        {i18n('entities.sequence.fields.assignCombos')}
      </div>

      <div className="sq-combo-row">
        <div className="sq-combo-select">
          <label className="sq-label">
            {i18n('entities.sequence.fields.selectCombo')}
          </label>
          <Select
            classNamePrefix="sq-select"
            placeholder={i18n('entities.sequence.fields.selectCombo')}
            options={comboOptions}
            value={selectedCombo}
            onChange={(option) => setSelectedCombo(option)}
            isLoading={loadingCombos}
            isClearable
          />
        </div>
        <div className="sq-taskcount">
          <label className="sq-label">
            {i18n('entities.sequence.fields.taskCount')}
          </label>
          <input
            type="number"
            min={1}
            className="sq-input"
            value={taskCountInput}
            onChange={(e) => setTaskCountInput(Number(e.target.value))}
          />
        </div>
        <button
          type="button"
          className="sq-add-btn"
          onClick={doAddCombo}
          disabled={!selectedCombo}
        >
          {i18n('common.add')}
        </button>
      </div>

      {combos.length === 0 ? (
        <p className="sq-empty-hint">
          {i18n('entities.sequence.fields.noCombosAssigned')}
        </p>
      ) : (
        <div className="sq-combo-list">
          {combos.map((combo, index) => (
            <div className="sq-combo-chip" key={`${combo.product.id}-${index}`}>
              <span className="sq-combo-chip-position">
                #{combo.itemNumber}
              </span>
              <span className="sq-combo-chip-title">
                {combo.product.title}
              </span>
              <span className="sq-combo-chip-amount">
                {formatCurrency(combo.product.amount)}$
              </span>
              <button
                type="button"
                className="sq-combo-chip-remove"
                onClick={() => doRemoveCombo(index)}
              >
                <i className="fas fa-times" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="sq-products-header">
        <div>
          <h6 className="sq-products-title">
            {i18n('entities.sequence.fields.selectProducts')}
          </h6>
          <span className="sq-total">
            {i18n('entities.sequence.fields.total')}: (
            {formatCurrency(total)} USDT)
          </span>
        </div>
        <div className="sq-select-all">
          <label className="sq-select-all-label">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={doToggleSelectAll}
            />
            &nbsp;{i18n('entities.sequence.fields.selectAll')}
          </label>
          <span className="sq-selected-count">
            {selectedProductIds.length} selected
          </span>
        </div>
      </div>

      <div className="sq-search">
        <i className="fas fa-search sq-search-icon" />
        <input
          type="text"
          className="sq-search-input"
          placeholder={i18n('entities.sequence.fields.searchByName')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sq-products-table-wrapper">
        <table className="sq-products-table">
          <thead>
            <tr>
              <th className="sq-col-checkbox" />
              <th className="sq-col-serial">
                {i18n('entities.sequence.fields.serial')}
              </th>
              <th>{i18n('entities.sequence.fields.product')}</th>
            </tr>
          </thead>
          <tbody>
            {loadingProducts && (
              <tr>
                <td colSpan={3} className="sq-loading-cell">
                  {i18n('table.loading')}
                </td>
              </tr>
            )}
            {!loadingProducts && filteredProducts.length === 0 && (
              <tr>
                <td colSpan={3} className="sq-loading-cell">
                  {i18n('table.noData')}
                </td>
              </tr>
            )}
            {!loadingProducts &&
              filteredProducts.map((product) => {
                const checked = selectedProducts[product.id] !== undefined;
                return (
                  <tr key={product.id} className={checked ? 'sq-row-checked' : ''}>
                    <td className="sq-col-checkbox">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => doToggleProduct(product)}
                      />
                    </td>
                    <td className="sq-col-serial">
                      <input
                        type="number"
                        className="sq-serial-input"
                        disabled={!checked}
                        value={checked ? selectedProducts[product.id] : ''}
                        onChange={(e) =>
                          doChangeSerial(product.id, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <div className="sq-product-cell">
                        <img
                          className="sq-product-thumb"
                          src={
                            product.image ||
                            product.photo?.[0]?.downloadUrl ||
                            'https://via.placeholder.com/40'
                          }
                          alt={product.title}
                          loading="lazy"
                        />
                        <div className="sq-product-info">
                          <span className="sq-product-title">
                            {product.title}
                          </span>
                          <span className="sq-product-price">
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

      <div className="sq-footer">
        <button
          type="button"
          className="sq-submit-btn"
          disabled={props.saveLoading}
          onClick={doSubmit}
        >
          <ButtonIcon loading={props.saveLoading} />
          {!props.saveLoading &&
            (props.isEditing ? i18n('common.save') : i18n('common.create'))}
        </button>
      </div>

      <style>{`
        .sq-form {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
          border: 1px solid #eef1f5;
        }

        .sq-field {
          margin-bottom: 20px;
          max-width: 480px;
        }

        .sq-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .sq-label.required::after {
          content: ' *';
          color: #e53e3e;
        }

        .sq-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          color: #1a202c;
        }

        .sq-input:focus {
          outline: none;
          border-color: #7c6cf0;
          box-shadow: 0 0 0 3px rgba(124, 108, 240, 0.15);
        }

        .sq-input.is-invalid {
          border-color: #f56565;
        }

        .sq-error {
          margin-top: 6px;
          font-size: 12px;
          color: #e53e3e;
        }

        .sq-section-bar {
          background: #f1f5f9;
          color: #475569;
          font-weight: 600;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .sq-combo-row {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .sq-combo-select {
          flex: 1 1 320px;
          min-width: 240px;
        }

        .sq-taskcount {
          width: 110px;
          flex-shrink: 0;
        }

        .sq-add-btn {
          height: 38px;
          padding: 0 20px;
          border: none;
          border-radius: 10px;
          background: #6c5ce7;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }

        .sq-add-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sq-add-btn:hover:not(:disabled) {
          background: #5b4bd6;
        }

        .sq-empty-hint {
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
          padding: 16px 0;
          margin-bottom: 8px;
          border: 1px dashed #e2e8f0;
          border-radius: 8px;
        }

        .sq-combo-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .sq-combo-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .sq-combo-chip-position {
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          background: #6c5ce7;
          border-radius: 6px;
          padding: 2px 6px;
        }

        .sq-combo-chip-title {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: #1a202c;
        }

        .sq-combo-chip-amount {
          font-size: 12px;
          font-weight: 700;
          color: #e53e3e;
        }

        .sq-combo-chip-remove {
          border: none;
          background: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 13px;
          padding: 2px 4px;
        }

        .sq-combo-chip-remove:hover {
          color: #e53e3e;
        }

        .sq-products-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-top: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .sq-products-title {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 700;
          color: #1a202c;
        }

        .sq-total {
          font-size: 12px;
          color: #64748b;
        }

        .sq-select-all {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .sq-select-all-label {
          font-size: 13px;
          color: #1a202c;
          cursor: pointer;
        }

        .sq-selected-count {
          font-size: 12px;
          color: #94a3b8;
        }

        .sq-search {
          position: relative;
          margin-bottom: 12px;
        }

        .sq-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          font-size: 13px;
        }

        .sq-search-input {
          width: 100%;
          padding: 9px 12px 9px 34px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
        }

        .sq-search-input:focus {
          outline: none;
          border-color: #7c6cf0;
          box-shadow: 0 0 0 3px rgba(124, 108, 240, 0.15);
        }

        .sq-products-table-wrapper {
          max-height: 420px;
          overflow-y: auto;
          border: 1px solid #eef1f5;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .sq-products-table {
          width: 100%;
          border-collapse: collapse;
        }

        .sq-products-table thead th {
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

        .sq-products-table tbody td {
          padding: 8px 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .sq-row-checked {
          background: #f5f3ff;
        }

        .sq-col-checkbox {
          width: 36px;
        }

        .sq-col-serial {
          width: 90px;
        }

        .sq-serial-input {
          width: 64px;
          padding: 6px 8px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          text-align: center;
        }

        .sq-serial-input:disabled {
          background: #f1f5f9;
          color: #cbd5e1;
        }

        .sq-product-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sq-product-thumb {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          object-fit: cover;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .sq-product-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sq-product-title {
          font-size: 13px;
          color: #1a202c;
        }

        .sq-product-price {
          font-size: 12px;
          font-weight: 600;
          color: #16a34a;
        }

        .sq-loading-cell {
          text-align: center;
          padding: 30px !important;
          color: #94a3b8;
        }

        .sq-footer {
          display: flex;
          justify-content: flex-end;
        }

        .sq-submit-btn {
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

        .sq-submit-btn:hover:not(:disabled) {
          background: #5b4bd6;
        }

        .sq-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default SequenceForm;
