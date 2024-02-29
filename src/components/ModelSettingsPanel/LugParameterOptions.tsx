import React from "react";
import { TextInput, SelectInput } from "./Input";
import { ParameterAccordion } from "./ParameterAccordion";

export const LugParameterOptions = ({
  printableDrum,
  register,
  errors,
  watch,
  style,
}) => {
  const lugType = watch("lugs.lugType");
  const lugRows = watch("lugs.lugRows");
  return (
    <ParameterAccordion title="Lug Settings">
      <div style={style}>
        <SelectInput
          label="Lug Type"
          register={register}
          registerTo="lugs.lugType"
          inputOptions={[
            {
              value: "singlePoint",
              label: "Single Point",
            },
            {
              value: "doublePoint",
              label: "Double Point",
            },
          ]}
          errors={errors?.lugs?.lugType}
          initialValue={printableDrum.lugs.lugType}
        />
        <SelectInput
          label="Lug Rows"
          register={register}
          registerTo="lugs.lugRows"
          inputOptions={[
            {
              value: 1,
              label: "1",
            },
            {
              value: 2,
              label: "2",
            },
          ]}
          errors={errors?.lugs?.lugRows}
          initialValue={printableDrum.lugs.lugRows}
        />
        {lugType === "doublePoint" && (
          <TextInput
            label="Lug Hole Spacing"
            initialValue={printableDrum.lugs.lugHoleSpacing}
            register={register}
            registerTo="lugs.lugHoleSpacing"
            errors={errors?.lugs?.lugHoleSpacing}
            unitSuffix="mm"
          />
        )}
        {lugRows === 2 ||
          (lugRows === "2" && (
            <TextInput
              label="Lug Distance From Edge"
              initialValue={printableDrum.lugs.lugHoleDistanceFromEdge}
              register={register}
              registerTo="lugs.lugHoleDistanceFromEdge"
              errors={errors?.lugs?.lugHoleDistanceFromEdge}
              unitSuffix="mm"
            />
          ))}
        <TextInput
          label="Lug Screw Hole Diameter"
          initialValue={printableDrum.lugs.lugHoleDiameter}
          register={register}
          registerTo="lugs.lugHoleDiameter"
          errors={errors?.lugs?.lugHoleDiameter}
          unitSuffix="mm"
        />
        <TextInput
          label="Lug Hole Pocket Diameter"
          initialValue={printableDrum.lugs.lugHolePocketDiameter}
          register={register}
          registerTo="lugs.lugHolePocketDiameter"
          errors={errors?.lugs?.lugHolePocketDiameter}
          unitSuffix="mm"
        />
        <TextInput
          label="Lug Hole Pocket Depth"
          initialValue={printableDrum.lugs.lugHolePocketDepth}
          register={register}
          registerTo="lugs.lugHolePocketDepth"
          errors={errors?.lugs?.lugHolePocketDepth}
          unitSuffix="mm"
        />
      </div>
    </ParameterAccordion>
  );
};
