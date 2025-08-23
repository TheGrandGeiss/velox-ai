'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../../app/dashboard/calendar.css';

const Dashboard = () => {
  const myEvents = [
    {
      title: 'Morning Workout',
      start: '2025-08-19T07:00:00',
      end: '2025-08-19T08:00:00',
    },
    {
      title: 'Team Meeting',
      start: '2025-08-19T09:00:00',
      end: '2025-08-19T10:00:00',
    },
    {
      title: 'Coding Session',
      start: '2025-08-19T11:00:00',
      end: '2025-08-19T13:00:00',
    },
    {
      title: 'Lunch Break',
      start: '2025-08-19T13:00:00',
      end: '2025-08-19T14:00:00',
    },
    {
      title: 'Reading Time',
      start: '2025-08-19T17:00:00',
      end: '2025-08-19T18:00:00',
    },
  ];

  return (
    <>
      <div className='flex justify-start items-start gap-8 w-full h-full'>
        <div
          className='w-full my-calendar-container pb-4'
          data-custom-calendar>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView='timeGridWeek'
            editable={true}
            events={myEvents}
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
            slotMinTime='07:00:00'
            slotMaxTime='22:00:00'
            allDaySlot={false}
            slotDuration='00:30:00'
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
