import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { i18n } from 'src/i18n';
import yupFormSchemas from 'src/modules/shared/yup/yupFormSchemas';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import FormWrapper from 'src/view/shared/styles/FormWrapper';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import SelectFormItem from 'src/view/shared/form/items/SelectFormItem';
import withdrawEnumerators from 'src/modules/withdraw/withdrawEnumerators';
import UserAutocompleteFormItem from 'src/view/user/autocomplete/UserAutocompleteFormItem';

const schema = yup.object().shape({
  status: yupFormSchemas.enumerator(
    i18n('entities.withdraw.fields.status'),
    {
      options: withdrawEnumerators.status,
    },
  ),

  user: yupFormSchemas.relationToOne(
    i18n('entities.withdraw.fields.user'),
    {
      required: true,
    },
  ),

  amount: yupFormSchemas.decimal(
    i18n('entities.withdraw.fields.amount'),
    {
      required: true,
    },
  ),

  address: yupFormSchemas.string(
    i18n('entities.withdraw.fields.address'),
    {
      required: true,
    },
  ),
});

function WithdrawForm(props) {
  const [initialValues] = useState(() => {
    const record = props.record || {};
    return {
      status: record.status || 'pending',
      user: record.user,
      amount: record.amount || 0,
      address: record.address || '',
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
              <SelectFormItem
                name="status"
                label={i18n(
                  'entities.withdraw.fields.status',
                )}
                options={withdrawEnumerators.status.map(
                  (value) => ({
                    value,
                    label: i18n(
                      `entities.withdraw.enumerators.status.${value}`,
                    ),
                  }),
                )}
                required={true}
              />
            </div>
            <div className="col-lg-7 col-md-8 col-12">
              <UserAutocompleteFormItem
                name="user"
                label={i18n(
                  'entities.withdraw.fields.user',
                )}
                required={true}
              />
            </div>

            <div className="col-lg-7 col-md-8 col-12">
              <InputFormItem
                name="amount"
                label={i18n(
                  'entities.withdraw.fields.amount',
                )}
                required={true}
              />
            </div>

            <div className="col-lg-7 col-md-8 col-12">
              <InputFormItem
                name="address"
                label={i18n(
                  'entities.withdraw.fields.address',
                )}
                hint={i18n('entities.withdraw.hints.address')}
                required={true}
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

export default WithdrawForm;
