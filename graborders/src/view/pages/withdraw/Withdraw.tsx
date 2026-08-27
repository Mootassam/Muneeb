import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import SubHeader from "src/view/shared/Header/SubHeader";
import authSelectors from "src/modules/auth/authSelectors";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import * as yup from "yup";
import { i18n } from "../../../i18n";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import InputFormItem from "src/shared/form/InputFormItem";
import WithdrawService from "src/modules/withdraw/withdrawService";
import Errors from "src/modules/shared/error/errors";
import Message from "src/view/shared/message";
import authActions from "src/modules/auth/authActions";

const NETWORK = "USDT · TRC-20";

const schema = yup.object().shape({
  amount: yupFormSchemas.integer(i18n("entities.transaction.fields.amount"), {
    required: true,
    min: 50,
  }),
  withdrawPassword: yupFormSchemas.string(
    i18n("user.fields.withdrawPassword"),
    {
      required: true,
    }
  ),
});

function Withdraw() {
  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const refreshItems = useCallback(async () => {
    await dispatch(authActions.doRefreshCurrentUser());
  }, [dispatch]);

  const onSubmit = async ({ amount, withdrawPassword }) => {
    setSubmitting(true);

    try {
      await WithdrawService.create({
        user: currentUser ? currentUser.id : null,
        amount,
        address: currentUser?.trc20,
        withdrawPassword,
      });

      Message.success(i18n("pages.withdraw.success"));
      form.reset({ amount: "", withdrawPassword: "" });
      await refreshItems();
    } catch (error) {
      Errors.handle(error);
    } finally {
      setSubmitting(false);
    }
  };

  const [initialValues] = useState({
    amount: "",
  });
  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  const hasWallet = Boolean(currentUser?.trc20);
  const canWithdraw = Boolean(currentUser?.withdraw) && hasWallet;

  return (
    <div>
      <SubHeader title={i18n("pages.withdraw.title")} path="/profile" />

      <div className="wd__page">
        <div className="wd__card">
          <div className="wd__balanceBlock">
            <div className="wd__balanceLabel">
              {i18n("pages.withdraw.availableBalance")}
            </div>
            <div className="wd__balanceAmount">
              {currentUser?.balance?.toFixed(2) || "0.00"}{" "}
              <span className="wd__balanceUnit">USD</span>
            </div>
          </div>

          <div className="wd__optionGroup">
            <div className="wd__optionLabel">{i18n("pages.withdraw.network")}</div>
            <span className="wd__chip">{NETWORK}</span>
          </div>

          <div className="wd__warning">
            <i className="fa-solid fa-volume-high"></i>
            {i18n("pages.withdraw.announcement")}
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="wd__formGroup">
                <label className="wd__label">
                  {i18n("pages.withdraw.withdrawAddress")}
                </label>
                {hasWallet ? (
                  <div className="wd__addressDisplay">{currentUser.trc20}</div>
                ) : (
                  <div className="wd__addressMissing">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    {i18n("pages.withdraw.noWalletAddress")}{" "}
                    <Link to="/wallet">{i18n("pages.withdraw.addWalletLink")}</Link>
                  </div>
                )}
              </div>

              <div className="wd__formGroup">
                <label className="wd__label" htmlFor="amount">
                  {i18n("pages.withdraw.withdrawAmount")}
                </label>
                <InputFormItem
                  type="text"
                  name="amount"
                  placeholder={i18n("entities.transaction.fields.amount")}
                  className="wd__input"
                />
              </div>

              <div className="wd__formGroup">
                <label className="wd__label" htmlFor="withdrawPassword">
                  {i18n("pages.withdraw.withdrawPassword")}
                </label>
                <InputFormItem
                  type="password"
                  name="withdrawPassword"
                  placeholder={i18n("user.fields.withdrawPassword")}
                  className="wd__input"
                />
              </div>

              <button
                className="wd__submitBtn"
                type="submit"
                disabled={!canWithdraw || submitting}
              >
                {i18n("pages.withdraw.confirm")}
              </button>

              {!canWithdraw && (
                <div className="wd__disabledNote">
                  <i className="fa-solid fa-lock"></i>
                  {!hasWallet
                    ? i18n("pages.withdraw.addWalletFirst")
                    : i18n("pages.withdraw.disabledNote")}
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>

      <style>{`
        .wd__page {
          min-height: 100vh;
          background: var(--bg-page);
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .wd__card {
          max-width: 400px;
          width: 100%;
          background: var(--bg-card);
          padding: 22px 18px 26px;
          border-radius: 22px;
          border: 1px solid var(--border);
          color: var(--text-primary);
        }

        .wd__balanceBlock {
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 18px;
          margin-bottom: 16px;
        }

        .wd__balanceLabel {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .wd__balanceAmount {
          font-size: 28px;
          font-weight: 800;
          color: var(--accent);
          line-height: 1;
        }

        .wd__balanceUnit {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .wd__optionGroup {
          margin-bottom: 16px;
        }

        .wd__optionLabel {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .wd__chip {
          display: inline-flex;
          align-items: center;
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          color: var(--accent-text-on);
        }

        .wd__warning {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: var(--bg-tint);
          border: 1px solid var(--tint-border);
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 12px;
          color: var(--tint-text);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .wd__warning i {
          margin-top: 1px;
        }

        .wd__page .wd__formGroup,
        .wd__page .form-group {
          margin: 0 0 16px;
        }

        .wd__label {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .wd__page .wd__input {
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

        .wd__page .wd__input:focus {
          border-color: var(--accent);
        }

        .wd__page .wd__input::placeholder {
          color: var(--placeholder);
        }

        .wd__page .wd__input.__danger {
          border-color: var(--danger);
        }

        .wd__addressDisplay {
          width: 100%;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 13.5px;
          color: var(--text-primary);
          word-break: break-all;
          box-sizing: border-box;
        }

        .wd__addressMissing {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 6px;
          background: var(--bg-tint);
          border: 1px solid var(--tint-border);
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 12px;
          color: var(--tint-text);
          line-height: 1.5;
        }

        .wd__addressMissing a {
          color: var(--accent);
          font-weight: 700;
          text-decoration: underline;
        }

        .wd__page .invalid-feedback {
          display: block;
          color: var(--danger);
          font-size: 11.5px;
          margin-top: 6px;
        }

        .wd__page .form-text {
          color: var(--text-faint);
          font-size: 11px;
          margin-top: 6px;
        }

        .wd__submitBtn {
          width: 100%;
          margin: 4px 0 0;
          background: linear-gradient(180deg, var(--accent-grad-start), var(--accent-grad-end));
          border: none;
          border-radius: 14px;
          color: var(--accent-text-on);
          font-size: 15px;
          font-weight: 700;
          padding: 13px 0;
          cursor: pointer;
        }

        .wd__submitBtn:disabled {
          background: var(--bg-surface-2);
          color: var(--text-faint);
          cursor: not-allowed;
        }

        .wd__disabledNote {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 14px;
          font-size: 11.5px;
          color: var(--text-faint);
          line-height: 1.6;
        }

        .wd__disabledNote i {
          color: var(--text-muted);
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
}

export default Withdraw;
