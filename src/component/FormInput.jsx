import "../css/formInput.css";

const FormInput = (props) => {
  const { id, errorMessage, blur, onChange, onBlur, ...inputProps } = props;
  return (
    <div className="formInput">
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={onBlur}
        blur={blur?.toString()}
      />
      <span>{errorMessage}</span>
    </div>
  );
};

export default FormInput;
