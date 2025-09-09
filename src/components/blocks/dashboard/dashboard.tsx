'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../../app/dashboard/calendar.css';
import { Message } from '@/lib/types';
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from '@/components/ui/dialog';

const Dashboard = () => {
  const [events, setEvents] = useState<any[]>([]);

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
          <Dialog>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
