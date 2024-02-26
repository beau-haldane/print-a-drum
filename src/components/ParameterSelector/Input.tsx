import React, { useState } from "react";

const InputContainer = ({ label, errors, children }) => (
  <div
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "end",
    }}
  >
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.85em",
      }}
    >
      <label>{label}</label>
      {children}
    </div>
    {errors && (
      <span style={{ fontSize: "0.75em", color: "#FF0000" }}>
        {errors.message}
      </span>
    )}
  </div>
);

export const TextInput = ({
  label,
  initialValue,
  register,
  registerTo,
  errors,
}) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  return (
    <>
      <InputContainer label={label} errors={errors}>
        <input
          style={{
            width: "100px",
            borderColor: errors && "#FF0000",
          }}
          {...register(registerTo)}
          type="text"
          value={inputValue}
          onChange={handleChange}
        />
      </InputContainer>
    </>
  );
};

export const SelectInput = ({
  label,
  register,
  registerTo,
  inputOptions,
  errors,
  initialValue = null,
}) => {
  return (
    <>
      <InputContainer label={label} errors={errors}>
        <select {...register(registerTo)} style={{ width: "108px" }}>
          {inputOptions.map((option, i) => {
            return option.value === initialValue ? (
              <option selected value={option.value} key={i}>
                {option.label}
              </option>
            ) : (
              <option value={option.value} key={i}>
                {option.label}
              </option>
            );
          })}
        </select>
      </InputContainer>
    </>
  );
};

