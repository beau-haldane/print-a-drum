import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { setImperial, setMetric } from "../../state/unitSlice";

export const UnitSelector = () => {
  const unit = useSelector((state: RootState) => state.unit.unit);
  const dispatch = useDispatch();

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        fontSize: "14px",
      }}
    >
      <label style={{display: "flex", gap: "3px"}}>
        <input
          type="radio"
          name="site_name"
          checked={unit === "metric"}
          onChange={() => dispatch(setMetric())}
          style={{margin: 0}}
        />
        Metric
      </label>
      <label style={{display: "flex", gap: "3px"}}>
        <input
          type="radio"
          name="site_name"
          checked={unit === "imperial"}
          onChange={() => dispatch(setImperial())}
          style={{margin: 0}}
        />
        Imperial
      </label>
    </div>
  );
};
