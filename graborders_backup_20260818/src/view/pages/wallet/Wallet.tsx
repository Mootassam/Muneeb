import React, { useState } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import * as yup from "yup";
import { i18n } from "../../../i18n";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import actions from "src/modules/auth/authActions";
import InputFormItem from "src/shared/form/InputFormItem";
import selector from "src/modules/auth/authSelectors";
import SelectFormItem from "src/shared/form/SelectFormItem";
import userEnumerators from "src/modules/user/userEnumerators";

const schema = yup.object().shape({
  preferredcoin: yupFormSchemas.enumerator(i18n("user.fields.status"), {
    options: userEnumerators.wallet,
    required: true,
  }),
  trc20: yupFormSchemas.string(i18n("user.fields.walletAddress"), {
    required: true,
  }),
  withdrawPassword: yupFormSchemas.string(
    i18n("user.fields.withdrawPassword"),
    {
      required: true,
    }
  ),
});

function Wallet() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selector.selectCurrentUser);

  const [initialValues] = useState(() => {
    return {
      trc20: "" || currentUser.trc20,
      walletname: "" || currentUser.walletname,
      usernamewallet: "" || currentUser.usernamewallet,
      balance: currentUser?.balance,
      preferredcoin: currentUser?.preferredcoin
    };
  });
  
  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });
  
  const onSubmit = ({
    preferredcoin,
    withdrawPassword,
    trc20,
    walletname,
    usernamewallet,
  }) => {
    const values = {
      trc20: trc20,
      walletname: walletname,
      usernamewallet: usernamewallet,
      balance: currentUser?.balance,
      withdrawPassword: withdrawPassword,
      preferredcoin: preferredcoin
    };
    dispatch(actions.doUpdateProfileWallet(values));
  };
  
  return (
    <div className="wal__root">
      <SubHeader title={i18n('pages.wallet.title')} path="/profile" />
      <div className="wal__page">
        <div className="wal__card">
          <h3 className="wal__cardTitle">{i18n('pages.wallet.withdrawalMethod')}</h3>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="wal__form">
                <div className="wal__group">
                  <div className="wal__label">
                    <span className="wal__required">{i18n('pages.wallet.requiredField')}</span>
                    <span>{i18n('pages.wallet.username')}</span>
                  </div>
                  <InputFormItem
                    type="text"
                    name="usernamewallet"
                    placeholder={i18n("user.fields.username")}
                    className="wal__input"
                  />
                </div>

                <div className="wal__group">
                  <div className="wal__label">
                    <span className="wal__required">{i18n('pages.wallet.requiredField')}</span>
                    <span>{i18n('pages.wallet.walletName')}</span>
                  </div>
                  <InputFormItem
                    type="text"
                    name="walletname"
                    placeholder={i18n("user.fields.walletName")}
                    className="wal__input"
                  />
                </div>

                <div className="wal__group">
                  <div className="wal__label">
                    <span className="wal__required">{i18n('pages.wallet.requiredField')}</span>
                    <span>{i18n('pages.wallet.choosePreferredCoin')}:</span>
                  </div>
                  <SelectFormItem
                    name="preferredcoin"
                    options={userEnumerators.wallet.map((value) => ({
                      value,
                      label: i18n(`user.enumerators.status.${value}`),
                    }))}
                    required={true}
                  />
                </div>

                <div className="wal__group">
                  <div className="wal__label">
                    <span className="wal__required">{i18n('pages.wallet.requiredField')}</span>
                    <span>{i18n('pages.wallet.walletAddress')}</span>
                  </div>
                  <InputFormItem
                    type="text"
                    name="trc20"
                    placeholder={i18n("user.fields.walletAddress")}
                    className="wal__input"
                  />
                </div>

                <div className="wal__group">
                  <div className="wal__label">
                    <span className="wal__required">{i18n('pages.wallet.requiredField')}</span>
                    <span>{i18n('pages.wallet.withdrawPassword')}</span>
                  </div>
                  <InputFormItem
                    type="password"
                    name="withdrawPassword"
                    placeholder={i18n("user.fields.withdrawPassword")}
                    className="wal__input"
                  />
                </div>

                <button className="wal__submitBtn" type="submit">
                  {i18n('pages.wallet.submit')}
                </button>

                <div className="wal__note">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>
                    <b>{i18n('pages.wallet.note') ? "Note:" : ""}</b>{" "}
                    {i18n('pages.wallet.note')}
                  </span>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      <style>{`
        .wal__root {
          min-height: 100vh;
          background: var(--bg-page);
        }

        .wal__page {
          max-width: 460px;
          margin: 0 auto;
          padding: 16px 14px 100px;
          font-family: "Poppins", "Helvetica Neue", Arial, sans-serif;
          box-sizing: border-box;
        }

        .wal__page * {
          box-sizing: border-box;
        }

        .wal__card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px 18px 22px;
          box-shadow: 0 2px 8px rgba(15, 17, 17, 0.06);
        }

        .wal__cardTitle {
          font-size: 15.5px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 16px;
        }

        .wal__form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .wal__group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .wal__label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .wal__required {
          color: var(--danger);
          font-size: 13px;
          line-height: 1;
        }

        .wal__input,
        input.wal__input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-strong);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .wal__input:focus,
        input.wal__input:focus {
          outline: none;
          border-color: #ff6a00;
          box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.16);
        }

        .wal__group .invalid-feedback {
          color: var(--danger);
          font-size: 12px;
          margin-top: 2px;
        }

        .wal__submitBtn {
          width: 100%;
          margin: 4px 0 0;
          border: 1px solid #d17f00;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          font-size: 14.5px;
          color: #17130d;
          background: linear-gradient(180deg, #ffb84d, #ff8a00);
          cursor: pointer;
          transition: filter 0.15s ease, transform 0.1s ease;
        }

        .wal__submitBtn:hover {
          filter: brightness(1.04);
        }

        .wal__submitBtn:active {
          transform: translateY(1px);
        }

        .wal__note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--text-tertiary);
          line-height: 1.6;
          margin-top: 2px;
        }

        .wal__note i {
          color: #ff6a00;
          margin-top: 2px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

export default Wallet;