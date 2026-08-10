import React, { useCallback, useState } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import authSelectors from "src/modules/auth/authSelectors";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import * as yup from "yup";
import { i18n } from "../../../i18n";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import InputFormItem from "src/shared/form/InputFormItem";
import actions from "src/modules/transaction/form/transactionFormActions";
import authActions from "src/modules/auth/authActions";

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
    const values = {
      status: "pending",
      date: new Date(),
      user: currentUser ? currentUser.id : null,
      type: "withdraw",
      amount: amount,
      vip: currentUser,
      withdrawPassword: withdrawPassword,
    };

    setSubmitting(true);
    await dispatch(actions.doCreate(values));
    await refreshItems();
    setSubmitting(false);
  };

  const [initialValues] = useState({
    amount: "",
  });
  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  const canWithdraw = Boolean(currentUser?.withdraw);

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

          <div className="wd__warning">
            <i className="fa-solid fa-volume-high"></i>
            {i18n("pages.withdraw.announcement")}
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  {i18n("pages.withdraw.disabledNote")}
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>

      <style>{`
        .wd__page {
          min-height: 100vh;
          background: #06070b;
          display: flex;
          justify-content: center;
          padding: 20px 14px 100px;
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .wd__card {
          max-width: 400px;
          width: 100%;
          background: #14151d;
          padding: 22px 18px 26px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #eaecef;
        }

        .wd__balanceBlock {
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 18px;
          padding: 18px;
          margin-bottom: 16px;
        }

        .wd__balanceLabel {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #848e9c;
          margin-bottom: 6px;
        }

        .wd__balanceAmount {
          font-size: 28px;
          font-weight: 800;
          color: #f7c948;
          line-height: 1;
        }

        .wd__balanceUnit {
          font-size: 13px;
          font-weight: 700;
          color: #848e9c;
        }

        .wd__warning {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #241c0e;
          border: 1px solid rgba(240, 185, 11, 0.25);
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 12px;
          color: #f0b90b;
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
          color: #848e9c;
          margin-bottom: 8px;
        }

        .wd__page .wd__input {
          width: 100%;
          background: #1a1c26;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          color: #eaecef;
          outline: none;
          box-sizing: border-box;
        }

        .wd__page .wd__input:focus {
          border-color: #f0b90b;
        }

        .wd__page .wd__input::placeholder {
          color: #5e6673;
        }

        .wd__page .wd__input.__danger {
          border-color: #f6465d;
        }

        .wd__page .invalid-feedback {
          display: block;
          color: #f6465d;
          font-size: 11.5px;
          margin-top: 6px;
        }

        .wd__page .form-text {
          color: #5e6673;
          font-size: 11px;
          margin-top: 6px;
        }

        .wd__submitBtn {
          width: 100%;
          margin: 4px 0 0;
          background: #f0b90b;
          border: none;
          border-radius: 14px;
          color: #0b0e11;
          font-size: 15px;
          font-weight: 700;
          padding: 13px 0;
          cursor: pointer;
        }

        .wd__submitBtn:disabled {
          background: #3a3d26;
          color: #6b6f5a;
          cursor: not-allowed;
        }

        .wd__disabledNote {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 14px;
          font-size: 11.5px;
          color: #5e6673;
          line-height: 1.6;
        }

        .wd__disabledNote i {
          color: #848e9c;
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
}

export default Withdraw;
