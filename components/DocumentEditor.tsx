"use client";

import { useState, useEffect, useRef } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { DecoupledEditor, EventInfo } from "ckeditor5";
import { editorConfig } from "@/utils/editorConfig";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import { Document } from "@/types/document";
import { debounce } from "@/utils/debounce";
import { setupChannelId } from "@/utils/setupChannelId";

type DocumentEditorProps = {
  documentId: string;
};

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const editorMenuBarRef = useRef<HTMLDivElement>(null);
  const editorToolbarRef = useRef<HTMLDivElement>(null);
  const editorOutlineRef = useRef(null);

  const editorRef = useRef(null);
  const editorPresenceRef = useRef(null);
  const editorContainerRef = useRef(null);
  const editorInstanceRef = useRef<DecoupledEditor | null>(null);
  const editorAnnotationsRef = useRef<HTMLDivElement>(null);
  const editorRevisionHistoryRef = useRef(null);
  const editorRevisionHistoryEditorRef = useRef(null);
  const editorRevisionHistorySidebarRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [displayAutoSaveMessage, setDisplayAutoSaveMessage] = useState(false);
  const [displayCopiedMessage, setDisplayCopiedMessage] = useState(false);

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
    presenceList: {
      container: editorPresenceRef.current as unknown as HTMLElement,
    },
    collaboration: {
      channelId: documentId,
    },
    revisionHistory: {
      editorContainer: editorContainerRef.current as unknown as HTMLElement,
      viewerContainer:
        editorRevisionHistoryRef.current as unknown as HTMLElement,
      viewerEditorElement:
        editorRevisionHistoryEditorRef.current as unknown as HTMLElement,
      viewerSidebarContainer:
        editorRevisionHistorySidebarRef.current as unknown as HTMLElement,
      resumeUnsavedRevision: true,
    },
    sidebar: {
      container: editorAnnotationsRef.current as unknown as HTMLElement,
    },
  };

  const config = { ...editorConfig, ...additionalConfig };

  const onEditorReady = (editor: DecoupledEditor) => {
    editorInstanceRef.current = editor;
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

  const handleShareButtonClicked = () => {
    navigator.clipboard.writeText(window.location.href);
    setDisplayCopiedMessage(true);
    setTimeout(() => {
      setDisplayCopiedMessage(false);
    }, 3000);
  };

  const debouncedSaveDocument = debounce((documentId: string, data: string) => {
    saveDocument(documentId, data);
  }, 1000);

  const saveDocument = (documentId: string, data: string) => {
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
        id: setupChannelId(),
        name: `Document ${documentId}`,
        dateCreated: new Date(),
        contents: data,
      });
    }
    localStorage.setItem("documents", JSON.stringify(documents));
  };

  return (
    <div>
      <div className="flex justify-between items-center  mb-4 mt-8">
        <h1 className="text-xl">
          {" "}
          {currentSavedDocument ? currentSavedDocument?.name : `Document`}
        </h1>
        <div className=" flex gap-4 align-middle items-center">
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
          <button
            className={`flex gap-2  rounded px-2 text-xs leading-3 py-1 items-center  ${
              displayCopiedMessage
                ? "bg-green-200 hover:bg-green-300"
                : "bg-blue-200 hover:bg-blue-300"
            }`}
            onClick={handleShareButtonClicked}
          >
            {!displayCopiedMessage ? "Share" : "Copied to Clipboard"}
            <svg
              className="w-4 h-4 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`main-container relative ${
          !isLayoutReady ? "invisible" : ""
        }`}
      >
        <div className="presence" ref={editorPresenceRef}></div>
        <div
          className="editor-container editor-container_document-editor editor-container_include-outline editor-container_include-annotations block"
          ref={editorContainerRef}
        >
          <div className="sticky top-0 z-10">
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

            <div className="editor-container__sidebar">
              <div ref={editorAnnotationsRef}></div>
            </div>
          </div>
        </div>

        <div className="revision-history" ref={editorRevisionHistoryRef}>
          <div className="revision-history__wrapper">
            <div
              className="revision-history__editor"
              ref={editorRevisionHistoryEditorRef}
            ></div>
            <div
              className="revision-history__sidebar"
              ref={editorRevisionHistorySidebarRef}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
