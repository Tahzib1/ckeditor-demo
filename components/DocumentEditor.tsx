"use client";

import { useState, useEffect, useRef } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { DecoupledEditor, EventInfo } from "ckeditor5";
import { editorConfig } from "@/utils/editorConfig";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import { Document } from "@/types/document";
import { debounce } from "@/utils/debounce";

type DocumentEditorProps = {
  documentId: number;
};

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const editorContainerRef = useRef(null);
  const editorMenuBarRef = useRef<HTMLDivElement>(null);
  const editorToolbarRef = useRef<HTMLDivElement>(null);
  const editorOutlineRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [displayAutoSaveMessage, setDisplayAutoSaveMessage] = useState(false);
  const savedDocuments: Array<Document> = JSON.parse(
    localStorage.getItem("documents") ?? "[]"
  );
  const currentSavedDocument = savedDocuments.find(
    (doc) => doc.id === documentId
  );

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const additionalConfig = {
    documentOutline: {
      container: editorOutlineRef.current as unknown as HTMLElement,
    },
    initialData: currentSavedDocument?.contents ?? "",
  };

  const config = { ...editorConfig, ...additionalConfig };

  const onEditorReady = (editor: DecoupledEditor) => {
    if (editor.ui.view.toolbar.element) {
      editorToolbarRef?.current?.appendChild(editor.ui.view.toolbar.element);
    }
    if (editor.ui.view.menuBarView.element) {
      editorMenuBarRef?.current?.appendChild(
        editor.ui.view.menuBarView.element
      );
    }
  };

  const onEditorDestroyed = () => {
    Array.from(editorToolbarRef?.current?.children ?? []).forEach((child) =>
      child.remove()
    );
    Array.from(editorMenuBarRef?.current?.children ?? []).forEach((child) =>
      child.remove()
    );
  };

  const handleChange = (
    event: EventInfo<string, unknown>,
    editor: DecoupledEditor
  ) => {
    if (event.name !== "change:data") return;
    setDisplayAutoSaveMessage(false);
    debouncedSaveDocument(documentId, editor.getData());
  };

  const debouncedSaveDocument = debounce((documentId: number, data: string) => {
    saveDocument(documentId, data);
  }, 1000);

  const saveDocument = (documentId: number, data: string) => {
    setDisplayAutoSaveMessage(true);

    const documents: Array<Document> = JSON.parse(
      localStorage.getItem("documents") ?? "[]"
    );
    const documentIndex = documents.findIndex((doc) => doc.id === documentId);
    if (documentIndex >= 0) {
      documents[documentIndex] = {
        ...documents[documentIndex],
        contents: data,
      };
    } else {
      documents.push({
        id: documentId,
        name: `Document ${documentId}`,
        dateCreated: new Date(),
        contents: data,
      });
    }
    localStorage.setItem("documents", JSON.stringify(documents));
  };

  return (
    <div>
      <div className="flex justify-between align-middle mb-4 mt-8">
        <h1 className="text-xl ">
          {" "}
          {currentSavedDocument
            ? currentSavedDocument?.name
            : `Document ${documentId}`}
        </h1>
        {displayAutoSaveMessage && (
          <span className="text-gray-500 text-sm underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Auto Saved{" "}
          </span>
        )}
      </div>

      <div className="main-container relative">
        <div
          className="editor-container editor-container_document-editor editor-container_include-outline editor-container_include-pagination block"
          ref={editorContainerRef}
        >
          <div className="sticky top-0">
            <div
              className="editor-container__menu-bar"
              ref={editorMenuBarRef}
            ></div>
            <div
              className="editor-container__toolbar"
              ref={editorToolbarRef}
            ></div>
          </div>
          <div className="editor-container__editor-wrapper">
            <div className="editor-container__sidebar">
              <div ref={editorOutlineRef}></div>
            </div>
            <div className="editor-container__editor">
              <div ref={editorRef} className="prose max-w-full">
                {isLayoutReady && (
                  <CKEditor
                    onReady={(editor) => onEditorReady(editor)}
                    onChange={(event, editor) => {
                      handleChange(event, editor);
                    }}
                    onAfterDestroy={() => onEditorDestroyed()}
                    editor={DecoupledEditor}
                    config={config}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
