import React from "react";
import { ParameterAccordion } from "./ParameterAccordion";
import { SelectInput, TextInput } from "./Input";

export const SnareParameterOptions = ({
  printableDrum,
  register,
  errors,
  style,
}) => {
  return (
    <ParameterAccordion title="Snare Bed Settings">
      <div style={style}>
        <TextInput
          label="Snare Bed Angle"
          initialValue={printableDrum.snareBeds.snareBedAngle}
          register={register}
          registerTo="snareBeds.snareBedAngle"
          errors={errors?.snareBeds?.snareBedAngle}
          unitSuffix="°"
        />
        <TextInput
          label="Snare Bed Radius"
          initialValue={printableDrum.snareBeds.snareBedRadius}
          register={register}
          registerTo="snareBeds.snareBedRadius"
          errors={errors?.snareBeds?.snareBedRadius}
          unitSuffix="mm"
        />
        <TextInput
          label="Snare Bed Depth"
          initialValue={printableDrum.snareBeds.snareBedDepth}
          register={register}
          registerTo="snareBeds.snareBedDepth"
          errors={errors?.snareBeds?.snareBedDepth}
          unitSuffix="mm"
        />
      </div>
    </ParameterAccordion>
  );
};
