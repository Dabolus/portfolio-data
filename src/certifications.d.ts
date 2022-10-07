export interface CertificationIcon {
  readonly svg?: string;
  readonly jpg?: string;
  readonly png?: string;
  readonly webp?: string;
  readonly jxl?: string;
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
