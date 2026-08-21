import PropTypes from "prop-types";
import React, { useEffect } from "react";
import ImagesUploader from "src/view/shared/uploaders/ImagesUploader";
import { useFormContext } from "react-hook-form";
import FormErrors from "src/shared/form/FormErrors";

function ImagesFormItem(props) {
  const { label, name, hint, storage, max, required, externalErrorMessage } =
    props;

  const {
    errors,
    formState: { touched, isSubmitted },
    setValue,
    watch,
    register,
  } = useFormContext();



  useEffect(() => {
    register({ name });
  }, [register, name]);

  const errorMessage = FormErrors.errorMessage(
    name,
    errors,
    touched,
    isSubmitted,
    externalErrorMessage
  );

  return (
    <>



      <ImagesUploader
        storage={storage}
        value={watch(name)}
   
        max={max}
      />


      <div className="invalid-feedback">{errorMessage}</div>
      {Boolean(hint) && <small className="form-text text-muted">{hint}</small>}
    </ >
  );
}

ImagesFormItem.defaultProps = {
  max: undefined,
  required: false,
};

ImagesFormItem.propTypes = {
  storage: PropTypes.object.isRequired,
  max: PropTypes.number,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  formItemProps: PropTypes.object,
};

export default ImagesFormItem;
