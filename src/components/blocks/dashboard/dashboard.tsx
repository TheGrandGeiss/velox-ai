'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {
  EventResizeDoneArg,
} from '@fullcalendar/interaction';
import '../../../app/dashboard/calendar.css';
import { Event, Message } from '@/lib/types';
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from '@/components/ui/dialog';
import { EventClickArg, EventDropArg } from '@fullcalendar/core/index.js';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import EventEditSheet from './sheet';

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventDetails, setEventDetails] = useState<Event>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  console.log('Current events state:', events);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events', {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Events API response:', data);
        console.log('Events array:', data.events);

        // Transform events for FullCalendar format
        const transformedEvents = (data.events || []).map((event: Message) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : null,
          // allDay: event.allDay || false,
          backgroundColor: event.backgroundColor || '#3b82f6',
          borderColor: event.borderColor || '#1d4ed8',
          textColor: event.textColor || '#ffffff',
          description: event.description,
        }));

        console.log('Transformed events for FullCalendar:', transformedEvents);
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      }
    }

    fetchEvents();
  }, []);

  async function handleEventChange(info: EventDropArg | EventResizeDoneArg) {
    try {
      const response = await fetch(`/api/events/${info.event.id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ start: info.event.start, end: info.event.end }),
      });
      const data = await response.json();
      if (data.event) {
        alert('Event Updated!!');
      }
    } catch {
      info.revert();
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEventClick = (info: EventClickArg): void => {
    setEventDetails({
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description || '',
      start: info.event.start?.toISOString() || '',
      end: info.event.end?.toISOString(),
      category: info.event.extendedProps.category || '',
      backgroundColor: info.event.backgroundColor || undefined,
      borderColor: info.event.borderColor || undefined,
      textColor: info.event.textColor || undefined,
      createdAt: info.event.extendedProps.createdAt,
    });

    setDialogOpen(true);
  };

  async function handleEventSave() {}

  return (
    <>
      <div className='flex justify-start items-start gap-8 w-full h-full'>
        <div
          className='w-full my-calendar-container pb-4'
          data-custom-calendar>
          <FullCalendar
            key={events.length} // Force re-render when events change
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView='timeGridWeek'
            editable={true}
            events={events}
            height={'97vh'}
            headerToolbar={{
              left: 'title today prev,next',
              center: '',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
            }}
            titleFormat={{ year: 'numeric', month: 'short' }}
            selectable={true}
            selectMirror={true}
            nowIndicator={true}
            slotMinTime='04:00:00'
            slotMaxTime='24:00:00'
            allDaySlot={false}
            slotDuration='00:15:00'
            eventDisplay='block'
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short',
            }}
            dayHeaderFormat={{
              weekday: 'short',
              day: 'numeric',
            }}
            eventResize={handleEventChange}
            eventDrop={handleEventChange}
            eventClick={handleEventClick}
            firstDay={1}
            weekends={true}
            dayHeaderContent={(arg) => {
              const date = arg.date.getDate();
              const weekday = arg.date.toLocaleDateString('en-US', {
                weekday: 'short',
              });
              return {
                html: `<div class="fc-day-header"><span class="day-num">${date}</span><span class="day-name">${weekday}</span></div>`,
              };
            }}
          />
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}>
            <DialogContent
              showCloseButton={false}
              className='bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl max-w-md mx-auto rounded-2xl overflow-hidden'>
              <DialogHeader className='space-y-4 p-6 pb-4'>
                {/* Event Category Badge */}
                {eventDetails?.category && (
                  <div className='flex justify-between items-start'>
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize'>
                      {eventDetails.category}
                    </span>
                    <button
                      onClick={() => setDialogOpen(false)}
                      className='p-1 hover:bg-gray-100 rounded-full transition-colors duration-200'>
                      <svg
                        className='w-5 h-5 text-gray-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Event Title */}
                <DialogTitle className='text-2xl font-bold text-gray-900 leading-tight pr-8'>
                  {eventDetails?.title}
                </DialogTitle>

                {/* Date and Time Section */}
                <div className='space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-100'>
                  {/* Date */}
                  <div className='flex items-center space-x-3'>
                    <div className='flex-shrink-0'>
                      <svg
                        className='w-5 h-5 text-gray-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <p className='text-gray-800 font-medium'>
                      {eventDetails?.start && formatDate(eventDetails.start)}
                    </p>
                  </div>

                  {/* Time */}
                  <div className='flex items-center space-x-3'>
                    <div className='flex-shrink-0'>
                      <svg
                        className='w-5 h-5 text-gray-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                    <p className='text-lg font-semibold text-gray-800'>
                      {eventDetails?.start && formatTime(eventDetails.start)}
                      {eventDetails?.end && (
                        <span className='text-gray-600'>
                          {' '}
                          - {formatTime(eventDetails.end)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {eventDetails?.description && (
                  <div className='pt-2'>
                    <h4 className='text-sm font-semibold text-gray-700 mb-2'>
                      Description
                    </h4>
                    <DialogDescription className='text-gray-600 leading-relaxed bg-white p-4 rounded-lg border border-gray-100'>
                      {eventDetails.description}
                    </DialogDescription>
                  </div>
                )}

                {/* Action Buttons */}
                <div className='flex space-x-3 pt-4 border-t border-gray-100'>
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2'>
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                        <span>Edit</span>
                      </button>
                    </SheetTrigger>
                    <SheetContent
                      side='right'
                      className='w-full sm:w-96 bg-white'>
                      <EventEditSheet
                        eventDetails={eventDetails}
                        onSave={handleEventSave}
                        onCancel={() => console.log('Edit cancelled')}
                      />
                    </SheetContent>
                  </Sheet>
                  <button className='flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
