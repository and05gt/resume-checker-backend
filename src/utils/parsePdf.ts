import { PDFParse } from 'pdf-parse';
import { AppError } from './appError.js';

interface PdfParseResult {
  text?: string;
  total?: number;
  pages?: unknown[];
  numpages?: number | null;
}

interface PdfTextMeta {
  numPages: number | null;
}

interface ExtractedPdfText {
  text: string;
  meta: PdfTextMeta;
}

export const extractText = async (
  buffer: Buffer
): Promise<ExtractedPdfText> => {
  if (buffer.length < 4 || buffer.subarray(0, 4).toString('ascii') !== '%PDF') {
    throw AppError.badRequest(
      'Invalid file: uploaded file is not a valid binary PDF document'
    );
  }

  let parser: InstanceType<typeof PDFParse> | undefined;

  try {
    parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = (await parser.getText()) as PdfParseResult;

    const text = (result?.text || '').trim();

    if (!text || text.length < 50) {
      throw AppError.badRequest(
        'Could not extract readable text - the PDF may be scanned, rasterized, or empty'
      );
    }

    const numPages =
      result.total ?? result.pages?.length ?? result.numpages ?? null;

    return {
      text,
      meta: { numPages },
    };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message = error instanceof Error ? error.message : String(error);
    throw AppError.badRequest(`Failed to parse PDF: ${message}`);
  } finally {
    try {
      await parser?.destroy?.();
    } catch {
      /* noop */
    }
  }
};
