import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { i18n } from 'src/i18n';
import actions from 'src/modules/user/form/userFormActions';
import DatePickerFormItem from 'src/view/shared/form/items/DatePickerFormItem';
import SelectFormItem from 'src/view/shared/form/items/SelectFormItem';
import FormWrapper from 'src/view/shared/styles/FormWrapper';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import * as yup from 'yup';
import yupFormSchemas from 'src/modules/shared/yup/yupFormSchemas';
import userEnumerators from 'src/modules/user/userEnumerators';
import { yupResolver } from '@hookform/resolvers/yup';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SwitchFormItem from 'src/view/shared/form/items/SwitchFormItem';
import ImagesFormItem from 'src/view/shared/form/items/ImagesFormItem';
import Storage from 'src/security/storage';
import VipAutocompleteFormItem from 'src/view/vip/autocomplete/VipAutocompleteFormItem';
import ProductAutocompleteFormItem from 'src/view/product/autocomplete/ProductAutocompleteFormItem';
import InputNumberFormItem from 'src/view/shared/form/items/InputNumberFormItem';

const schema = yup.object().shape({
  roles: yupFormSchemas.stringArray(
    i18n('user.fields.roles'),
    {
      min: 1,
    },
  ),
  phoneNumber: yupFormSchemas.string(i18n('phoneNumber'), {
    max: 24,
  }),

  adresse: yupFormSchemas.string(i18n('adresse'), {
    required: false,
  }),
  fullName: yupFormSchemas.string(i18n('fullName'), {
    required: false,
  }),

  balance: yupFormSchemas.string(i18n('balance'), {
    required: false,
  }),


  score: yupFormSchemas.integer(i18n('score'), {
    required: false,
    min: 0,
    max: 100,
  }),

  product: yupFormSchemas.relationToMany(
    i18n('prodcut'),
    {},
  ),

  itemNumber: yupFormSchemas.integer(i18n('itemNumber'), {
    required: false,
  }),

  status: yupFormSchemas.enumerator(
    i18n('user.fields.status'),
    {
      options: userEnumerators.status,
    },
  ),
});

function UserEditForm(props) {
  const dispatch = useDispatch();
  const [initialValues] = useState(() => {
    const record = props.user || {};

    return {
      roles: record.roles[0],
      phoneNumber: record.phoneNumber,
      passportNumber: record.passportNumber,
      fullName: record.fullName,
      firstName: record.firstName,
      lastName: record.lastName,
      country: record.country,
      balance: record.balance,
      score: record.score,
      withdrawPassword: record.withdrawPassword,
      state: record.state,
      passportPhoto: record.passportPhoto || [],
      vip: record.vip || [],
      status: record.status,
      product: record.product || [],
      itemNumber: record.itemNumber,
      prizes: record.prizes || [],
      prizesNumber: record.prizesNumber,
      grab: record.grab,
      withdraw: record.withdraw,
      freezeblance: record.freezeblance,
      tasksDone: record.tasksDone,
    };
  });

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: initialValues,
  });

  const onSubmit = (values) => {
    const data = {
      id: props.user.id,
      ...values,
    };
    delete data.email;

    dispatch(actions.doUpdate(data));
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
          {/* User Information Section */}
          <div className="section-card">
            <h5 className="section-title">
              {i18n('user.sections.basicInfo')}
            </h5>
            <Row className="g-3">
              <Col xs={12} md={6} lg={4}>
                <div className="form-group">
                  <label className="col-form-label" htmlFor="Username">
                    {i18n('user.fields.username')}
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control-plaintext readonly-field"
                    id="email"
                    name="email"
                    value={props.user.email}
                  />
                </div>
              </Col>

              <Col xs={12} md={6} lg={4}>
                <InputFormItem
                  name="withdrawPassword"
                  label={i18n('user.fields.withdrawPassword')}
                  required={true}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <SelectFormItem
                  name="roles"
                  label={i18n('user.fields.roles')}
                  required={true}
                  options={userEnumerators.roles.map((value) => ({
                    value,
                    label: i18n(`${value}`),
                  }))}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <SelectFormItem
                  name="status"
                  label={i18n('user.fields.status')}
                  options={userEnumerators.status.map((value) => ({
                    value,
                    label: i18n(`user.status.${value}`),
                  }))}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <InputFormItem
                  name="fullName"
                  label={i18n('user.fields.fullName')}
                  required={true}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <InputFormItem
                  name="phoneNumber"
                  label={i18n('user.fields.phoneNumber')}
                  required={true}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <InputFormItem
                  name="country"
                  label={i18n('user.fields.country')}
                  required={true}
                />
              </Col>
            </Row>
          </div>

          {/* Account Settings Section */}
          <div className="section-card">
            <h5 className="section-title">
              {i18n('user.sections.accountSettings')}
            </h5>
            <Row className="g-3">
              <Col xs={12} md={6} lg={4}>
                <InputFormItem
                  name="balance"
                  label={i18n('user.fields.balance')}
                  required={true}
                />
              </Col>



              <Col xs={12} md={6} lg={4}>
                <InputFormItem
                  name="freezeblance"
                  label={i18n('user.fields.freezeblance')}
                  required={true}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <InputNumberFormItem
                  name="score"
                  label={i18n('user.fields.score')}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <InputNumberFormItem
                  name="tasksDone"
                  label={i18n('user.fields.tasksDone')}
                />
              </Col>
            </Row>
          </div>

          {/* Permissions Section */}
          <div className="section-card">
            <h5 className="section-title">
              {i18n('user.sections.permissions')}
            </h5>
            <Row className="g-3">
              <Col xs={12} sm={6} md={4}>
                <SwitchFormItem
                  name="grab"
                  label={i18n('user.fields.grab')}
                />
              </Col>
              <Col xs={12} sm={6} md={4}>
                <SwitchFormItem
                  name="withdraw"
                  label={i18n('user.fields.withdraw')}
                />
              </Col>
            </Row>
          </div>

          {/* Additional Information Section */}
          <div className="section-card">
            <h5 className="section-title">
              {i18n('user.sections.additionalInfo')}
            </h5>
            <Row className="g-3">
              <Col xs={12} md={6} lg={4}>
                <VipAutocompleteFormItem
                  name="vip"
                  label={i18n('entities.product.fields.vip')}
                  required={true}
                  showCreate={!props.modal}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <ProductAutocompleteFormItem
                  name="product"
                  label={i18n('user.fields.product')}
                  mode="multiple"
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <InputNumberFormItem
                  name="itemNumber"
                  label={i18n('user.fields.itemNumber')}
                  required={true}
                />
              </Col>

              <Col xs={12}>
                <ImagesFormItem
                  name="passportPhoto"
                  label={i18n('user.fields.passportphoto')}
                  storage={Storage.values.galleryPhotos}
                  max={2}
                />
              </Col>
            </Row>
          </div>


          <div className="section-card">
            <h5 className="section-title">
              {i18n('user.sections.prizeInfo')}
            </h5>
            <Row className="g-3">

              <Col xs={12} md={6} lg={4}>
                <ProductAutocompleteFormItem
                  name="prizes"
                  label={i18n('user.fields.product')}
                />
              </Col>

              <Col xs={12} md={6} lg={4}>
                <InputNumberFormItem
                  name="prizesNumber"
                  label={i18n('user.fields.itemNumber')}
                  required={true}
                />
              </Col>


            </Row>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <div className="button-group">
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
                disabled={props.saveLoading}
                onClick={onReset}
                type="button"
              >
                <i className="fas fa-undo"></i>
                &nbsp;
                {i18n('common.reset')}
              </button>

              {props.onCancel && (
                <button
                  className="btn btn-light"
                  disabled={props.saveLoading}
                  onClick={() => props.onCancel()}
                  type="button"
                >
                  <i className="fas fa-times"></i>
                  &nbsp;
                  {i18n('common.cancel')}
                </button>
              )}
            </div>
          </div>
        </form>

        <style>
          {`/* Add these styles to your CSS file */

.section-card {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.section-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
  font-size: 1.1rem;
}

.readonly-field {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  min-height: 38px;
}

.form-group {
  margin-bottom: 0;
}

.form-actions {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  margin-top: 1rem;
}

.button-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.button-group .btn {
  min-width: 120px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .section-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .button-group .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  .section-card {
    padding: 0.75rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
}

/* Ensure form items have consistent spacing */
.form-group .form-control,
.form-group .form-select {
  margin-bottom: 0;
}

/* Improve switch item appearance */
.switch-form-item {
  padding: 0.5rem 0;
}`}
        </style>
      </FormProvider>
    </FormWrapper>
  );
}

export default UserEditForm;