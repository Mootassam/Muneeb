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
    <div>
      <SubHeader title={i18n('pages.wallet.title')} path="/profile" />
      <div className="app__wallet">
        <div className="wallet__">
          <h3 className="hall">{i18n('pages.wallet.withdrawalMethod')}</h3>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="wallet__form">
                <div className="form__">
                  <div className="form__group">
                    <div className="label__form">
                      <span style={{ color: "red" }}>{i18n('pages.wallet.requiredField')}</span>
                      <span style={{ fontSize: "13px" }}>{i18n('pages.wallet.username')}</span>
                    </div>
                    <div className="input__div">
                      <InputFormItem
                        type="text"
                        name="usernamewallet"
                        placeholder={i18n("user.fields.username")}
                        className="input__withdraw "
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <div className="label__form">
                      <span style={{ color: "red" }}>{i18n('pages.wallet.requiredField')}</span>
                      <span style={{ fontSize: "13px" }}>{i18n('pages.wallet.walletName')}</span>
                    </div>
                    <div className="input__div">
                      <InputFormItem
                        type="text"
                        name="walletname"
                        placeholder={i18n("user.fields.walletName")}
                        className="input__withdraw"
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <div className="label__form">
                      <span style={{ color: "red" }}>{i18n('pages.wallet.requiredField')}</span>
                      <span style={{ fontSize: "13px" }}>
                        {i18n('pages.wallet.choosePreferredCoin')}:
                      </span>
                    </div>
                    <div className="input__div">
                      <SelectFormItem
                        name="preferredcoin"
                        options={userEnumerators.wallet.map((value) => ({
                          value,
                          label: i18n(`user.enumerators.status.${value}`),
                        }))}
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <div className="label__form">
                      <span style={{ color: "red" }}>{i18n('pages.wallet.requiredField')}</span>
                      <span style={{ fontSize: "13px" }}>{i18n('pages.wallet.walletAddress')}</span>
                    </div>
                    <div className="input__div">
                      <InputFormItem
                        type="text"
                        name="trc20"
                        placeholder={i18n("user.fields.walletAddress")}
                        className="input__withdraw"
                      />
                    </div>
                  </div>
                  
                  <div className="form__group">
                    <div className="label__form">
                      <span style={{ color: "red" }}>{i18n('pages.wallet.requiredField')}</span>
                      <span style={{ fontSize: "13px" }}>
                        {i18n('pages.wallet.withdrawPassword')}
                      </span>
                    </div>
                    <div className="input__div">
                      <InputFormItem
                        type="password"
                        name="withdrawPassword"
                        placeholder={i18n("user.fields.withdrawPassword")}
                        className="input__withdraw"
                      />
                    </div>
                  </div>
                </div>

                <button className="confirm" type="submit">
                  {i18n('pages.wallet.submit')}
                </button>
                <span style={{ fontSize: 13 }}>
                  <b>Note:</b> &nbsp; {i18n('pages.wallet.note')}
                </span>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default Wallet;