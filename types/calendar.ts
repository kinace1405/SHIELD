export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'training' | 'meeting' | 'audit' | 'review';
  location?: string;
  description?: string;
  attendees?: string[];
  createdBy?: string;
}

export type ViewType = 'week' | 'day';

export interface CalendarState {
  currentDate: Date;
  events: Event[];
  view: ViewType;
  loading: boolean;
  error: string | null;
  showEventModal: boolean;
  selectedEvent: Event | null;
  isSubmitting: boolean;
}