import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { i18n } from 'src/i18n';
import yupFormSchemas from 'src/modules/shared/yup/yupFormSchemas';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import FormWrapper from 'src/view/shared/styles/FormWrapper';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import InputNumberFormItem from 'src/view/shared/form/items/InputNumberFormItem';
import TextAreaFormItem from 'src/view/shared/form/items/TextAreaFormItem';
import SwitchFormItem from 'src/view/shared/form/items/SwitchFormItem';

const schema = yup.object().shape({
  title: yupFormSchemas.string(
    i18n('entities.product.fields.title'),
    {
      required: true,
    },
  ),
  amount: yupFormSchemas.decimal(
    i18n('entities.product.fields.amount'),
    {
      required: true,
      min: 0,
    },
  ),
  active: yupFormSchemas.boolean(
    i18n('entities.product.fields.active'),
  ),
  image: yupFormSchemas.string(
    i18n('entities.product.fields.image'),
    {},
  ),
});

function ProductForm(props) {
  const [initialValues] = useState(() => {
    const record = props.record || {};
    return {
      title: record.title,
      amount: record.amount,
      active: record.id ? Boolean(record.active) : true,
      image: record.image,
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

  return (
    <FormWrapper>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-lg-7 col-md-8 col-12">
              <InputFormItem
                name="title"
                label={i18n(
                  'entities.product.fields.title',
                )}
                required={true}
                autoFocus
              />
            </div>

            <div className="col-lg-7 col-md-8 col-12">
              <InputNumberFormItem
                name="amount"
                label={i18n('entities.product.fields.amount')}
                required={true}
              />
            </div>

            <div className="col-lg-7 col-md-8 col-12">
              <SwitchFormItem
                name="active"
                label={i18n('entities.product.fields.active')}
              />
            </div>

            <div className="col-lg-7 col-md-8 col-12">
              <TextAreaFormItem
                name="image"
                label={i18n('entities.product.fields.image')}
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>



          <div className="form-buttons">
            <button
              className="btn btn-primary"
              disabled={props.saveLoading}
              type="button"
              onClick={form.handleSubmit(onSubmit)}
            >
              <ButtonIcon
                loading={props.saveLoading}
                iconClass="far fa-save"
              />
              &nbsp;
              {i18n('common.save')}
            </button>

            <button
              className="btn btn-light"
              type="button"
              disabled={props.saveLoading}
              onClick={onReset}
            >
              <i className="fas fa-undo"></i>
              &nbsp;
              {i18n('common.reset')}
            </button>

            {props.onCancel ? (
              <button
                className="btn btn-light"
                type="button"
                disabled={props.saveLoading}
                onClick={() => props.onCancel()}
              >
                <i className="fas fa-times"></i>&nbsp;
                {i18n('common.cancel')}
              </button>
            ) : null}
          </div>
        </form>
      </FormProvider>
    </FormWrapper>
  );
}

export default ProductForm;
