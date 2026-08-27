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

function ChangeWithdrawPassword() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectors.selectCurrentUser);
  const hasWithdrawPassword = Boolean(currentUser?.withdrawPassword);

  const schema = yup.object().shape({
    ...(hasWithdrawPassword
      ? {
          oldWithdrawPassword: yupFormSchemas.string(
            i18n("user.fields.withdrawPassword"),
            { required: true }
          ),
        }
      : {}),
    newWithdrawPassword: yupFormSchemas.string(
      i18n("user.fields.withdrawPassword"),
      { required: true }
    ),
    newWithdrawPasswordConfirmation: yupFormSchemas
      .string(i18n("user.fields.withdrawPassword"), { required: true })
      .oneOf(
        [yup.ref("newWithdrawPassword"), null],
        i18n("auth.passwordChange.mustMatch")
      ),
  });

  const [initialValues] = useState(() => ({
    oldWithdrawPassword: "",
    newWithdrawPassword: "",
    newWithdrawPasswordConfirmation: "",
  }));

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: initialValues,
  });

  const saveLoading = useSelector(selectors.selectLoadingWithdrawPasswordChange);

  const onSubmit = (values) => {
    dispatch(
      actions.doChangeWithdrawPassword(
        values.oldWithdrawPassword,
        values.newWithdrawPassword
      )
    );
  };

  const title = hasWithdrawPassword
    ? i18n("pages.changeWithdrawPassword.changeTitle")
    : i18n("pages.changeWithdrawPassword.addTitle");

  return (
    <div>
      <SubHeader title={title} path="/profile" />

      <div className="sec__page">
        <div className="sec__card">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {hasWithdrawPassword && (
                <div className="sec__formGroup">
                  <label className="sec__label" htmlFor="oldWithdrawPassword">
                    {i18n("pages.changeWithdrawPassword.oldPassword")}
                  </label>
                  <div className="sec__inputWrap">
                    <InputFormItem
                      type={showOld ? "text" : "password"}
                      name="oldWithdrawPassword"
                      autoComplete="off"
                      className="sec__input"
                    />
                    <button
                      type="button"
                      className="sec__eyeBtn"
                      onClick={() => setShowOld((v) => !v)}
                      aria-label="Toggle password visibility"
                    >
                      <i className={`fa-regular ${showOld ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                </div>
              )}

              <div className="sec__formGroup">
                <label className="sec__label" htmlFor="newWithdrawPassword">
                  {i18n("pages.changeWithdrawPassword.newPassword")}
                </label>
                <div className="sec__inputWrap">
                  <InputFormItem
                    type={showNew ? "text" : "password"}
                    name="newWithdrawPassword"
                    autoComplete="off"
                    className="sec__input"
                  />
                  <button
                    type="button"
                    className="sec__eyeBtn"
                    onClick={() => setShowNew((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    <i className={`fa-regular ${showNew ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              <div className="sec__formGroup">
                <label className="sec__label" htmlFor="newWithdrawPasswordConfirmation">
                  {i18n("pages.changeWithdrawPassword.confirmPassword")}
                </label>
                <div className="sec__inputWrap">
                  <InputFormItem
                    type={showConfirm ? "text" : "password"}
                    name="newWithdrawPasswordConfirmation"
                    autoComplete="off"
                    className="sec__input"
                  />
                  <button
                    type="button"
                    className="sec__eyeBtn"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    <i className={`fa-regular ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              <button
                className="sec__submitBtn"
                disabled={saveLoading}
                type="button"
                onClick={form.handleSubmit(onSubmit)}
              >
                <ButtonIcon loading={saveLoading} />
                {i18n("pages.changeWithdrawPassword.submit")}
              </button>

              <div className="sec__note">
                <i className="fa-solid fa-circle-info"></i>
                {i18n("pages.changeWithdrawPassword.note")}
              </div>
            </form>
          </FormProvider>
        </div>

        <div className="sec__secured">
          <i className="fa-solid fa-lock"></i>
          {i18n("pages.changePassword.secured")}
        </div>
      </div>

      <style>{`
        .sec__page {
          min-height: 100vh;
          background: var(--bg-page);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .sec__card {
          max-width: 400px;
          width: 100%;
          background: var(--bg-card);
          padding: 22px 18px 26px;
          border-radius: 22px;
          color: var(--text-primary);
          box-shadow: 0 8px 20px var(--shadow-color);
        }

        .sec__page .sec__formGroup,
        .sec__page .form-group {
          margin: 0 0 16px;
        }

        .sec__label {
          display: block;
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .sec__inputWrap {
          position: relative;
        }

        .sec__page .sec__input {
          width: 100%;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 40px 12px 14px;
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

        .sec__eyeBtn {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          margin: 0;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .sec__secured {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}

export default ChangeWithdrawPassword;
