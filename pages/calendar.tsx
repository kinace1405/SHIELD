// pages/calendar.tsx
import { useState, useEffect } from 'react';
import WeekView from '@/components/calendar/WeekView';
import DayView from '@/components/calendar/DayView';
import EventModal from '@/components/calendar/EventModal';
import { Event } from '@/types/calendar';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock,
  Users,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getEventColor } from '@/utils/calendar';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'week' | 'day'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const start = new Date(currentDate);
      start.setDate(1);
      const end = new Date(currentDate);
      end.setMonth(end.getMonth() + 1, 0);

      const response = await fetch(
        `/api/events?start=${start.toISOString()}&end=${end.toISOString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const isEditing = Boolean(eventData.id);
      const url = isEditing 
        ? `/api/events/${eventData.id}` 
        : '/api/events';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      const savedEvent = await response.json();

      // Update local state
      setEvents(prevEvents => {
        if (isEditing) {
          return prevEvents.map(event => 
            event.id === eventData.id ? savedEvent : event
          );
        }
        return [...prevEvents, savedEvent];
      });

      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(prevEvents => 
        prevEvents.filter(event => event.id !== eventId)
      );

      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert className="mb-4 bg-red-500/20 border-red-500">
            <AlertDescription className="text-white">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">Calendar</h1>
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-xl text-white">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <button
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  view === 'week' ? 'bg-gray-700 text-white' : 'text-gray-400'
                }`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  view === 'day' ? 'bg-gray-700 text-white' : 'text-gray-400'
                }`}
                onClick={() => setView('day')}
              >
                Day
              </button>
            </div>
            <button
              className="bg-custom-purple text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-80 transition-colors"
              onClick={() => {
                setSelectedEvent(null);
                setShowEventModal(true);
              }}
            >
              <Plus className="w-5 h-5" />
              New Event
            </button>
          </div>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <>
                {view === 'week' && (
                  <WeekView
                    currentDate={currentDate}
                    events={events}
                    onEventClick={(event) => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                  />
                )}

                {view === 'day' && (
                  <DayView
                    currentDate={currentDate}
                    events={events}
                    onEventClick={(event) => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {showEventModal && (
          <EventModal
            event={selectedEvent}
            isOpen={showEventModal}
            onClose={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
            }}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;