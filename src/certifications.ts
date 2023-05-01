import type { Icon } from './common.js';

export type CertificationIcon = Icon;

export interface Certification {
  readonly title: string;
  readonly subtitle?: string;
  readonly link?: string;
  readonly skills: string;
  readonly icon: CertificationIcon;
}

const certifications: Record<string, Certification> = {
  /* Compiled YAML content */
} as any;

export default certifications;
