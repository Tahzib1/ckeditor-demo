"use client";

import { Document } from "@/types/document";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [documents, setDocuments] = useState<Array<Document>>([]);
  const [isCreatingNewDocument, setIsCreatingNewDocument] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState("");

  const sampleDocuments: Array<Document> = [1, 2, 3].map((id) => ({
    id,
    name: `Sample Document ${id}`,
    contents: "",
    dateCreated: new Date(),
  }));

  useEffect(() => {
    const savedDocuments = JSON.parse(
      localStorage.getItem("documents") ?? "[]"
    );
    setDocuments([...savedDocuments, ...sampleDocuments]);
  }, []);

  const handleNewDocumentClicked = () => {
    if (isCreatingNewDocument) {
      createNewDocument(newDocumentName);
      setNewDocumentName("");
      setIsCreatingNewDocument(false);
    } else {
      setNewDocumentName("");
      setIsCreatingNewDocument(true);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewDocumentName(e.target.value);
  };

  const handleCancelButtonClicked = () => {
    setNewDocumentName("");
    setIsCreatingNewDocument(false);
  };

  const createNewDocument = (name: string) => {
    const savedDocuments = JSON.parse(
      localStorage.getItem("documents") ?? "[]"
    );
    const newDocument: Document = {
      id: Math.floor(10000 + Math.random() * 90000),
      name,
      contents: "",
      dateCreated: new Date(),
    };

    const documents: Array<Document> = [newDocument, ...savedDocuments];
    setDocuments([...documents, ...sampleDocuments]);
    localStorage.setItem("documents", JSON.stringify(documents));
  };

  return (
    <div className="mt-24">
      <div className="flex justify-between align-middle">
        <h2 className="text-xl font-bold ">My Documents</h2>
        <div className="flex gap-2">
          {isCreatingNewDocument && (
            <input
              onChange={(e) => handleInputChange(e)}
              type="text"
              name="documentName"
              placeholder="Document Name"
              className="border-2  border-gray-300 rounded p-2 px-4"
            ></input>
          )}
          <button
            className="bg-green-400 p-2 px-4 rounded hover:bg-green-500"
            onClick={handleNewDocumentClicked}
          >
            {isCreatingNewDocument ? "Create" : "+ New Document"}
          </button>
          {isCreatingNewDocument && (
            <button
              className="bg-red-400 p-2 px-4 rounded hover:bg-red-500"
              onClick={handleCancelButtonClicked}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <ul className="list-none mt-8 grid-cols-3  grid gap-4">
        {documents.map((doc) => (
          <li
            key={doc.name + doc.id}
            className=" h-40 bg-slate-200 rounded  hover:bg-slate-300 border-2 border-slate-300"
          >
            <Link href={`/document/${doc.id}`} className="w-full h-full block">
              <div className="p-4">
                <h6 className="w-full h-full block">{doc.name}</h6>
                {doc.dateCreated && (
                  <span className="text-slate-600">
                    {" "}
                    Created on {`${new Date(doc.dateCreated).toDateString()}`}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className=" mt-24">
        <h2 className="text-xl font-bold">Features</h2>
        <article className="prose prose-slate">
          <ul>
            <li>Create & Edit Documents</li>
            <li>Autosave Documents</li>
            <li>Slash Commands</li>
            <li>AI Suggestions</li>
            <li>Document Outline</li>
            <li>Export to PDF/Word</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
