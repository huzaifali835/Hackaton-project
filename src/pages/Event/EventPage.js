import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import EventPost from './EventPost';

function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Events</h2>
      {events.map(event => (
        <EventPost key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventsPage;
