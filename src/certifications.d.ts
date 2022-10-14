export enum CertificationIconFormat {
  SVG = 'svg',
  JPEG = 'jpg',
  PNG = 'png',
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

declare const certifications: Record<string, Certification>;

export default certifications;
