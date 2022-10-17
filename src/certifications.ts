import type { Icon } from './common.js';

export type CertificationIcon = Icon;

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
