export enum TimelineEventIconType {
  FILL = 'fill',
  STROKE = 'stroke',
}

export interface TimelineEvent {
  readonly month?: number;
  readonly day?: number;
  readonly title?: string;
  readonly description?: string;
  readonly icon?: {
    readonly color: string;
    readonly path: string | readonly string[];
    readonly type?: TimelineEventIconType;
  };
}

export interface TimelineItem {
  readonly year: number;
  readonly events: readonly TimelineEvent[];
}

const timeline: readonly TimelineItem[] = {
  /* Compiled YAML content */
} as any;

export default timeline;
