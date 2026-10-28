import { useCallback, useState } from "react";
import { toast } from "sonner";
import { getMyDocumentDownloadUrl } from "@/features/documents/api/documents.api";

const useDownloadDocument = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadDocument = useCallback(
    async (documentId: string) => {
      if (!documentId) {
        toast.error("Document ID is required");
        return;
      }

      setIsDownloading(true);

      try {
        const downloadUrl =
          await getMyDocumentDownloadUrl(documentId);

        if (!downloadUrl) {
          throw new Error("Download URL was not returned");
        }

        const link = window.document.createElement("a");
        link.href = downloadUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = "";

        window.document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success("Download started");
      } catch (error) {
        console.error("Document download failed:", error);
        toast.error("Failed to download document. Please try again.");
      } finally {
        setIsDownloading(false);
      }
    },
    [],
  );

  return {
    downloadDocument,
    isDownloading,
  };
};

export default useDownloadDocument;
