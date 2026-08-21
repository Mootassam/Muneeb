import { i18n } from 'src/i18n';
import actions from 'src/modules/withdraw/list/withdrawListActions';
import selectors from 'src/modules/withdraw/list/withdrawListSelectors';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import yupFilterSchemas from 'src/modules/shared/yup/yupFilterSchemas';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import FilterWrapper from 'src/view/shared/styles/FilterWrapper';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FilterPreview from 'src/view/shared/filter/FilterPreview';
import filterRenders from 'src/modules/shared/filter/filterRenders';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';

import SelectFormItem from 'src/view/shared/form/items/SelectFormItem';
import withdrawEnumerators from 'src/modules/withdraw/withdrawEnumerators';
import UserAutocompleteFormItem from './../../user/autocomplete/UserAutocompleteFormItem';

const schema = yup.object().shape({
  user: yupFilterSchemas.relationToOne(
    i18n('entities.withdraw.fields.user'),
  ),
  amount: yupFilterSchemas.integer(
    i18n('entities.withdraw.fields.amount'),
  ),
  address: yupFilterSchemas.string(
    i18n('entities.withdraw.fields.address'),
  ),
  status: yupFilterSchemas.enumerator(
    i18n('entities.withdraw.fields.status'),
  ),
});

const emptyValues = {
  user: null,
  amount: null,
  address: null,
  status: null,
};

const previewRenders = {
  user: {
    label: i18n('entities.withdraw.fields.user'),
    render: filterRenders.relationToOne(),
  },
  amount: {
    label: i18n('entities.withdraw.fields.amount'),
    render: filterRenders.decimal(),
  },
  address: {
    label: i18n('entities.withdraw.fields.address'),
  },

  status: {
    label: i18n('entities.withdraw.fields.status'),
    render: filterRenders.enumerator(
      'entities.withdraw.enumerators.status',
    ),
  },
};

function WithdrawListFilter(props) {
  const rawFilter = useSelector(selectors.selectRawFilter);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const [initialValues] = useState(() => {
    return {
      ...emptyValues,
      ...rawFilter,
    };
  });

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: 'all',
  });

  useEffect(() => {
    dispatch(
      actions.doFetch(
        schema.cast(initialValues),
        rawFilter,
      ),
    );
    // eslint-disable-next-line
  }, [dispatch]);

  const onSubmit = (values) => {
    const rawValues = form.getValues();
    dispatch(actions.doFetch(values, rawValues));
    setExpanded(false);
  };

  const onRemove = (key) => {
    form.setValue(key, emptyValues[key]);
    return form.handleSubmit(onSubmit)();
  };

  const onReset = () => {
    Object.keys(emptyValues).forEach((key) => {
      form.setValue(key, emptyValues[key]);
    });
    dispatch(actions.doReset());
    setExpanded(false);
  };

  return (
    <FilterWrapper>
      <FilterPreview
        onClick={() => {
          setExpanded(!expanded);
        }}
        renders={previewRenders}
        values={rawFilter}
        expanded={expanded}
        onRemove={onRemove}
      />
      <div className="container">
        <div
          className={`collapse ${expanded ? 'show' : ''}`}
        >
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-lg-6 col-12">
                  <UserAutocompleteFormItem
                    name="user"
                    label={i18n(
                      'entities.withdraw.fields.user',
                    )}
                  />
                </div>
                <div className="col-lg-6 col-12">
                  <InputFormItem
                    name="amount"
                    label={i18n(
                      'entities.withdraw.fields.amount',
                    )}
                  />
                </div>

                <div className="col-lg-6 col-12">
                  <InputFormItem
                    name="address"
                    label={i18n(
                      'entities.withdraw.fields.address',
                    )}
                  />
                </div>

                <div className="col-lg-6 col-12">
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
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 filter-buttons">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={props.loading}
                  >
                    <ButtonIcon
                      loading={props.loading}
                      iconClass="fas fa-search"
                    />
                    {i18n('common.search')}
                  </button>
                  <button
                    className="btn btn-light"
                    type="button"
                    onClick={onReset}
                    disabled={props.loading}
                  >
                    <ButtonIcon
                      loading={props.loading}
                      iconClass="fas fa-undo"
                    />
                    {i18n('common.reset')}
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </FilterWrapper>
  );
}

export default WithdrawListFilter;
