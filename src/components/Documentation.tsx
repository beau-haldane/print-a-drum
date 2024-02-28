import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";

export const Documentation = ({style}) => {
  const [shellSettings, setShellSettings] = useState("");

  useEffect(() => {
    (async () => {
      const shellSettings = await fetch("docs/ShellSettings.md");
      const lugSettings = await fetch("docs/LugSettings.md");

      setShellSettings(
        (await shellSettings.text()) + (await lugSettings.text())
      );
    })();
  }, []);

  return (
    <Markdown
      style={style}
    >
      {shellSettings}
    </Markdown>
  );
};
