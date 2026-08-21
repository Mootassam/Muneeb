import React, { useState } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import * as yup from "yup";
import { i18n } from "../../../i18n";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import actions from 'src/modules/auth/authActions';
import InputFormItem from "src/shared/form/InputFormItem";
import selectors from "src/modules/auth/authSelectors";
import ButtonIcon from "src/shared/ButtonIcon";

const schema = yup.object().shape({
  oldPassword: yupFormSchemas.string(i18n("user.fields.oldPassword"), {
    required: true,
  }),
  newPassword: yupFormSchemas.string(i18n("user.fields.newPassword"), {
    required: true,
  }),
  newPasswordConfirmation: yupFormSchemas
    .string(i18n("user.fields.newPasswordConfirmation"), {
      required: true,
    })
    .oneOf(
      [yup.ref("newPassword"), null],
      i18n("auth.passwordChange.mustMatch")
    ),
});

function ChangePassword() {
  const dispatch = useDispatch();
  const [initialValues] = useState(() => ({
    oldPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  }));

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: initialValues,
  });

  const saveLoading = useSelector(selectors.selectLoadingPasswordChange);

  const onSubmit = (values) => {
    dispatch(actions.doChangePassword(values.oldPassword, values.newPassword));
  };

  return (
    <div>
      <SubHeader title={i18n('pages.changePassword.title')} path="/profile" />

      <div className="sec__page">
        <div className="sec__card">
          <div className="sec__header">
            <span className="sec__headerIcon">
              <i className="fa-solid fa-shield-halved"></i>
            </span>
            <div>
              <div className="sec__headerTitle">
                {i18n('pages.changePassword.header')}
              </div>
              <div className="sec__headerSubtitle">
                {i18n('pages.changePassword.subtitle')}
              </div>
            </div>
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="sec__formGroup">
                <label className="sec__label" htmlFor="oldPassword">
                  {i18n('pages.changePassword.oldPassword')}
                </label>
                <InputFormItem
                  type="password"
                  name="oldPassword"
                  autoComplete="old-password"
                  className="sec__input"
                />
              </div>

              <div className="sec__formGroup">
                <label className="sec__label" htmlFor="newPassword">
                  {i18n('pages.changePassword.newPassword')}
                </label>
                <InputFormItem
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  className="sec__input"
                />
              </div>

              <div className="sec__formGroup">
                <label className="sec__label" htmlFor="newPasswordConfirmation">
                  {i18n('pages.changePassword.confirmPassword')}
                </label>
                <InputFormItem
                  type="password"
                  name="newPasswordConfirmation"
                  autoComplete="new-password"
                  className="sec__input"
                />
              </div>

              <button
                className="sec__submitBtn"
                disabled={saveLoading}
                type="button"
                onClick={form.handleSubmit(onSubmit)}
              >
                <ButtonIcon loading={saveLoading} />
                {i18n('pages.changePassword.submit')}
              </button>

              <div className="sec__note">
                <i className="fa-solid fa-circle-info"></i>
                {i18n('pages.changePassword.note')}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      <style>{`
        .sec__page {
          min-height: 100vh;
          background: var(--bg-page);
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .sec__card {
          max-width: 400px;
          width: 100%;
          background: var(--bg-card);
          padding: 22px 18px 26px;
          border-radius: 22px;
          border: 1px solid var(--border);
          color: var(--text-primary);
        }

        .sec__header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .sec__headerIcon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--bg-tint);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sec__headerIcon i {
          color: var(--accent);
          font-size: 17px;
        }

        .sec__headerTitle {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .sec__headerSubtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .sec__page .sec__formGroup,
        .sec__page .form-group {
          margin: 0 0 16px;
        }

        .sec__label {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .sec__page .sec__input {
          width: 100%;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          box-sizing: border-box;
        }

        .sec__page .sec__input:focus {
          border-color: var(--accent);
        }

        .sec__page .sec__input::placeholder {
          color: var(--text-faint);
        }

        .sec__page .sec__input.__danger {
          border-color: var(--danger);
        }

        .sec__page .invalid-feedback {
          display: block;
          color: var(--danger);
          font-size: 11.5px;
          margin-top: 6px;
        }

        .sec__page .form-text {
          color: var(--text-faint);
          font-size: 11px;
          margin-top: 6px;
        }

        .sec__submitBtn {
          width: 100%;
          margin: 6px 0 0;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          border: none;
          border-radius: 14px;
          color: var(--accent-text-on);
          font-size: 15px;
          font-weight: 700;
          padding: 13px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .sec__submitBtn:disabled {
          background: var(--bg-surface-2);
          color: var(--text-faint);
          cursor: not-allowed;
        }

        .sec__submitBtn .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(11, 14, 17, 0.25);
          border-top-color: var(--accent-text-on);
        }

        .sec__submitBtn:disabled .spinner {
          border-color: var(--border-strong);
          border-top-color: var(--text-faint);
        }

        .sec__note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 16px;
          font-size: 11.5px;
          color: var(--text-faint);
          line-height: 1.6;
        }

        .sec__note i {
          color: var(--text-muted);
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
}

export default ChangePassword;
