import pdf from 'pdf-parse';
import { AppError } from './appError.js';

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

  try {
    const data = await pdf(buffer);

    const text = (data.text || '').trim();

    if (!text || text.length < 50) {
      throw AppError.badRequest(
        'Could not extract readable text - the PDF may be scanned, rasterized, or empty'
      );
    }

    return {
      text,
      meta: {
        numPages: data.numpages ?? null,
      },
    };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message = error instanceof Error ? error.message : String(error);
    throw AppError.badRequest(`Failed to parse PDF: ${message}`);
  }
};
