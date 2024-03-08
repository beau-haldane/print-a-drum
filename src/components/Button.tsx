import React from "react";
import { TailSpin } from "react-loader-spinner";

export const Button = ({
  onClick,
  buttonText,
  loading,
  disableSpinner = false,
}) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: "Roboto",
      height: "2em",
      fontSize: "1em",
      fontWeight: 550,
    }}
  >
    {loading && !disableSpinner ? (
      <TailSpin
        visible={true}
        height="20"
        width="20"
        color="#000"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        wrapperClass=""
      />
    ) : (
      buttonText
    )}
  </button>
);
