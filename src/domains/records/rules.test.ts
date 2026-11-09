import { describe, expect, it } from "vite-plus/test";
import { classifyUpload, contentHash, recordLabel } from "./rules";

const jpeg = (name = "IMG_1.jpg", size = 100) => file(name, [0xff, 0xd8, 0xff], size);
const png = (name = "IMG_2.png", size = 100) => file(name, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], size);
const pdf = (size = 100) => file("letter.pdf", [0x25, 0x50, 0x44, 0x46, 0x2d], size);

function file(name: string, signature: number[], size: number) {
  const bytes = new Uint8Array(size);
  bytes.set(signature);
  return { name, bytes };
}

describe("classifyUpload", () => {
  it("accepts a single PDF as a PDF Upload", () => {
    const result = classifyUpload([pdf()]);
    expect(result).toEqual({ ok: true, form: "pdf", pages: [{ contentType: "application/pdf", bytes: expect.any(Uint8Array) }], originalName: "letter.pdf" });
  });

  it("accepts JPEG and PNG photos as a photo Upload, in the order given, with no Original Name", () => {
    const first = png("b.png");
    const second = jpeg("a.jpg");
    const result = classifyUpload([first, second]);
    expect(result).toEqual({
      ok: true,
      form: "photos",
      pages: [
        { contentType: "image/png", bytes: first.bytes },
        { contentType: "image/jpeg", bytes: second.bytes },
      ],
      originalName: null,
    });
  });

  it("rejects a HEIC photo, even when it is named .jpg", () => {
    // HEIC: a 4-byte box size, then "ftypheic".
    const heic = file("IMG_3.jpg", [0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63], 100);
    expect(classifyUpload([jpeg(), heic])).toEqual({ ok: false, reason: "unsupported_type", fileName: "IMG_3.jpg" });
  });

  it("rejects a PDF mixed with photos", () => {
    expect(classifyUpload([jpeg(), pdf()])).toEqual({ ok: false, reason: "mixed_pdf_and_photos" });
  });

  it("rejects more than one PDF", () => {
    expect(classifyUpload([pdf(), pdf()])).toEqual({ ok: false, reason: "more_than_one_pdf" });
  });

  it("rejects an Upload with no files", () => {
    expect(classifyUpload([])).toEqual({ ok: false, reason: "no_files" });
  });

  it("rejects an empty file", () => {
    expect(classifyUpload([jpeg(), { name: "blank.jpg", bytes: new Uint8Array(0) }])).toEqual({ ok: false, reason: "empty_file", fileName: "blank.jpg" });
  });

  it("accepts 30 photos but rejects 31", () => {
    const photos = (n: number) => Array.from({ length: n }, (_, i) => jpeg(`IMG_${i}.jpg`));
    expect(classifyUpload(photos(30)).ok).toBe(true);
    expect(classifyUpload(photos(31))).toEqual({ ok: false, reason: "too_many_photos" });
  });

  const MB = 1024 * 1024;
  /** The form or rejection only, so a failure never prints megabytes of bytes. */
  const outcome = (r: ReturnType<typeof classifyUpload>) => (r.ok ? r.form : { reason: r.reason, fileName: "fileName" in r ? r.fileName : undefined });

  it("accepts a 25 MB PDF but rejects one byte more", () => {
    expect(outcome(classifyUpload([pdf(25 * MB)]))).toBe("pdf");
    expect(outcome(classifyUpload([pdf(25 * MB + 1)]))).toEqual({ reason: "file_too_large", fileName: "letter.pdf" });
  });

  it("accepts a 15 MB photo but rejects one byte more", () => {
    expect(outcome(classifyUpload([jpeg("big.jpg", 15 * MB)]))).toBe("photos");
    expect(outcome(classifyUpload([jpeg("big.jpg", 15 * MB + 1)]))).toEqual({ reason: "file_too_large", fileName: "big.jpg" });
  });

  it("rejects photos totalling more than 100 MB, even when each is within its limit", () => {
    const photos = Array.from({ length: 7 }, (_, i) => jpeg(`IMG_${i}.jpg`, 15 * MB));
    expect(outcome(classifyUpload(photos.slice(0, 6)))).toBe("photos");
    expect(outcome(classifyUpload(photos))).toEqual({ reason: "upload_too_large", fileName: undefined });
  });
});

describe("contentHash", () => {
  const bytes = (text: string) => new TextEncoder().encode(text);

  it("is the SHA-256 of each Page's SHA-256, one per line, in order", async () => {
    // printf "$(printf abc | shasum -a 256 | cut -c1-64)" | shasum -a 256
    expect(await contentHash([bytes("abc")])).toBe("dfe7a23fefeea519e9bbfdd1a6be94c4b2e4529dd6b7cbea83f9959c2621b13c");
  });

  it("changes when the same photos are in a different order", async () => {
    expect(await contentHash([bytes("a"), bytes("b")])).not.toBe(await contentHash([bytes("b"), bytes("a")]));
  });

  it("does not collide when the same bytes are split across Pages differently", async () => {
    expect(await contentHash([bytes("ab"), bytes("c")])).not.toBe(await contentHash([bytes("a"), bytes("bc")]));
  });
});

describe("recordLabel", () => {
  it("is the Kind and Record Date when both are known", () => {
    expect(recordLabel({ kind: "clinic_letter", recordDate: "2024-03-12", originalName: "scan_0034.pdf", pageCount: null })).toBe("Clinic letter, 12 March 2024");
  });

  it("falls back to the Original Name when either is missing", () => {
    expect(recordLabel({ kind: "clinic_letter", recordDate: null, originalName: "scan_0034.pdf", pageCount: null })).toBe("scan_0034.pdf");
    expect(recordLabel({ kind: null, recordDate: null, originalName: "Letter from Dr Patel.pdf", pageCount: null })).toBe("Letter from Dr Patel.pdf");
  });

  it("is the photo count when there is no Original Name", () => {
    expect(recordLabel({ kind: null, recordDate: null, originalName: null, pageCount: 3 })).toBe("Photos, 3 pages");
    expect(recordLabel({ kind: null, recordDate: null, originalName: null, pageCount: 1 })).toBe("Photos, 1 page");
  });
});
