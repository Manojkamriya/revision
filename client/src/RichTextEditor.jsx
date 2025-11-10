import React, { useRef, useState } from "react";

function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
    handleInput(); // update parent state after formatting
  };

  return (
    <div>
      <div style={{ marginBottom: "0.5rem" }}>
        <button type="button" onClick={() => formatText("bold")}>B</button>
        <button type="button" onClick={() => formatText("italic")}>I</button>
        <button type="button" onClick={() => formatText("underline")}>U</button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "0.5rem",
          minHeight: "100px",
          overflowY: "auto"
        }}
      />
    </div>
  );
}
export default RichTextEditor;