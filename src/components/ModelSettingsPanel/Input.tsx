import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { inchesToMillimeters, millimetersToInches } from "../../model/utils";

const countDecimals = (num) => {
  if (Math.floor(num) === num) return 0;
  return num.toString().split(".")[1].length || 0;
};

const InputContainer = ({ label, errors, children }) => (
  <div
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "end",
      position: "relative",
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

const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};

export const TextInput = ({
  label,
  initialValue,
  register,
  registerTo,
  errors,
  unitSuffix = "",
  allowConvert = true,
}) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [displayValue, setDisplayValue] = useState<string | null>(null);

  const handleChange = (number: number) => {
    setDisplayValue(number.toString()); // set display value to user input regardless of unit

    // convert relevant units
    unitSuffix === "mm" && unit === "imperial" && allowConvert && !!inputValue
      ? setInputValue(inchesToMillimeters(number))
      : setInputValue(number);
  };
  const unit = useSelector((state: RootState) => state.unit.unit);
  const displaySuffix =
    unitSuffix === "mm" && unit === "imperial" && allowConvert
      ? "inches"
      : unitSuffix;

  useEffect(() => {
    if (displayValue === null) setDisplayValue(initialValue);

    if (
      unitSuffix === "mm" &&
      unit === "imperial" &&
      allowConvert &&
      !!inputValue
    ) {
      const imperialValue = millimetersToInches(inputValue);
      countDecimals(imperialValue) > 2
        ? setDisplayValue(imperialValue.toFixed(2))
        : setDisplayValue(imperialValue.toString());
    } else if (
      unitSuffix === "mm" &&
      unit === "metric" &&
      allowConvert &&
      !!inputValue
    ) {
      // const metricValue = inchesToMillimeters(inputValue);
      countDecimals(inputValue) > 2
        ? setDisplayValue(inputValue.toFixed(2))
        : setDisplayValue(inputValue.toString());
    }
    //   ? setInputValue(
    //       Math.round((millimetersToInches(inputValue) + Number.EPSILON) * 100) /
    //         100
    //     )
    //   : setInputValue(
    //     Math.round((inchesToMillimeters(inputValue) + Number.EPSILON) * 100) /
    //       100
    //   )
  }, [unit]);

  return (
    <>
      <InputContainer label={label} errors={errors}>
        <input // metric
          type="number"
          id={registerTo}
          style={{
            width: "100px",
            borderColor: errors && "#FF0000",
          }}
          {...register(registerTo)}
          value={displayValue}
          onChange={(event) => handleChange(Number(event.target.value))}
        />

        {unitSuffix && (
          <div style={{ fontSize: "12px", position: "absolute", right: 5 }}>
            {displaySuffix}
          </div>
        )}
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
        <select
          {...register(registerTo)}
          defaultValue={initialValue}
          style={{ width: "108px" }}
        >
          {inputOptions.map((option, i) => {
            return (
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
