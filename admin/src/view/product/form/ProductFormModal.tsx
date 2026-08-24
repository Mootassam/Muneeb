import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { i18n } from 'src/i18n';
import Errors from 'src/modules/shared/error/errors';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import ProductService from 'src/modules/product/productService';
import yupFormSchemas from 'src/modules/shared/yup/yupFormSchemas';
import FormErrors from 'src/view/shared/form/formErrors';

const schema = yup.object().shape({
  title: yupFormSchemas.string(
    i18n('entities.product.fields.title'),
    { required: true },
  ),
  amount: yupFormSchemas.decimal(
    i18n('entities.product.fields.amount'),
    { required: true, min: 0 },
  ),
  active: yupFormSchemas.boolean(
    i18n('entities.product.fields.active'),
  ),
  image: yupFormSchemas.string(
    i18n('entities.product.fields.image'),
    {},
  ),
});

function ProductFormModal(props) {
  const modalRef = useRef<any>();
  const [saveLoading, setSaveLoading] = useState(false);

  const entity = props.entity || 'product';
  const type = props.type || 'normal';
  const showActive = props.showActive !== false;
  const isEditing = Boolean(props.record?.id);

  const {
    register,
    handleSubmit,
    errors,
    formState: { touched, isSubmitted },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      title: props.record?.title || '',
      amount: props.record?.amount || '',
      active: isEditing ? Boolean(props.record?.active) : true,
      image: props.record?.image || '',
    },
  });

  useEffect(() => {
    (window as any).$(modalRef.current).modal('show');
    (window as any)
      .$(modalRef.current)
      .on('hidden.bs.modal', props.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorMessage = (name) =>
    FormErrors.errorMessage(name, errors, touched, isSubmitted);

  const doSubmit = async (data) => {
    try {
      setSaveLoading(true);
      const payload = { ...data, type };

      let id;
      if (isEditing) {
        await ProductService.update(props.record.id, payload);
        id = props.record.id;
      } else {
        id = (await ProductService.create(payload)).id;
      }

      const record = await ProductService.find(id);
      (window as any).$(modalRef.current).modal('hide');
      props.onSuccess(record);
    } catch (error) {
      Errors.handle(error);
    } finally {
      setSaveLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div
      ref={modalRef}
      className="product-add-modal modal"
      tabIndex={-1}
    >
      <div className="modal-dialog product-add-modal-dialog">
        <div className="modal-content product-add-modal-content">
          <div className="product-add-modal-header">
            <h5 className="product-add-modal-title">
              {isEditing
                ? i18n(`entities.${entity}.edit.title`)
                : i18n(`entities.${entity}.new.title`)}
            </h5>
            <button
              type="button"
              className="product-add-modal-close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form
            className="product-add-modal-body"
            onSubmit={handleSubmit(doSubmit)}
          >
            <div className="product-add-field">
              <label
                className="product-add-label"
                htmlFor="product-add-title"
              >
                {i18n('entities.product.fields.title')}
              </label>
              <input
                id="product-add-title"
                name="title"
                type="text"
                ref={register}
                autoFocus
                placeholder={i18n(
                  `entities.${entity}.new.namePlaceholder`,
                )}
                className={`product-add-input ${
                  errorMessage('title') ? 'is-invalid' : ''
                }`}
              />
              {errorMessage('title') && (
                <div className="product-add-error">
                  {errorMessage('title')}
                </div>
              )}
            </div>

            <div className="product-add-field">
              <label
                className="product-add-label"
                htmlFor="product-add-amount"
              >
                {i18n('entities.product.fields.amount')}
              </label>
              <div className="product-add-price-group">
                <span className="product-add-price-prefix">
                  USDT
                </span>
                <input
                  id="product-add-amount"
                  name="amount"
                  type="number"
                  step="any"
                  ref={register}
                  placeholder={i18n(
                    `entities.${entity}.new.pricePlaceholder`,
                  )}
                  className={`product-add-input product-add-price-input ${
                    errorMessage('amount') ? 'is-invalid' : ''
                  }`}
                />
              </div>
              {errorMessage('amount') && (
                <div className="product-add-error">
                  {errorMessage('amount')}
                </div>
              )}
            </div>

            <div
              className="product-add-field product-add-field-inline"
              style={showActive ? undefined : { display: 'none' }}
            >
              <label className="product-add-switch">
                <input
                  type="checkbox"
                  name="active"
                  ref={register}
                  defaultChecked={
                    isEditing ? Boolean(props.record?.active) : true
                  }
                />
                <span className="product-add-switch-track">
                  <span className="product-add-switch-thumb" />
                </span>
              </label>
              <span className="product-add-inline-label">
                {i18n('entities.product.fields.active')}
              </span>
            </div>

            <div className="product-add-field">
              <label
                className="product-add-label"
                htmlFor="product-add-image"
              >
                {i18n('entities.product.fields.image')}
              </label>
              <textarea
                id="product-add-image"
                name="image"
                ref={register}
                rows={3}
                placeholder="https://example.com/image.png"
                className={`product-add-input product-add-textarea ${
                  errorMessage('image') ? 'is-invalid' : ''
                }`}
              />
              {errorMessage('image') && (
                <div className="product-add-error">
                  {errorMessage('image')}
                </div>
              )}
            </div>

            <div className="product-add-footer">
              <button
                type="submit"
                className="product-add-create-btn"
                disabled={saveLoading}
              >
                <ButtonIcon loading={saveLoading} />
                {!saveLoading &&
                  (props.submitLabel ||
                    (isEditing
                      ? i18n('common.save')
                      : i18n('common.create')))}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .product-add-modal-dialog {
          max-width: 480px;
        }

        .product-add-modal-content {
          border: none;
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
          overflow: hidden;
        }

        .product-add-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px 0 28px;
        }

        .product-add-modal-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          color: #1a202c;
        }

        .product-add-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          line-height: 1;
          color: #94a3b8;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }

        .product-add-modal-close:hover {
          color: #475569;
        }

        .product-add-modal-body {
          padding: 20px 28px 28px 28px;
        }

        .product-add-field {
          margin-bottom: 20px;
        }

        .product-add-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .product-add-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          color: #1a202c;
          background: #fff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .product-add-input::placeholder {
          color: #a0aec0;
        }

        .product-add-input:focus {
          outline: none;
          border-color: #7c6cf0;
          box-shadow: 0 0 0 3px rgba(124, 108, 240, 0.15);
        }

        .product-add-input.is-invalid {
          border-color: #f56565;
        }

        .product-add-error {
          margin-top: 6px;
          font-size: 12px;
          color: #e53e3e;
        }

        .product-add-price-group {
          display: flex;
          align-items: stretch;
        }

        .product-add-price-prefix {
          display: flex;
          align-items: center;
          padding: 0 14px;
          border: 1px solid #e2e8f0;
          border-right: none;
          border-radius: 10px 0 0 10px;
          background: #f8fafc;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .product-add-price-input {
          border-radius: 0 10px 10px 0;
        }

        .product-add-textarea {
          resize: vertical;
          min-height: 90px;
          font-family: inherit;
        }

        .product-add-field-inline {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .product-add-switch {
          position: relative;
          display: inline-flex;
          width: 42px;
          height: 24px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .product-add-switch input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          cursor: pointer;
        }

        .product-add-switch-track {
          position: absolute;
          inset: 0;
          background: #cbd5e1;
          border-radius: 999px;
          transition: background-color 0.2s ease;
        }

        .product-add-switch-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s ease;
        }

        .product-add-switch input:checked + .product-add-switch-track {
          background: #6c5ce7;
        }

        .product-add-switch input:checked + .product-add-switch-track .product-add-switch-thumb {
          transform: translateX(18px);
        }

        .product-add-switch input:focus + .product-add-switch-track {
          box-shadow: 0 0 0 3px rgba(124, 108, 240, 0.2);
        }

        .product-add-inline-label {
          font-size: 14px;
          font-weight: 600;
          color: #1a202c;
        }

        .product-add-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .product-add-create-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 96px;
          padding: 11px 24px;
          border: none;
          border-radius: 10px;
          background: #6c5ce7;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.05s ease;
        }

        .product-add-create-btn:hover:not(:disabled) {
          background: #5b4bd6;
        }

        .product-add-create-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>,
    (document as any).getElementById('modal-root'),
  );
}

export default ProductFormModal;
