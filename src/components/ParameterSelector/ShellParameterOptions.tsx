import React from "react";
import { ParameterAccordion } from "./ParameterAccordion";
import { SelectInput, TextInput } from "./Input";

export const ShellParameterOptions = ({
  printableDrum,
  register,
  errors,
  style,
}) => {
  return (
    <ParameterAccordion title="Shell Settings">
      <div style={style}>
        <SelectInput
          label="Drum Type"
          register={register}
          registerTo="drumType"
          inputOptions={[
            {
              value: 'snare',
              label: "Snare Drum",
            },
            {
              value: 'tom',
              label: "Tom Tom",
            },
          ]}
          errors={errors?.lugs?.lugRows}
          initialValue={printableDrum.lugs.lugRows}
        />
        <TextInput
          label="Fitment Tolerance"
          initialValue={printableDrum.fitmentTolerance}
          register={register}
          registerTo="fitmentTolerance"
          errors={errors?.fitmentTolerance}
        />
        <TextInput
          label="Diameter"
          initialValue={printableDrum.shell.diameterInches}
          register={register}
          registerTo="shell.diameterInches"
          errors={errors?.shell?.diameterInches}
        />
        <TextInput
          label="Depth"
          initialValue={printableDrum.shell.depthInches}
          register={register}
          registerTo="shell.depthInches"
          errors={errors?.shell?.depthInches}
        />
        <TextInput
          label="Thickness"
          initialValue={printableDrum.shell.shellThickness}
          register={register}
          registerTo="shell.shellThickness"
          errors={errors?.shell?.shellThickness}
        />
        <TextInput
          label="Lugs Per Segment"
          initialValue={printableDrum.shell.lugsPerSegment}
          register={register}
          registerTo="shell.lugsPerSegment"
          errors={errors?.shell?.lugsPerSegment}
        />
        <TextInput
          label="Vent Hole Diameter"
          initialValue={printableDrum.shell.ventHoleDiameter}
          register={register}
          registerTo="shell.ventHoleDiameter"
          errors={errors?.shell?.ventHoleDiameter}
        />
      </div>
    </ParameterAccordion>
  );
};