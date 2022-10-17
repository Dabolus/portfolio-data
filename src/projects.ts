import type { Icon } from './common.js';

export interface ProjectIcon extends Icon {
  readonly pixelart: {
    readonly bitmap: string;
    readonly colors: [string | null, string | null, string | null];
  };
}

export enum ProjectType {
  BOT_TELEGRAM = 'bot-telegram',
  BOT_DISCORD = 'bot-discord',
  BOT_SLACK = 'bot-slack',
  APP_WEB = 'app-web',
  APP_CROSS_PLATFORM = 'app-cross-platform',
  APP_WINDOWS = 'app-windows',
  APP_MACOS = 'app-macos',
  APP_LINUX = 'app-linux',
  APP_ANDROID = 'app-android',
  APP_IOS = 'app-ios',
}

export interface Project {
  readonly name: string;
  readonly description: string;
  readonly link: string;
  readonly source?: string;
  readonly type: ProjectType;
  readonly languages: readonly string[];
  readonly frameworks?: readonly string[];
  readonly api?: readonly string[];
  readonly icon: ProjectIcon;
}

const projects: Record<string, Project> = {
  /* Compiled YAML content */
} as any;

export default projects;
