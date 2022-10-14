export enum CertificationIconFormat {
  SVG = 'svg',
  JPEG = 'jpg',
  PNG = 'png',
  PNG_PIXELATED = 'png-pixelated',
  WEBP = 'webp',
  JPEG_XL = 'jxl',
}

export interface CertificationIcon {
  readonly formats: readonly CertificationIconFormat[];
  readonly placeholder: string;
}

export interface Certification {
  readonly name: string;
  readonly link: string;
  readonly skills: string;
  readonly icon: CertificationIcon;
}

const certifications: Record<string, Certification> = {
  /* Compiled YAML content */
} as any;

export default certifications;
