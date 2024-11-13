// components/calendar/WeekView.tsx
import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { Event } from '@/types/calendar';
import { getEventColor } from '@/utils/calendar';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onEventClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  const getEventPosition = (event: Event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const dayIndex = startDate.getDay();
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    return {
      dayIndex,
      startHour,
      duration
    };
  };

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
      <div className="grid grid-cols-7">
        {/* Day headers */}
        {days.map((date, index) => (
          <div
            key={index}
            className="border-b border-r border-gray-700 p-2 text-center sticky top-0 bg-gray-800 z-10"
          >
            <div className="text-sm text-gray-400">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg ${
              date.toDateString() === new Date().toDateString() 
                ? 'text-custom-purple font-bold' 
                : 'text-white'
            }`}>
              {date.getDate()}
            </div>
          </div>
        ))}

        {/* Time slots */}
        {days.map((_, dayIndex) => (
          <div key={dayIndex} className="relative">
            {hours.map(hour => (
              <div
                key={hour}
                className="h-20 border-b border-r border-gray-700"
              />
            ))}

            {/* Events */}
            {events.map(event => {
              const { dayIndex: eventDayIndex, startHour, duration } = getEventPosition(event);

              if (eventDayIndex !== dayIndex) return null;

              return (
                <div
                  key={event.id}
                  className={`absolute left-1 right-1 rounded-lg p-2 cursor-pointer transition-opacity hover:opacity-80 ${getEventColor(event.type)}`}
                  style={{
                    top: `${startHour * 5}rem`,
                    height: `${duration * 5}rem`,
                    minHeight: '1.5rem'
                  }}
                  onClick={() => onEventClick(event)}
                >
                  <div className="text-sm font-semibold truncate">
                    {event.title}
                  </div>
                  {duration > 1 && (
                    <div className="text-xs space-y-1">
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      {event.attendees?.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{event.attendees.length} attendees</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;