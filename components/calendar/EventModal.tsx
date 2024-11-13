  // components/calendar/EventModal.tsx
  import React, { useState, useEffect } from 'react';
  import { Event } from '@/types/calendar';
  import { 
    Clock, 
    MapPin, 
    Users, 
    Calendar,
    Tag,
    X,
    Save,
    Trash2
  } from 'lucide-react';
  import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
  import { Alert, AlertDescription } from '@/components/ui/alert';

  interface EventModalProps {
    event?: Event | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: Partial<Event>) => Promise<void>;
    onDelete?: (eventId: string) => Promise<void>;
    isSubmitting: boolean;
  }

  const EventModal: React.FC<EventModalProps> = ({ 
    event, 
    isOpen, 
    onClose, 
    onSave,
    onDelete,
    isSubmitting 
  }) => {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Partial<Event>>({
      title: '',
      start: new Date().toISOString().slice(0, 16),
      end: new Date().toISOString().slice(0, 16),
      type: 'meeting',
      location: '',
      description: '',
      attendees: []
    });

    useEffect(() => {
      if (event) {
        setFormData({
          ...event,
          start: new Date(event.start).toISOString().slice(0, 16),
          end: new Date(event.end).toISOString().slice(0, 16)
        });
      }
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      // Validate dates
      if (new Date(formData.start!) > new Date(formData.end!)) {
        setError('End time must be after start time');
        return;
      }

      try {
        await onSave(formData);
      } catch (err) {
        setError('Failed to save event. Please try again.');
      }
    };

    const handleDelete = async () => {
      if (!event?.id) return;

      if (window.confirm('Are you sure you want to delete this event?')) {
        try {
          await onDelete?.(event.id);
        } catch (err) {
          setError('Failed to delete event. Please try again.');
        }
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">
              {event ? 'Edit Event' : 'New Event'}
            </CardTitle>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-500/20 border-red-500">
                  <AlertDescription className="text-white">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as Event['type'] }))}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                  disabled={isSubmitting}
                >
                  <option value="meeting">Meeting</option>
                  <option value="training">Training</option>
                  <option value="audit">Audit</option>
                  <option value="review">Review</option>
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start}
                    onChange={e => setFormData(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end}
                    onChange={e => setFormData(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                  placeholder="Optional"
                  disabled={isSubmitting}
                />
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attendees
                </label>
                <input
                  type="text"
                  value={formData.attendees?.join(', ')}
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    attendees: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  }))}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                  placeholder="Enter email addresses, separated by commas"
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple h-32"
                  placeholder="Optional"
                  disabled={isSubmitting}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-700">
                <div>
                  {event && onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors flex items-center gap-2"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Event
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-custom-purple text-white rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? 'Saving...' : 'Save Event'}
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default EventModal;