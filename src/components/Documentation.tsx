import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";

export const Documentation = () => {
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
      style={{
        backgroundColor: "#FFF",
        margin: "10px 0px",
        borderRadius: "0 5px 5px 0",
        padding: "20px 40px",
        minWidth: "600px",
        maxWidth: "calc(100vw - (370px * 2))",
        overflowY: "scroll",
        scrollbarGutter: "stable both-edges",
      }}
    >
      {shellSettings}
    </Markdown>
  );
};
