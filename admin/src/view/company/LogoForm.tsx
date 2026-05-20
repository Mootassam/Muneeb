import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { i18n } from 'src/i18n';
import yupFormSchemas from 'src/modules/shared/yup/yupFormSchemas';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import FormWrapper from 'src/view/shared/styles/FormWrapper';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import Storage from 'src/security/storage';
import ImagesFormItem from 'src/view/shared/form/items/ImagesFormItem';

const schema = yup.object().shape({
  title: yupFormSchemas.string(
    i18n('entities.category.fields.name'),
    {},
  ),
  photo: yupFormSchemas.images(
    i18n('entities.category.fields.photo'),
    {},
  ),
  referralCommissionPercentage: yupFormSchemas.decimal(
    i18n('entities.category.fields.referralCommissionPercentage'),
    {},
  ),
});

function ReferralCalculatorModal({ referralPct, onClose }) {
  const [referralProfit, setReferralProfit] = useState('');
  const pct = parseFloat(referralPct) || 0;
  const referralAmount = parseFloat(referralProfit) || 0;

  // Reverse formula: targetProfit = referralProfit / (rate / 100)
  const targetProfit =
    pct > 0 && referralAmount > 0
      ? (referralAmount / (pct / 100)).toFixed(2)
      : null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: 8, padding: 32,
          minWidth: 380, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h5 style={{ marginBottom: 6 }}>Calculate Referral Profit</h5>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
          Enter the referral profit amount to find the required VIP target profit.
        </p>

        <div className="form-group">
          <label><strong>Referral Profit Amount (USDT)</strong></label>
          <input
            className="form-control"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 16"
            value={referralProfit}
            onChange={e => setReferralProfit(e.target.value)}
            autoFocus
          />
          <small className="form-text text-muted">
            How much USDT should the referrer earn?
          </small>
        </div>

        <div className="form-group">
          <label>Referral Commission %</label>
          <input
            className="form-control"
            type="number"
            readOnly
            value={pct}
            style={{ background: '#f9fafb', cursor: 'not-allowed' }}
          />
          <small className="form-text text-muted">
            Set in the Referral Commission % field above.
          </small>
        </div>

        {targetProfit !== null && (
          <div
            style={{
              marginTop: 20, padding: '16px 20px', background: '#f0fdf4',
              border: '1px solid #86efac', borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 13, color: '#166534', marginBottom: 6 }}>
              VIP Target Profit needed:
            </div>
            <div style={{ fontSize: 13, color: '#166534', marginBottom: 8 }}>
              {referralAmount} ÷ ({pct} / 100) =
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#15803d' }}>
              {targetProfit} USDT
            </div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 8, borderTop: '1px solid #bbf7d0', paddingTop: 8 }}>
              Set <strong>{targetProfit} USDT</strong> as the VIP Target Profit so the referrer earns exactly <strong>{referralAmount} USDT</strong>.
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button className="btn btn-light" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function LogoForm(props) {
  const [showModal, setShowModal] = useState(false);

  const [initialValues] = useState(() => {
    const [record] = props.record || {};
    return {
      name: record?.name,
      photo: record?.photo || [],
      trc20: record?.trc20,
      eth: record?.eth,
      defaultBalance: record?.defaultBalance,
      referralCommissionPercentage: record?.referralCommissionPercentage ?? 20,
    };
  });

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: initialValues,
  });

  const onSubmit = (values) => {
    props.onSubmit(props.record?.id, values);
  };

  const onReset = () => {
    Object.keys(initialValues).forEach((key) => {
      form.setValue(key, initialValues[key]);
    });
  };

  const referralPct = form.watch('referralCommissionPercentage');

  return (
    <FormWrapper>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-lg-7 col-md-8 col-12">
              <ImagesFormItem
                name="photo"
                label={i18n('entities.category.fields.photo')}
                required={false}
                storage={Storage.values.categoryPhoto}
                max={undefined}
              />
            </div>

            <div className="col-lg-7 col-md-8 col-12">
              <InputFormItem
                name="name"
                label={i18n('entities.category.fields.name')}
                required={false}
                autoFocus
              />
            </div>

            <div className="col-lg-7 col-md-8 col-12">
              <InputFormItem
                name="trc20"
                label={i18n('entities.category.fields.trc20')}
                required={false}
              />
            </div>

            <div className="col-lg-7 col-md-8 col-12">
              <InputFormItem
                name="eth"
                label={i18n('entities.category.fields.eth')}
                required={false}
              />
            </div>

            <div className="col-lg-7 col-md-8 col-12">
              <InputFormItem
                name="defaultBalance"
                label={i18n('entities.category.fields.defaultBalance')}
                required={false}
              />
            </div>

            {/* Referral Commission % + Calculate button */}
            <div className="col-lg-7 col-md-8 col-12">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <InputFormItem
                    name="referralCommissionPercentage"
                    label={i18n('entities.category.fields.referralCommissionPercentage')}
                    type="number"
                    required={false}
                  />
                </div>
                <div style={{ paddingBottom: 6 }}>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa-calculator" />&nbsp;Calculate Referral Profit
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button
              className="btn btn-primary"
              disabled={props.saveLoading}
              type="button"
              onClick={form.handleSubmit(onSubmit)}
            >
              <ButtonIcon loading={props.saveLoading} iconClass="far fa-save" />
              &nbsp;{i18n('common.save')}
            </button>

            <button
              className="btn btn-light"
              type="button"
              disabled={props.saveLoading}
              onClick={onReset}
            >
              <i className="fas fa-undo" />&nbsp;{i18n('common.reset')}
            </button>

            {props.onCancel && (
              <button
                className="btn btn-light"
                type="button"
                disabled={props.saveLoading}
                onClick={() => props.onCancel()}
              >
                <i className="fas fa-times" />&nbsp;{i18n('common.cancel')}
              </button>
            )}
          </div>
        </form>
      </FormProvider>

      {showModal && (
        <ReferralCalculatorModal
          referralPct={referralPct}
          onClose={() => setShowModal(false)}
        />
      )}
    </FormWrapper>
  );
}

export default LogoForm;
