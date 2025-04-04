export interface NotificationProps {
  message: string;
  onClose: () => void;
}


export interface PhishingAttempt {
  _id: string;
  email: string;
  templateId: string;
  status: string;
  trackingId: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  clickedAt?: string;
  __v: number;
}

export enum PhishingAttemptStatus {
  PENDING = 'pending',
  SENT = 'sent',
  CLICKED = 'clicked',
  FAILED = 'failed',
}

export interface WebSocketEvent {
  trackingId: string;
  status: string;
  email: string;
  clickedAt?: string;
}
