export const getEventColor = (type: Event['type']): string => {
  const colors = {
    training: 'bg-custom-green/90 hover:bg-custom-green text-white',
    meeting: 'bg-custom-purple/90 hover:bg-custom-purple text-white',
    audit: 'bg-yellow-500/90 hover:bg-yellow-500 text-black',
    review: 'bg-blue-500/90 hover:bg-blue-500 text-white'
  };
  return colors[type] || 'bg-gray-500/90 hover:bg-gray-500 text-white';
};

export const formatEventTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatEventDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const getDateRangeForView = (date: Date, view: ViewType): { start: Date; end: Date } => {
  const start = new Date(date);
  const end = new Date(date);

  if (view === 'week') {
    start.setDate(date.getDate() - date.getDay());
    end.setDate(start.getDate() + 6);
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const eventOverlaps = (event: Event, events: Event[]): boolean => {
  return events.some(e => 
    e.id !== event.id &&
    new Date(event.start) < new Date(e.end) &&
    new Date(event.end) > new Date(e.start)
  );
};