/**
 * Records rules. Pure functions and constants; no I/O.
 * Terms follow src/domains/records/GLOSSARY.md; limits follow docs/specs/records.md.
 */

export interface SuppliedFile {
  name: string;
  bytes: Uint8Array;
}

export interface PageContent {
  contentType: "application/pdf" | "image/jpeg" | "image/png";
  bytes: Uint8Array;
}

export type UploadClassification =
  | { ok: true; form: "pdf"; pages: [PageContent]; originalName: string }
  | { ok: true; form: "photos"; pages: PageContent[]; originalName: null }
  | UploadRejection;

export type UploadRejection =
  | { ok: false; reason: "unsupported_type" | "empty_file" | "file_too_large"; fileName: string }
  | { ok: false; reason: "no_files" | "mixed_pdf_and_photos" | "more_than_one_pdf" | "too_many_photos" | "upload_too_large" };

const MB = 1024 * 1024;
export const MAX_PHOTOS = 30;
export const MAX_PDF_BYTES = 25 * MB;
export const MAX_PHOTO_BYTES = 15 * MB;
export const MAX_UPLOAD_BYTES = 100 * MB;
/** A Person can make at most this many Uploads in any rolling hour. */
export const UPLOADS_PER_HOUR = 30;
export const HOUR_MS = 60 * 60 * 1000;
/** The sweep leaves files younger than this alone, so it never removes an Upload in progress. */
export const SWEEP_GRACE_MS = HOUR_MS;

const SIGNATURES: { contentType: PageContent["contentType"]; bytes: number[] }[] = [
  { contentType: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] },
  { contentType: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { contentType: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
];

/** The file's type from its leading bytes, never its name or the browser's MIME type. */
function sniff(bytes: Uint8Array): PageContent["contentType"] | null {
  const match = SIGNATURES.find((s) => s.bytes.every((b, i) => bytes[i] === b));
  return match?.contentType ?? null;
}

export function classifyUpload(files: SuppliedFile[]): UploadClassification {
  if (files.length === 0) return { ok: false, reason: "no_files" };
  const pages: PageContent[] = [];
  for (const f of files) {
    if (f.bytes.length === 0) return { ok: false, reason: "empty_file", fileName: f.name };
    const contentType = sniff(f.bytes);
    if (!contentType) return { ok: false, reason: "unsupported_type", fileName: f.name };
    const limit = contentType === "application/pdf" ? MAX_PDF_BYTES : MAX_PHOTO_BYTES;
    if (f.bytes.length > limit) return { ok: false, reason: "file_too_large", fileName: f.name };
    pages.push({ contentType, bytes: f.bytes });
  }
  if (files.reduce((total, f) => total + f.bytes.length, 0) > MAX_UPLOAD_BYTES) return { ok: false, reason: "upload_too_large" };
  const pdfCount = pages.filter((p) => p.contentType === "application/pdf").length;
  if (pdfCount > 1) return { ok: false, reason: "more_than_one_pdf" };
  if (pdfCount === 1 && pages.length > 1) return { ok: false, reason: "mixed_pdf_and_photos" };
  if (pdfCount === 1) return { ok: true, form: "pdf", pages: [pages[0]], originalName: files[0].name };
  if (pages.length > MAX_PHOTOS) return { ok: false, reason: "too_many_photos" };
  return { ok: true, form: "photos", pages, originalName: null };
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes as Uint8Array<ArrayBuffer>);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Identifies an Upload's content: the SHA-256 of each Page's SHA-256, one per line, in order. */
export async function contentHash(pages: Uint8Array[]): Promise<string> {
  const perPage = await Promise.all(pages.map(sha256Hex));
  return sha256Hex(new TextEncoder().encode(perPage.join("\n")));
}

/** What sort of Record it is. Set by extraction; Person Statement is fixed. */
export type Kind =
  | "clinic_letter"
  | "discharge_summary"
  | "test_result"
  | "prescription"
  | "imaging_report"
  | "person_statement"
  | "other";

const KIND_NAMES: Record<Kind, string> = {
  clinic_letter: "Clinic letter",
  discharge_summary: "Discharge summary",
  test_result: "Test result",
  prescription: "Prescription",
  imaging_report: "Imaging report",
  person_statement: "Person Statement",
  other: "Other document",
};

/** A calendar date as `YYYY-MM-DD`, shown in UK long form. */
export function formatRecordDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** How a Record is named in lists: Kind and Record Date, else Original Name, else its photo count. */
export function recordLabel(record: { kind: Kind | null; recordDate: string | null; originalName: string | null; pageCount: number | null }): string {
  if (record.kind && record.recordDate) return `${KIND_NAMES[record.kind]}, ${formatRecordDate(record.recordDate)}`;
  if (record.originalName) return record.originalName;
  const n = record.pageCount ?? 0;
  return `Photos, ${n} ${n === 1 ? "page" : "pages"}`;
}
