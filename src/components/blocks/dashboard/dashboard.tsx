'use client';

import React, { useEffect, useState, useRef } from 'react';
import { redirect, useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, {
  EventResizeDoneArg,
} from '@fullcalendar/interaction';
import '../../../app/dashboard/calendar.css';
import { Event, Message } from '@/lib/types';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog';
import {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
} from '@fullcalendar/core/index.js';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import EventEditSheet from './sheet';
import CreateOnSelect from './CreateOnSelect';
import { useDateFormat } from '@/hooks/useDateFormat';
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';
import { useSession } from 'next-auth/react';

// Type for FullCalendar events
export interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end?: Date;
  category?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  description?: string;
}

const Dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { formatTime, formatDate } = useDateFormat();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventDetails, setEventDetails] = useState<Event>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [SelectDateModalOpen, setSelectDateModalOpen] =
    useState<boolean>(false);
  const [selectableEvent, setSelectableEvent] = useState<{
    start: string;
    end: string;
    startDate: Date;
    endDate: Date;
  } | null>(null);

  const calendarRef = useRef<FullCalendar>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events', {
          method: 'GET',
          headers: { 'content-type': 'application/json' },
        });

        if (response.status === 401 || response.status === 403) {
          router.push('/');
          return;
        }

        const data = await response.json();

        // Map colors based on category to match the pastel image look
        const getColorByCategory = (cat: string) => {
          const map: Record<string, string> = {
            work: '#b591ef', // Purple
            personal: '#9ceca6', // Green
            meeting: '#f2d785', // Yellow
            urgent: '#f3a4b5', // Pink
          };
          return map[cat.toLowerCase()] || '#dbeafe'; // Default light blue
        };

        const transformedEvents = (data.events || []).map((event: Message) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : undefined,
          category: event.category,
          // Use our new pastel palette, darker text for readability on pastels
          backgroundColor:
            event.backgroundColor ||
            getColorByCategory(event.category || 'work'),
          borderColor: 'transparent',
          textColor: '#1a1423',
          description: event.description,
        }));

        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      }
    }
    fetchEvents();
  }, [router]);

  async function handleEventChange(info: EventDropArg | EventResizeDoneArg) {
    try {
      const accessToken =
        session?.user?.id && (await getValidAccessToken(session?.user?.id));
      const response = await fetch(`/api/events/${info.event.id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'X-Google-Token': accessToken || '',
        },
        body: JSON.stringify({
          start: info.event.start,
          title: info.event.title,
          description: info.event.extendedProps.description,
          category: info.event.extendedProps.category,
          end: info.event.end,
        }),
      });
      const data = await response.json();
      if (data.event) {
        alert('Event Updated!!');
      }
    } catch {
      info.revert();
    }
  }
  async function handleEventDelete() {
    if (!eventDetails?.id) {
      console.log('No event ID found');
      return;
    }

    try {
      if (!session?.user?.id) {
        redirect('/signup');
      }
      const accessToken = await getValidAccessToken(session.user.id);
      const response = await fetch(`/api/events/${eventDetails.id}`, {
        headers: {
          'Content-type': 'application/json',
          'X-Google-Token': accessToken || '',
        },
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);

      const data = await response.json();
      console.log('Delete response data:', data);

      if (response.ok) {
        // Remove the event from the >calendar
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventDetails.id)
        );

        // Close the dialog
        setDialogOpen(false);

        alert('Event deleted successfully!');
      } else {
        console.error(
          'Delete failed with status:',
          response.status,
          'and data:',
          data
        );
        throw new Error(
          `Failed to delete event: ${data.error || 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(
        `Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
  const handleEventClick = (info: EventClickArg) => {
    const eventData = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description || '',
      start: info.event.start?.toISOString() || '',
      end: info.event.end?.toISOString(),
      category: info.event.extendedProps.category || '',
      backgroundColor: info.event.backgroundColor,
      textColor: info.event.textColor,
      createdAt: info.event.extendedProps.createdAt,
    };
    setEventDetails(eventData);
    setDialogOpen(true);
  };
  function handleEventUpdated(updatedEvent: Event) {
    // Update the events state with the updated event
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id
          ? {
              ...event,
              title: updatedEvent.title,
              description: updatedEvent.description,
              start: new Date(updatedEvent.start),
              end: updatedEvent.end ? new Date(updatedEvent.end) : undefined,
            }
          : event
      )
    );

    // Update the eventDetails state if it's the same event
    if (eventDetails?.id === updatedEvent.id) {
      setEventDetails(updatedEvent);
    }

    // Close the sheet
    setSheetOpen(false);
  }
  function handleSelectableEventCreation(selectableInfo: DateSelectArg) {
    setSelectableEvent({
      start: selectableInfo.startStr,
      end: selectableInfo.endStr,
      startDate: selectableInfo.start,
      endDate: selectableInfo.end,
    });

    console.log(selectableEvent);

    setSelectDateModalOpen(true);
  }

  return (
    <div className='flex flex-col h-full w-full'>
      <div className='flex-1 bg-[#1c1c21] md:rounded-[32px]  shadow-2xl border border-white/5 relative'>
        <div className='w-full h-full '>
          <div
            className='h-full min-w-[800px] md:min-w-0'
            data-custom-calendar>
            <FullCalendar
              ref={calendarRef}
              key={events.length}
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
              ]}
              // Force timeGridWeek even on mobile now, since we have horizontal scroll
              initialView='timeGridWeek'
              editable={true}
              events={events}
              selectable={true}
              select={handleSelectableEventCreation}
              // CRITICAL: Tells FullCalendar to fill the parent height
              height='100%'
              contentHeight='auto'
              handleWindowResize={true}
              headerToolbar={{
                left: 'title',
                center: 'dayGridMonth,timeGridWeek,timeGridDay',
                right: 'prev,today,next',
              }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
                list: 'List',
              }}
              titleFormat={{ month: 'long', year: 'numeric' }}
              nowIndicator={true}
              allDaySlot={false}
              slotMinTime='00:00:00'
              slotMaxTime='24:00:00'
              slotDuration='00:30:00'
              slotLabelInterval={'1:00'}
              dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
              eventResize={handleEventChange}
              eventDrop={handleEventChange}
              eventClick={handleEventClick}
              firstDay={1}
              // CUSTOM HEADER RENDERER (The "Monday 17" Stacked Look)
              dayHeaderContent={(arg) => {
                // We use the same stacked look for mobile and desktop now
                const date = arg.date.getDate();
                const weekday = arg.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                });

                return {
                  html: `
                            <div class="custom-header-wrapper">
                                <span class="custom-header-day">${weekday}</span>
                                <span class="custom-header-date">${date}</span>
                            </div>
                            `,
                };
              }}
            />

            {/* --- MODALS & SHEETS --- */}

            {/* 1. VIEW EVENT DIALOG */}
            <Dialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}>
              <DialogContent className='bg-[#1c1c21] border border-white/10 text-white shadow-2xl rounded-3xl p-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{
                      backgroundColor: eventDetails?.backgroundColor || '#fff',
                    }}></div>
                  <span className='text-gray-400 text-sm font-medium uppercase tracking-wider'>
                    {eventDetails?.category || 'Event'}
                  </span>
                </div>

                <DialogTitle className='text-3xl font-bold mb-6'>
                  {eventDetails?.title}
                </DialogTitle>

                <div className='space-y-4 mb-8 bg-[#0d0e12] p-4 rounded-2xl'>
                  <div className='flex items-center gap-3 text-gray-300'>
                    <span className='opacity-50'>📅</span>
                    <span>
                      {eventDetails?.start && formatDate(eventDetails.start)}
                    </span>
                  </div>
                  <div className='flex items-center gap-3 text-gray-300'>
                    <span className='opacity-50'>⏰</span>
                    <span>
                      {eventDetails?.start && formatTime(eventDetails.start)}
                      {eventDetails?.end &&
                        ` - ${formatTime(eventDetails.end)}`}
                    </span>
                  </div>
                </div>

                {eventDetails?.description && (
                  <p className='text-gray-400 bg-[#0d0e12] p-4 rounded-2xl mb-6 leading-relaxed'>
                    {eventDetails.description}
                  </p>
                )}

                <div className='flex gap-3'>
                  <button
                    className='flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-all'
                    onClick={() => setSheetOpen((prev) => !prev)}>
                    Edit
                  </button>
                  <button
                    onClick={handleEventDelete}
                    className='flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl font-medium transition-all'>
                    Delete
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            {/* 2. CREATE EVENT MODAL */}
            <CreateOnSelect
              open={SelectDateModalOpen}
              setOpen={setSelectDateModalOpen}
              setEvents={setEvents}
              selectedData={selectableEvent}
            />

            {/* 3. EDIT EVENT SHEET (Side Panel) */}
            <Sheet
              open={sheetOpen}
              onOpenChange={setSheetOpen}>
              <SheetContent
                side='right'
                className='w-full sm:w-[500px] bg-[#1c1c21] border-l border-white/10 text-white p-0 overflow-y-auto'>
                <div className='p-6 border-b border-white/10 sticky top-0 bg-[#1c1c21] z-10'>
                  <SheetTitle className='text-2xl font-bold'>
                    Edit Event
                  </SheetTitle>
                </div>
                <div className='p-6'>
                  <EventEditSheet
                    eventDetails={eventDetails}
                    onEventUpdated={handleEventUpdated}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
