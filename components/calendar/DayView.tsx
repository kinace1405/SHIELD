// components/calendar/DayView.tsx
import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { Event } from '@/types/calendar';
import { getEventColor } from '@/utils/calendar';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, events, onEventClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventPosition = (event: Event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    return {
      startHour,
      duration
    };
  };

  const todayEvents = events.filter(event => 
    new Date(event.start).toDateString() === currentDate.toDateString()
  );

  return (
    <div className="grid grid-cols-[100px_1fr] h-[800px] overflow-auto">
      {/* Time labels */}
      <div className="border-r border-gray-700">
        {hours.map(hour => (
          <div 
            key={hour}
            className="h-20 border-b border-gray-700 pr-2 text-right"
          >
            <span className="text-sm text-gray-400">
              {hour.toString().padStart(2, '0')}:00
            </span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="relative">
        {/* Current time indicator */}
        {currentDate.toDateString() === new Date().toDateString() && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-custom-purple z-20"
            style={{
              top: `${(new Date().getHours() + new Date().getMinutes() / 60) * 5}rem`
            }}
          />
        )}

        {/* Time slots */}
        {hours.map(hour => (
          <div
            key={hour}
            className="h-20 border-b border-gray-700"
          />
        ))}

        {/* Events */}
        {todayEvents.map(event => {
          const { startHour, duration } = getEventPosition(event);

          return (
            <div
              key={event.id}
              className={`absolute left-4 right-4 rounded-lg p-3 cursor-pointer transition-opacity hover:opacity-80 ${getEventColor(event.type)}`}
              style={{
                top: `${startHour * 5}rem`,
                height: `${duration * 5}rem`,
                minHeight: '2rem'
              }}
              onClick={() => onEventClick(event)}
            >
              <div className="text-sm font-semibold mb-1">
                {event.title}
              </div>
              <div className="text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(event.start).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                    {' - '}
                    {new Date(event.end).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.attendees?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees.length} attendees</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;