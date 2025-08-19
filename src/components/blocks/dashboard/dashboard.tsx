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
      title: 'Doctor App Design',
      start: '2024-12-16T09:00:00',
      end: '2024-12-16T11:00:00',
      className: 'fc-event-doctor-app',
      extendedProps: {
        category: 'Design',
        description: 'UI/UX design for medical application',
      },
    },
    {
      title: 'Learning Time',
      start: '2024-12-16T11:30:00',
      end: '2024-12-16T13:00:00',
      className: 'fc-event-learning',
      extendedProps: {
        category: 'Education',
        description: 'Study session for new technologies',
      },
    },
    {
      title: 'Child Care Web Design',
      start: '2024-12-16T14:00:00',
      end: '2024-12-16T16:00:00',
      className: 'fc-event-childcare',
      extendedProps: {
        category: 'Design',
        description: 'Website design for childcare services',
      },
    },
    {
      title: 'Breakfast',
      start: '2024-12-16T07:00:00',
      end: '2024-12-16T08:00:00',
      className: 'fc-event-breakfast',
      extendedProps: {
        category: 'Personal',
        description: 'Morning meal and planning',
      },
    },
    {
      title: 'Meeting with UI/UX Team',
      start: '2024-12-16T15:00:00',
      end: '2024-12-16T16:30:00',
      className: 'fc-event-meeting-team',
      extendedProps: {
        category: 'Meeting',
        description: 'Team collaboration session',
        location: 'Google Meet',
        participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      },
    },
    {
      title: 'Project Deadline',
      start: '2024-12-17T17:00:00',
      end: '2024-12-17T18:00:00',
      className: 'fc-event-task',
      extendedProps: {
        category: 'Work',
        description: 'Final project submission',
      },
    },
    {
      title: 'Client Call',
      start: '2024-12-18T10:00:00',
      end: '2024-12-18T11:00:00',
      className: 'fc-event-meeting',
      extendedProps: {
        category: 'Meeting',
        description: 'Client consultation call',
      },
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
              left: 'title prev,next',
              center: '',
              right: 'today dayGridMonth,timeGridWeek,timeGridDay',
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
