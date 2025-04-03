export interface PhishingAttemptInterface {
  name: string;
  targetEmail: string;
  templateId: string;
  subject: string;
  content: string;
  sent: boolean;
  sentAt?: Date;
  opened: boolean;
  openedAt?: Date;
  clicked: boolean;
  clickedAt?: Date;
  simulationId?: string;
  createdBy: string;
}
