export interface Skill {
  score: number;
  color: string;
}

export interface Skills {
  readonly coding: Record<string, Skill>;
  readonly music: Record<string, Skill>;
  readonly soft: Record<string, Skill>;
}

const skills: Skills = {
  /* Compiled YAML content */
} as any;

export default skills;
