"use client";

import {
  ClassicEditor,
  Context,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  ContextWatchdog,
  Mention,
} from "ckeditor5";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";

import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import "ckeditor5/ckeditor5.css";
import { SlashCommand } from "ckeditor5-premium-features";

function Editor() {
  return (
    <CKEditorContext
      context={Context}
      contextWatchdog={ContextWatchdog}
      onChangeInitializedEditors={(editors) => {
        console.info(
          editors.editor1?.instance,
          editors.editor1?.metadata?.yourAdditionalData
        );
      }}
    >
      <CKEditor
        editor={ClassicEditor}
        config={{
          plugins: [Essentials, Bold, Italic, Paragraph, SlashCommand, Mention],
          toolbar: ["undo", "redo", "|", "bold", "italic"],
          licenseKey:
            "b3h3a2RWYjlMUjJJcHFPMGlyeDZHQm1tVVVaS3BxQzI4U0JYMWxPVEdyRm42TG9GdzlOWjIvS01nSUFFaFE9PS1NakF5TkRFd01qYz0=",
        }}
        data="<p>Hello from the first editor working with the context!</p>"
        contextItemMetadata={{
          name: "editor1",
          yourAdditionalData: 2,
        }}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor 1 is ready to use!", editor);
        }}
      />
    </CKEditorContext>
  );
}

export default Editor;
