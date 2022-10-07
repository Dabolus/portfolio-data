export interface Skill {
  score: number;
  color: string;
}

export interface Skills {
  readonly coding: Record<string, Skill>;
  readonly music: Record<string, Skill>;
  readonly soft: Record<string, Skill>;
}

declare const skills: Skills;

export default skills;
