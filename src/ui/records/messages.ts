/** What the Person reads when an Upload is not accepted. Plain, no blame, one next step. */
import type { UploadRejection } from "../../domains/records/rules";

export type UploadProblem = UploadRejection["reason"] | "rate_limited";

export function uploadProblemMessage(problem: UploadProblem, fileName?: string | null): string {
  const named = fileName ? `“${fileName}”` : "One of the files";
  switch (problem) {
    case "no_files":
      return "Choose a PDF or some photos to upload.";
    case "unsupported_type":
      return `${named} is not a PDF, JPEG or PNG, so Health Hub cannot show it. If it is a photo from an iPhone, choose it again or take it again with the camera; your phone will then send it as a JPEG.`;
    case "empty_file":
      return `${named} is empty. Please choose it again.`;
    case "file_too_large":
      return `${named} is too large. A PDF can be up to 25 MB and a photo up to 15 MB.`;
    case "upload_too_large":
      return "These files add up to more than 100 MB. Upload fewer photos at a time.";
    case "too_many_photos":
      return "You can upload up to 30 photos as one Record. Upload the rest as another Record.";
    case "mixed_pdf_and_photos":
      return "Upload a PDF on its own, or photos on their own, not both together.";
    case "more_than_one_pdf":
      return "Upload one PDF at a time. Each PDF becomes its own Record.";
    case "rate_limited":
      return "You have uploaded a lot in the last hour. Please wait a little and try again.";
  }
}
