export interface ProjectIcon {
  readonly svg?: string;
  readonly jpg?: string;
  readonly png?: string;
  readonly webp?: string;
  readonly jxl?: string;
  readonly placeholder: string;
  readonly pixelart: {
    readonly bitmap: string;
    readonly colors: [string, string, string, string];
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

declare const projects: Record<string, Project>;

export default projects;
