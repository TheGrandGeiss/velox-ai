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
import EditEventModal from './modal';
import CreateOnSelect from './CreateOnSelect';
import { useDateFormat } from '@/hooks/useDateFormat';
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';
import { getUserProfile } from '@/lib/actions/profileAction';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // 👈 Import the spinner

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

  // 🆕 LOADING STATE
  const [isLoading, setIsLoading] = useState(true);

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

  const [timeBounds, setTimeBounds] = useState({
    min: '06:00:00',
    max: '23:00:00',
  });

  const calendarRef = useRef<FullCalendar>(null);

  // 🆕 UNIFIED DATA FETCHING (More robust)
  useEffect(() => {
    async function initDashboard() {
      if (!session?.user) return;

      try {
        setIsLoading(true);

        // 1. Run both fetches at the same time (Faster)
        const [profileData, eventsResponse] = await Promise.all([
          getUserProfile(),
          fetch('/api/events', {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
          }),
        ]);

        // 2. Handle Profile Time Bounds
        if (profileData && profileData.wakeUpTime && profileData.sleepTime) {
          const formatTimeBound = (time: string) => {
            if (!time) return null;
            return time.length === 5 ? `${time}:00` : time;
          };
          setTimeBounds({
            min: formatTimeBound(profileData.wakeUpTime) || '06:00:00',
            max: formatTimeBound(profileData.sleepTime) || '23:00:00',
          });
        }

        // 3. Handle Events
        if (eventsResponse.status === 401 || eventsResponse.status === 403) {
          router.push('/');
          return;
        }

        const eventsData = await eventsResponse.json();

        const getColorByCategory = (cat: string) => {
          const map: Record<string, string> = {
            work: '#b591ef',
            personal: '#9ceca6',
            meeting: '#f2d785',
            urgent: '#f3a4b5',
          };
          return map[cat?.toLowerCase()] || '#dbeafe';
        };

        const transformedEvents = (eventsData.events || []).map(
          (event: Message) => ({
            id: event.id,
            title: event.title,
            start: new Date(event.start),
            end: event.end ? new Date(event.end) : undefined,
            category: event.category,
            backgroundColor:
              event.backgroundColor ||
              getColorByCategory(event.category || 'work'),
            borderColor: 'transparent',
            textColor: '#1a1423',
            description: event.description,
          }),
        );

        setEvents(transformedEvents);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        toast.error('Failed to load calendar');
      } finally {
        // 4. Stop loading only when everything is ready
        setIsLoading(false);
      }
    }

    initDashboard();
  }, [session, router]);

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
        toast.success('Event Updated!!');
      }
    } catch {
      info.revert();
    }
  }

  async function handleEventDelete() {
    if (!eventDetails?.id) return;
    try {
      if (!session?.user?.id) redirect('/signup');
      const accessToken = await getValidAccessToken(session.user.id);
      const response = await fetch(`/api/events/${eventDetails.id}`, {
        headers: {
          'Content-type': 'application/json',
          'X-Google-Token': accessToken || '',
        },
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventDetails.id));
        setDialogOpen(false);
        toast.success('Event deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete event');
    }
  }

  const handleEventClick = (info: EventClickArg) => {
    setEventDetails({
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description || '',
      start: info.event.start?.toISOString() || '',
      end: info.event.end?.toISOString(),
      category: info.event.extendedProps.category || '',
      backgroundColor: info.event.backgroundColor,
      textColor: info.event.textColor,
      createdAt: info.event.extendedProps.createdAt,
    });
    setDialogOpen(true);
  };

  function handleEventUpdated(updatedEvent: Event) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === updatedEvent.id
          ? {
              ...e,
              title: updatedEvent.title,
              description: updatedEvent.description,
              start: new Date(updatedEvent.start),
              end: updatedEvent.end ? new Date(updatedEvent.end) : undefined,
              category: updatedEvent.category,
            }
          : e,
      ),
    );
    if (eventDetails?.id === updatedEvent.id) setEventDetails(updatedEvent);
    setSheetOpen(false);
    setDialogOpen(false);
  }

  function handleSelectableEventCreation(selectableInfo: DateSelectArg) {
    setSelectableEvent({
      start: selectableInfo.startStr,
      end: selectableInfo.endStr,
      startDate: selectableInfo.start,
      endDate: selectableInfo.end,
    });
    setSelectDateModalOpen(true);
  }

  return (
    <div className='flex flex-col h-full w-full'>
      <div className='flex-1 bg-[#1c1c21] md:rounded-[32px] shadow-2xl border border-white/5 relative overflow-hidden'>
        {/* 🆕 LOADING OVERLAY */}
        {isLoading && (
          <div className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1c21]'>
            <Loader2 className='w-10 h-10 text-[#b591ef] animate-spin mb-4' />
            <p className='text-gray-400 text-sm animate-pulse'>
              Loading your schedule...
            </p>
          </div>
        )}

        {/* Only render FullCalendar if NOT loading (or keep it hidden). 
            Rendering it hidden avoids layout shifts if you prefer opacity transition.
            Here we just conditionally render for simplicity.
        */}
        <div
          className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
          <div
            className='h-full min-w-[800px] md:min-w-0'
            data-custom-calendar>
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
              ]}
              initialView='timeGridWeek'
              editable={true}
              events={events}
              selectable={true}
              select={handleSelectableEventCreation}
              height='100%'
              contentHeight='auto'
              handleWindowResize={true}
              headerToolbar={{
                left: 'title',
                center: 'dayGridMonth,timeGridWeek,timeGridDay',
                right: 'prev,today,next',
              }}
              slotMinTime={timeBounds.min || '04:00:00'}
              slotMaxTime={timeBounds.max || '00:00:00'}
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
              slotDuration='00:30:00'
              slotLabelInterval={'1:00'}
              dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
              eventResize={handleEventChange}
              eventDrop={handleEventChange}
              eventClick={handleEventClick}
              firstDay={1}
              dayHeaderContent={(arg) => {
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
          </div>
        </div>

        {/* --- MODALS (No Changes here) --- */}
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
                  {eventDetails?.end && ` - ${formatTime(eventDetails.end)}`}
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
                onClick={() => setSheetOpen(true)}>
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

        <CreateOnSelect
          open={SelectDateModalOpen}
          setOpen={setSelectDateModalOpen}
          setEvents={setEvents}
          selectedData={selectableEvent}
        />

        <EditEventModal
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          eventDetails={eventDetails}
          onEventUpdated={handleEventUpdated}
        />
      </div>
    </div>
  );
};

export default Dashboard;
