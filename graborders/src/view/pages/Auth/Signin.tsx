import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import actions from "src/modules/auth/authActions";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import { i18n, i18nExists, getLanguages, getLanguageCode } from "../../../i18n";
import { yupResolver } from "@hookform/resolvers/yup";
import InputFormItem from "src/shared/form/InputFormItem";
import selectors from "src/modules/auth/authSelectors";
import ButtonIcon from "src/shared/ButtonIcon";
import CsPage from "./CsPage"; // Import the new component
import layoutActions from "src/modules/layout/layoutActions";

const schema = yup.object().shape({
  email: yupFormSchemas.string(i18n("user.fields.username"), {
    required: true,
  }),
  password: yupFormSchemas.string(i18n("user.fields.password"), {
    required: true,
  }),
  rememberMe: yupFormSchemas.boolean(i18n("user.fields.rememberMe")),
});

function Signin() {
  const dispatch = useDispatch();
  const loading = useSelector(selectors.selectLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const currentLangCode = getLanguageCode();
  const languages = getLanguages();
  const currentLang =
    languages.find((language) => language.id === currentLangCode) ||
    languages[0];

  const [initialValues] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  useEffect(() => {
    dispatch(actions.doClearErrorMessage());
  }, [dispatch]);

  useEffect(() => {
    if (!langOpen) return;
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  const doChangeLanguage = (code) => {
    if (code === currentLangCode) {
      setLangOpen(false);
      return;
    }
    layoutActions.doChangeLanguage(code);
  };

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  const externalErrorMessage = useSelector(selectors.selectErrorMessage);

  const onSubmit = ({ email, password, rememberMe }) => {
    dispatch(actions.doSigninWithEmailAndPassword(email, password, rememberMe));
  };

  return (
    <div className="asg__page">
      <header className="asg__topbar">
        <div
          className={`asg__langSwitcher ${langOpen ? "__open" : ""}`}
          ref={langRef}
        >
          <button
            type="button"
            className="asg__langTrigger"
            onClick={() => setLangOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
          >
            {currentLang && (
              <img
                className="asg__langFlag"
                src={currentLang.flag}
                alt={currentLang.label}
              />
            )}
            <span className="asg__langCode">
              {currentLangCode ? currentLangCode.toUpperCase() : ""}
            </span>
            <svg
              className={`asg__langChevron ${langOpen ? "asg__langChevron--open" : ""}`}
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {langOpen && (
            <div className="asg__langMenu" role="listbox">
              {languages.map((language) => {
                const isActive = language.id === currentLangCode;
                return (
                  <button
                    type="button"
                    key={language.id}
                    className={`asg__langOption ${isActive ? "asg__langOption--active" : ""}`}
                    onClick={() => doChangeLanguage(language.id)}
                    role="option"
                    aria-selected={isActive}
                  >
                    <img
                      className="asg__langFlag"
                      src={language.flag}
                      alt={language.label}
                    />
                    <span className="asg__langName">{language.label}</span>
                    {isActive && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 12.5l5 5L20 6.5"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      <div className="asg__wrap">
        <Link to="/" className="asg__logo">
          <img
            className="asg__logoImg asg__logoImg--light"
            src="/icons/light.png"
            alt="Luxora Mall"
          />
          <img
            className="asg__logoImg asg__logoImg--dark"
            src="/icons/dark.png"
            alt="Luxora Mall"
          />
        </Link>

        <div className="asg__card">
          <h1 className="asg__title">{i18n("pages.auth.signin.welcomeBack")}</h1>
          <p className="asg__subtitle">
            {i18n("pages.auth.signin.signinToAccount")}
          </p>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="asg__group">
                <label className="asg__label" htmlFor="email">
                  {i18n("user.fields.username")}
                </label>
                <InputFormItem
                  type="text"
                  name="email"
                  autoFocus
                  className="asg__input"
                  externalErrorMessage={externalErrorMessage}
                />
              </div>

              <div className="asg__group">
                <div className="asg__labelRow">
                  <label className="asg__label" htmlFor="password">
                    {i18n("user.fields.password")}
                  </label>
                </div>
                <div className="asg__field">
                  <InputFormItem
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="asg__input asg__input--pw"
                  />
                  <button
                    type="button"
                    className="asg__eye"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 3l18 18M10.6 10.7a2.5 2.5 0 003.5 3.5M6.6 6.7C4.5 8.1 3 10 2 12c1.6 3.6 5.4 7 10 7 1.6 0 3.1-.4 4.4-1.1M9.9 4.2A10.4 10.4 0 0112 4c4.6 0 8.4 3.4 10 7-.5 1.2-1.3 2.5-2.3 3.6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
                </div>
              </div>

              <label className="asg__remember">
                <InputFormItem type="checkbox" name="rememberMe" className="asg__checkbox" />
                <span>{i18n("user.fields.rememberMe")}</span>
              </label>

              <button className="asg__button" disabled={loading} type="submit">
                <ButtonIcon loading={loading} />
                <span>{i18n("pages.auth.signin.signinButton")}</span>
              </button>

              <p className="asg__terms">
                By continuing, you agree to Luxora Mall's{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Conditions of Use
                </a>{" "}
                and{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Privacy Notice
                </a>
                .
              </p>
            </form>
          </FormProvider>

          <div className="asg__divider">
            <span>{i18n("pages.auth.signin.noAccount")}</span>
          </div>

          <Link to="/auth/signup" className="asg__newAccount">
            {i18n("pages.auth.signin.signupHere")}
          </Link>
        </div>

        <div className="asg__trust">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7.5 10.5V7.8a4.5 4.5 0 019 0v2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>
            {i18nExists("pages.auth.signin.secureConnection")
              ? i18n("pages.auth.signin.secureConnection")
              : "Secured by 256-bit encryption"}
          </span>
        </div>
      </div>

      <footer className="asg__footer">
        <div className="asg__footerLinks">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Conditions of Use
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Privacy Notice
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Help
          </a>
        </div>
        <p>© {new Date().getFullYear()} Luxora Mall. All rights reserved.</p>
      </footer>

      <CsPage />

      <style>{`
        .asg__page {
          width: 100%;
          min-height: 100dvh;
          background: var(--bg-page);
          display: flex;
          flex-direction: column;
          font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
        }

        .asg__topbar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 22px 20px 0;
          max-width: 460px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .asg__logo {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          line-height: 1;
          margin: 4px 0 22px;
        }

        .asg__logoImg {
          height: 76px;
          width: auto;
          max-width: 100%;
          object-fit: contain;
          filter: drop-shadow(0 6px 14px rgba(255, 106, 0, 0.18));
        }

        .asg__logoImg--light {
          display: block;
        }

        .asg__logoImg--dark {
          display: none;
        }

        [data-theme="dark"] .asg__logoImg--light {
          display: none;
        }

        [data-theme="dark"] .asg__logoImg--dark {
          display: block;
        }

        @media (max-width: 380px) {
          .asg__logoImg {
            height: 62px;
          }
        }

        .asg__langSwitcher {
          position: relative;
          flex-shrink: 0;
        }

        .asg__langTrigger {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 6px 12px 6px 8px;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(15, 17, 17, 0.08);
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
        }

        .asg__langTrigger:hover {
          border-color: #ff6a00;
        }

        .asg__langTrigger:focus-visible,
        .asg__langSwitcher.__open .asg__langTrigger {
          outline: none;
          border-color: #ff6a00;
          box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.16);
        }

        .asg__langFlag {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid var(--border-soft);
        }

        .asg__langCode {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: 0.2px;
        }

        .asg__langChevron {
          color: var(--text-tertiary);
          transition: transform 0.15s ease;
        }

        .asg__langChevron--open {
          transform: rotate(180deg);
        }

        .asg__langMenu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 230px;
          max-height: 320px;
          overflow-y: auto;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 12px 28px -8px rgba(15, 17, 17, 0.22);
          padding: 8px;
          z-index: 20;
          animation: asg__langMenuIn 0.14s ease;
        }

        .asg__langMenu::before {
          content: "";
          position: absolute;
          top: -6px;
          right: 18px;
          width: 11px;
          height: 11px;
          background: var(--bg-card);
          border-left: 1px solid var(--border);
          border-top: 1px solid var(--border);
          transform: rotate(45deg);
        }

        @keyframes asg__langMenuIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .asg__langOption {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background-color 0.15s ease;
        }

        .asg__langOption:hover {
          background: var(--bg-card-alt);
        }

        .asg__langOption--active {
          background: var(--bg-tint-soft);
        }

        .asg__langOption .asg__langName {
          flex: 1;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .asg__langOption svg {
          color: #ff6a00;
          flex-shrink: 0;
        }

        @media (max-width: 380px) {
          .asg__langMenu {
            width: 200px;
          }
        }

        .asg__wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 16px 30px;
        }

        .asg__card {
          width: 100%;
          max-width: 380px;
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: 10px;
          padding: 24px 26px 20px;
          box-shadow: 0 2px 6px rgba(15, 17, 17, 0.06);
        }

        .asg__title {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 4px;
        }

        .asg__subtitle {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0 0 18px;
        }

        .asg__group {
          margin-bottom: 14px;
        }

        .asg__labelRow {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .asg__label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .asg__field {
          position: relative;
        }

        .asg__input,
        input.asg__input {
          width: 100%;
          padding: 9px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-strong);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 14.5px;
          font-family: inherit;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        input.asg__input--pw {
          padding-right: 40px;
        }

        .asg__input:focus,
        input.asg__input:focus {
          outline: none;
          border-color: #ff6a00;
          box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.16);
        }

        .asg__input.__danger,
        input.asg__input.__danger {
          border-color: var(--danger) !important;
          box-shadow: 0 0 0 3px rgba(209, 50, 18, 0.12);
        }

        .asg__group .invalid-feedback {
          color: var(--danger);
          font-size: 12.5px;
          margin-top: 4px;
        }

        .asg__eye {
          position: absolute;
          right: 10px;
          top: 8px;
          margin: 0;
          background: none;
          border: none;
          padding: 4px;
          display: flex;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .asg__eye:hover {
          color: #ff6a00;
        }

        .asg__remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-primary);
          margin: 2px 0 16px;
          cursor: pointer;
        }

        .asg__remember .form-group {
          margin: 0;
        }

        .asg__checkbox,
        input.asg__checkbox {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: #ff6a00;
          cursor: pointer;
        }

        .asg__button {
          width: 100%;
          border: 1px solid #d17f00;
          border-radius: 8px;
          padding: 11px;
          font-weight: 600;
          font-size: 14.5px;
          color: #17130d;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: filter 0.15s ease, transform 0.1s ease;
        }

        .asg__button:hover:not(:disabled) {
          filter: brightness(1.04);
        }

        .asg__button:active:not(:disabled) {
          transform: translateY(1px);
        }

        .asg__button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .asg__terms {
          font-size: 11.5px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 12px 0 0;
        }

        .asg__terms a {
          color: var(--link);
          text-decoration: none;
        }

        .asg__terms a:hover {
          text-decoration: underline;
          color: #ff6a00;
        }

        .asg__divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #767676;
          font-size: 12px;
          margin: 20px 0 14px;
        }

        .asg__divider::before,
        .asg__divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .asg__divider span {
          padding: 0 10px;
          white-space: nowrap;
        }

        .asg__newAccount {
          display: block;
          width: 100%;
          text-align: center;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--border-strong);
          background: var(--bg-card-alt);
          color: var(--text-primary);
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }

        .asg__newAccount:hover {
          background: var(--bg-card-alt);
          border-color: #ff6a00;
          color: #ff6a00;
        }

        .asg__trust {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-tertiary);
          font-size: 11.5px;
          margin-top: 18px;
        }

        .asg__footer {
          border-top: 1px solid var(--border-strong);
          padding: 18px 20px 26px;
          text-align: center;
        }

        .asg__footerLinks {
          display: flex;
          justify-content: center;
          gap: 18px;
          margin-bottom: 8px;
        }

        .asg__footerLinks a {
          font-size: 11.5px;
          color: var(--text-secondary);
          text-decoration: none;
        }

        .asg__footerLinks a:hover {
          text-decoration: underline;
          color: #ff6a00;
        }

        .asg__footer p {
          font-size: 11px;
          color: var(--text-tertiary);
          margin: 0;
        }

        @media (max-width: 380px) {
          .asg__card {
            padding: 20px 18px 18px;
          }
        }
      `}</style>
    </div>
  );
}

export default Signin;
