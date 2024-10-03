"use client";

import DocumentEditor from "@/components/DocumentEditor";

export default function Document({ params }: { params: { id: string } }) {
  return (
    <div>
      <DocumentEditor documentId={+params.id} />
    </div>
  );
}
