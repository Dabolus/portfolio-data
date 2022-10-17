export enum IconFormat {
  SVG = 'svg',
  JPEG = 'jpg',
  PNG = 'png',
  PNG_PIXELATED = 'png-pixelated',
  GIF = 'gif',
  GIF_PIXELATED = 'gif-pixelated',
  WEBP = 'webp',
  JPEG_XL = 'jxl',
}

export interface Icon {
  /** The array of formats supported by this icon, sorted by priority. */
  readonly formats: readonly IconFormat[];
  readonly placeholder: string;
}
