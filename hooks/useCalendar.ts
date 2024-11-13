import { useState, useCallback } from 'react';
import type { Event, ViewType, CalendarState } from '@/types/calendar';

export const useCalendar = () => {
  const [state, setState] = useState<CalendarState>({
    currentDate: new Date(),
    events: [],
    view: 'week',
    loading: true,
    error: null,
    showEventModal: false,
    selectedEvent: null,
    isSubmitting: false
  });

  const fetchEvents = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { start, end } = getDateRangeForView(state.currentDate, state.view);

      const response = await fetch(
        `/api/events?start=${start.toISOString()}&end=${end.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setState(prev => ({ ...prev, events: data }));
    } catch (error) {
      console.error('Error fetching events:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load events. Please try again later.' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.currentDate, state.view]);

  const handleEventAction = useCallback(async (
    action: 'create' | 'update' | 'delete',
    eventData?: Partial<Event>
  ) => {
    try {
      setState(prev => ({ ...prev, isSubmitting: true, error: null }));

      let url = '/api/events';
      let method = 'POST';

      if (action === 'update' && eventData?.id) {
        url = `/api/events/${eventData.id}`;
        method = 'PUT';
      } else if (action === 'delete' && eventData?.id) {
        url = `/api/events/${eventData.id}`;
        method = 'DELETE';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: eventData ? JSON.stringify(eventData) : undefined
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} event`);
      }

      // Refetch events to ensure consistency
      await fetchEvents();

      setState(prev => ({ 
        ...prev, 
        showEventModal: false, 
        selectedEvent: null 
      }));
    } catch (error) {
      console.error(`Error ${action}ing event:`, error);
      setState(prev => ({ 
        ...prev, 
        error: `Failed to ${action} event. Please try again.` 
      }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [fetchEvents]);

  return {
    state,
    setState,
    fetchEvents,
    handleEventAction
  };
};