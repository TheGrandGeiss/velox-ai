'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Dashboard = () => {
  const myEvents = [
    { title: 'AI-Scheduled Task', date: '2025-08-11' },
    { title: 'Another task', date: '2025-08-12' },
    { title: 'Meeting with team', date: '2025-08-14' },
    { title: 'Project deadline', date: '2025-08-16' },
    { title: 'Client call', date: '2025-08-20' },
  ];
  return (
    <>
      <div className='flex justify-start items-start gap-8 w-full h-full'>
        <div className='w-3/12'>hey</div>
        <div className='w-9/12 '>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView='timeGridWeek'
            editable={true}
            events={myEvents}
            height={'90vh'}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
