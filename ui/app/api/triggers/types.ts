export interface Trigger {
  type: string;
  example_output: any;
}

export interface CronTrigger extends Trigger {
  type: 'time';
  schedule: string;
}

export interface WebhookTrigger extends Trigger {
  type: 'webhook';
  endpoint: string;
}

export interface EmailTrigger extends Trigger {
  type: 'email';
  subject: string;
  from: string;
  to: string;
  body: string;
}

export interface TextTrigger extends Trigger {
  type: 'text';
  text: string;
  from: string;
  to: string;
}

export interface SlackTrigger extends Trigger {
  type: 'slack';
  channel: string;
  text: string;
  user: string;
}

export interface DiscordTrigger extends Trigger {
  type: 'discord';
  channel: string;
  text: string;
  user: string;
}

export interface TelegramTrigger extends Trigger {
  type: 'telegram';
  chat_id: string;
  text: string;
}

export interface CustomTrigger extends Trigger {
  type: 'custom';
  name: string;
}
