import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import actions from "src/modules/auth/authActions";
import selectors from "src/modules/auth/authSelectors";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import { i18n } from "../../../i18n";
import InputFormItem from "src/shared/form/InputFormItem";
import SelectFormItem from "src/shared/form/SelectFormItem";
import ButtonIcon from "src/shared/ButtonIcon";
import userEnumerators from "src/modules/user/userEnumerators";
import CsPage from "./CsPage";

// Validation Schema
const schema = yup.object().shape({
  email: yupFormSchemas.string(i18n("user.fields.username"), {
    required: true,
  }),
  password: yupFormSchemas.string(i18n("user.fields.password"), {
    required: true,
  }),
  newPasswordConfirmation: yupFormSchemas
    .string(i18n("user.fields.newPasswordConfirmation"), {
      required: true,
    })
    .oneOf([yup.ref("password")], i18n("auth.passwordChange.mustMatch")),
  phoneNumber: yupFormSchemas.string(i18n("user.fields.phoneNumber"), {
    required: true,
  }),
  withdrawPassword: yupFormSchemas.string(
    i18n("user.fields.withdrawPassword"),
    { required: true }
  ),
  invitationcode: yupFormSchemas.string(i18n("user.fields.invitationcode"), {
    required: true,
  }),
  rememberMe: yupFormSchemas.boolean(i18n("user.fields.rememberMe")),
});

const selectControlStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: 46,
    borderRadius: 12,
    border: `1px solid ${state.isFocused ? "#f0b90b" : "rgba(255, 255, 255, 0.08)"}`,
    backgroundColor: "#1a1c26",
    boxShadow: "none",
    outline: "none",
    fontFamily: "Poppins, sans-serif",
    fontSize: 14,
    paddingLeft: 4,
  }),
  placeholder: (provided) => ({ ...provided, color: "#5e6673" }),
  singleValue: (provided) => ({ ...provided, color: "#eaecef" }),
  input: (provided) => ({ ...provided, color: "#eaecef" }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 20,
    backgroundColor: "#1a1c26",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#f0b90b"
      : state.isFocused
      ? "#21232e"
      : "#1a1c26",
    color: state.isSelected ? "#0b0e11" : "#eaecef",
    fontFamily: "Poppins, sans-serif",
    fontSize: 14,
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (provided) => ({ ...provided, color: "#5e6673" }),
};

function Signup() {
  const dispatch = useDispatch();
  const loading = useSelector(selectors.selectLoading);
  const externalErrorMessage = useSelector(selectors.selectErrorMessage);

  const [visibility, setVisibility] = useState({
    withdrawPassword: false,
    password: false,
    newPasswordConfirmation: false,
  });

  const toggleVisibility = (field) =>
    setVisibility((v) => ({ ...v, [field]: !v[field] }));

  const [initialValues] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    withdrawPassword: "",
    invitationcode: "",
    gender: "",
    rememberMe: true,
  });

  useEffect(() => {
    dispatch(actions.doClearErrorMessage());
  }, [dispatch]);

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  const onSubmit = ({
    email,
    password,
    phoneNumber,
    withdrawPassword,
    invitationcode,
    gender,
  }) => {
    dispatch(
      actions.doRegisterEmailAndPassword(
        email,
        password,
        phoneNumber,
        withdrawPassword,
        invitationcode,
        gender
      )
    );
  };

  const EyeToggle = ({ field }) => (
    <button
      type="button"
      className="bnc__eye"
      tabIndex={-1}
      onClick={() => toggleVisibility(field)}
      aria-label="toggle password visibility"
    >
      {visibility[field] ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 3l18 18M10.6 10.7a2.5 2.5 0 003.5 3.5M6.6 6.7C4.5 8.1 3 10 2 12c1.6 3.6 5.4 7 10 7 1.6 0 3.1-.4 4.4-1.1M9.9 4.2A10.4 10.4 0 0112 4c4.6 0 8.4 3.4 10 7-.5 1.2-1.3 2.5-2.3 3.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 12c1.6-3.6 5.4-7 10-7s8.4 3.4 10 7c-1.6 3.6-5.4 7-10 7s-8.4-3.4-10-7z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="bnc__page">
      <div className="bnc__glow" />

      <div className="bnc__wrap">
        <div className="bnc__card">
          <div className="bnc__head">
            <h1 className="bnc__title">{i18n("pages.auth.signup.createAccount")}</h1>
            <p className="bnc__subtitle">
              {i18n("pages.auth.signup.signupForAccount")}
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="bnc__form">
                <div className="bnc__group">
                  <label className="bnc__label">{i18n("user.fields.username")}</label>
                  <div className="bnc__field">
                    <span className="bnc__icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 6.5C4 5.67 4.67 5 5.5 5h13c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-13A1.5 1.5 0 014 17.5v-11z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 6.5l7 6 7-6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <InputFormItem
                      type="text"
                      name="email"
                      placeholder={i18n("user.fields.username")}
                      className="bnc__input"
                      externalErrorMessage={externalErrorMessage}
                    />
                  </div>
                </div>

                <div className="bnc__group">
                  <label className="bnc__label">{i18n("user.fields.phoneNumber")}</label>
                  <div className="bnc__field">
                    <span className="bnc__icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7 3.5h4.2c.4 0 .77.27.88.66l1 3.55c.1.35-.02.72-.3.95l-1.7 1.4a12.3 12.3 0 005.6 5.6l1.4-1.7c.23-.28.6-.4.95-.3l3.55 1c.4.11.66.48.66.88V20a1.5 1.5 0 01-1.62 1.5A16.5 16.5 0 015.5 5.12 1.5 1.5 0 017 3.5z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <InputFormItem
                      type="tel"
                      name="phoneNumber"
                      placeholder={i18n("pages.auth.signup.phonePlaceholder")}
                      className="bnc__input"
                    />
                  </div>
                </div>

                <div className="bnc__group">
                  <label className="bnc__label">{i18n("user.fields.withdrawPassword")}</label>
                  <div className="bnc__field">
                    <span className="bnc__icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <circle cx="8.5" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
                        <path
                          d="M11.6 10.9L20 19.3M15.5 15l3-3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <InputFormItem
                      type={visibility.withdrawPassword ? "text" : "password"}
                      name="withdrawPassword"
                      placeholder={i18n("user.fields.withdrawPassword")}
                      className="bnc__input bnc__input--pw"
                    />
                    <EyeToggle field="withdrawPassword" />
                  </div>
                </div>

                <div className="bnc__group">
                  <label className="bnc__label">{i18n("user.fields.password")}</label>
                  <div className="bnc__field">
                    <span className="bnc__icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <rect
                          x="5"
                          y="10.5"
                          width="14"
                          height="9.5"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M7.5 10.5V7.8a4.5 4.5 0 019 0v2.7"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <InputFormItem
                      type={visibility.password ? "text" : "password"}
                      name="password"
                      placeholder={i18n("user.fields.password")}
                      className="bnc__input bnc__input--pw"
                    />
                    <EyeToggle field="password" />
                  </div>
                </div>

                <div className="bnc__group">
                  <label className="bnc__label">{i18n("user.fields.confirmPassword")}</label>
                  <div className="bnc__field">
                    <span className="bnc__icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <rect
                          x="5"
                          y="10.5"
                          width="14"
                          height="9.5"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M7.5 10.5V7.8a4.5 4.5 0 019 0v2.7"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.7 15.2l1.6 1.6 3-3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <InputFormItem
                      type={visibility.newPasswordConfirmation ? "text" : "password"}
                      name="newPasswordConfirmation"
                      autoComplete="new-password"
                      placeholder={i18n("user.fields.confirmPassword")}
                      className="bnc__input bnc__input--pw"
                    />
                    <EyeToggle field="newPasswordConfirmation" />
                  </div>
                </div>

                <div className="bnc__group">
                  <label className="bnc__label">{i18n("user.fields.gender")}</label>
                  <SelectFormItem
                    name="gender"
                    placeholder={i18n("user.fields.gender")}
                    options={userEnumerators.genre.map((value) => ({
                      value,
                      label: i18n(`user.enumerators.gender.${value}`),
                    }))}
                    selectStyles={selectControlStyles}
                    required
                  />
                </div>

                <div className="bnc__group">
                  <label className="bnc__label">{i18n("user.fields.invitationcode")}</label>
                  <div className="bnc__field">
                    <span className="bnc__icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 9.5a2 2 0 002 2v1a2 2 0 01-2 2V17a1.5 1.5 0 001.5 1.5h13A1.5 1.5 0 0020 17v-2.5a2 2 0 010-4V8A1.5 1.5 0 0018.5 6.5h-13A1.5 1.5 0 004 8v1.5z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.5 6.5v11"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeDasharray="2.2 2.2"
                        />
                      </svg>
                    </span>
                    <InputFormItem
                      type="text"
                      name="invitationcode"
                      placeholder={i18n("user.fields.invitationcode")}
                      className="bnc__input"
                      externalErrorMessage={externalErrorMessage}
                    />
                  </div>
                </div>
              </div>

              <div className="bnc__bottom">
                <button className="bnc__button" disabled={loading} type="submit">
                  <ButtonIcon loading={loading} />
                  <span>{i18n("pages.auth.signup.signupButton")}</span>
                </button>

                <div className="bnc__trust">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M7.5 10.5V7.8a4.5 4.5 0 019 0v2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span>Secured by 256-bit encryption</span>
                </div>

                <Link to="/auth/signin" className="bnc__linkWrap">
                  <span className="bnc__link">{i18n("pages.auth.signup.alreadyHaveAccount")}</span>
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>

        <p className="bnc__footer">© {new Date().getFullYear()} All rights reserved.</p>
      </div>

      <CsPage />

      <style>{`
        .bnc__page {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          overflow-x: hidden;
          overflow-y: auto;
          background: #06070b;
          background-image:
            radial-gradient(circle at 50% 0%, rgba(240, 185, 11, 0.08), transparent 45%);
          display: flex;
          flex-direction: column;
        }

        .bnc__glow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 640px;
          height: 320px;
          background: radial-gradient(ellipse at center, rgba(240, 185, 11, 0.14), transparent 70%);
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
        }

        .bnc__wrap {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 20px 40px;
        }

        .bnc__card {
          width: 100%;
          max-width: 400px;
          background: #14151d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 22px;
          padding: 34px 28px 28px;
          box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.65);
        }

        .bnc__head {
          margin-bottom: 22px;
        }

        .bnc__title {
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          font-size: 22px;
          color: #eaecef;
          margin: 0 0 8px;
          letter-spacing: -0.2px;
        }

        .bnc__subtitle {
          font-family: "Poppins", sans-serif;
          font-size: 13.5px;
          color: #848e9c;
          margin: 0;
        }

        .bnc__form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .bnc__group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .bnc__label {
          font-family: "Poppins", sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: #848e9c;
        }

        .bnc__field {
          position: relative;
        }

        .bnc__icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          color: #5e6673;
          z-index: 1;
          pointer-events: none;
        }

        .bnc__eye {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          margin: 0;
          background: none;
          border: none;
          padding: 4px;
          display: flex;
          color: #5e6673;
          cursor: pointer;
        }

        .bnc__eye:hover {
          color: #f0b90b;
        }

        .bnc__field .bnc__input,
        .bnc__field input.bnc__input {
          width: 100%;
          padding: 13px 14px 13px 40px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background-color: #1a1c26;
          color: #eaecef;
          font-size: 14px;
          font-family: "Poppins", sans-serif;
          transition: border-color 0.15s ease, background-color 0.15s ease;
        }

        .bnc__field input.bnc__input--pw {
          padding-right: 40px;
        }

        .bnc__field .bnc__input::placeholder {
          color: #5e6673;
        }

        .bnc__field .bnc__input:focus {
          outline: none;
          border-color: #f0b90b;
          background-color: #1a1c26;
        }

        .bnc__field:focus-within .bnc__icon {
          color: #f0b90b;
        }

        .bnc__field .bnc__input.__danger {
          border-color: #f6465d !important;
          outline: none;
        }

        .bnc__field .invalid-feedback {
          color: #f6465d;
          font-size: 12.5px;
        }

        .bnc__bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-top: 26px;
        }

        .bnc__button {
          width: 100%;
          border: none;
          border-radius: 14px;
          padding: 14px;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: #0b0e11;
          background: #f0b90b;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
        }

        .bnc__button:hover:not(:disabled) {
          background: #f8d12f;
        }

        .bnc__button:active:not(:disabled) {
          transform: translateY(1px);
        }

        .bnc__button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bnc__trust {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5e6673;
          font-family: "Poppins", sans-serif;
          font-size: 11.5px;
        }

        .bnc__linkWrap {
          text-decoration: none;
        }

        .bnc__link {
          font-family: "Poppins", sans-serif;
          font-size: 13.5px;
          color: #848e9c;
        }

        .bnc__linkStrong {
          color: #f0b90b;
          font-weight: 600;
        }

        .bnc__footer {
          position: relative;
          z-index: 2;
          font-family: "Poppins", sans-serif;
          font-size: 11.5px;
          color: #474d57;
          margin: 24px 0 0;
          text-align: center;
        }

        @media (max-width: 380px) {
          .bnc__card {
            padding: 28px 20px 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default Signup;
