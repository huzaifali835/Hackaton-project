import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { Button, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';

function EventPost() {
    const [events, setEvents] = useState([]);
    const [joinedEvents, setJoinedEvents] = useState(new Set()); // To track joined events
    const userId = localStorage.getItem("uid");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(db, 'events');
                const eventsSnapshot = await getDocs(eventsCollection);
                const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEvents(eventsList);
                await fetchJoinedEvents(); // Fetch joined events after setting events
            } catch (error) {
                console.error('Error fetching events: ', error);
            }
        };

        const fetchJoinedEvents = async () => {
            if (!userId) return;

            try {
                const joinedEventsSnapshot = await getDocs(
                    query(collection(db, 'event_participants'), where('userId', '==', userId))
                );
                const joinedEventsList = joinedEventsSnapshot.docs.map(doc => doc.data().eventId);
                setJoinedEvents(new Set(joinedEventsList));
            } catch (error) {
                console.error('Error fetching joined events: ', error);
            }
        };

        fetchEvents(); // Ensure this is only called once

    }, [userId]);

    const handleJoin = async (eventId) => {
        if (!userId) {
            console.error('User is not logged in');
            return;
        }

        try {
            const userRef = doc(db, 'event_participants', `${userId}_${eventId}`);
            await setDoc(userRef, {
                userId: userId,
                eventId: eventId,
                joinedAt: new Date(),
            });
            setJoinedEvents(prev => new Set(prev).add(eventId)); // Update state
            alert('Joined the event successfully!');
        } catch (error) {
            console.error('Error joining the event: ', error);
        }
    };

    return (
        <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
            {events.length > 0 ? (
                events.map(event => (
                    <Grid item key={event.id} xs={12} sm={6} md={4}>
                        <Card style={{ margin: '20px', maxWidth: '400px' }}>
                            <CardMedia
                                component="img"
                                alt="Event Image"
                                height="200"
                                image={event.imageUrl || 'default-image-url.png'} // Fallback image URL
                                style={{ objectFit: 'cover' }} // Ensure the image covers the card
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {event.content || 'No Content Available'}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => handleJoin(event.id)}
                                    disabled={joinedEvents.has(event.id)} // Disable button if user has joined
                                    fullWidth
                                >
                                    {joinedEvents.has(event.id) ? 'Joined' : 'Join Now'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography variant="h6" component="div" style={{ margin: '20px' }}>
                    No events available.
                </Typography>
            )}
        </Grid>
    );
}

export default EventPost;
