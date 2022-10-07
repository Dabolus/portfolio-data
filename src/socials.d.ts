export interface Social {
  readonly name: string;
  readonly link: string;
  readonly background: string;
}

declare const socials: Record<string, Social>;

export default socials;
