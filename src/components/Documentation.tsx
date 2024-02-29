import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";

export const Documentation = ({ style }) => {
  const [shellSettings, setShellSettings] = useState("");

  useEffect(() => {
    (async () => {
      const shellSettings = await fetch("docs/ShellSettings.md");
      const lugSettings = await fetch("docs/LugSettings.md");
      const bearingEdgeSettings = await fetch("docs/BearingEdgeSettings.md");
      const snareBedSettings = await fetch("docs/SnareBedSettings.md");
      setShellSettings(
        (await shellSettings.text()) +
          (await lugSettings.text()) +
          (await bearingEdgeSettings.text()) +
          (await snareBedSettings.text())
      );
    })();
  }, []);

  return <Markdown style={style}>{shellSettings}</Markdown>;
};
