import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc, query, where, getCountFromServer, getDocsFromServer } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, Dialog, DialogTitle, DialogContent, List, ListItem } from '@mui/material';

function EventManager() {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(db, 'events');
                const eventsSnapshot = await getDocs(eventsCollection);
                const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                await fetchParticipantsCount(eventsList);
            } catch (error) {
                console.error('Error fetching events: ', error);
            }
        };

        const fetchParticipantsCount = async (eventsList) => {
            const updatedEvents = await Promise.all(eventsList.map(async (event) => {
                const participantsQuery = query(collection(db, 'event_participants'), where('eventId', '==', event.id));
                const participantsSnapshot = await getCountFromServer(participantsQuery);
                return { ...event, participantsCount: participantsSnapshot.data().count };
            }));
            setEvents(updatedEvents);
        };

        fetchEvents();
    }, []);

    const handleDelete = async (eventId) => {
        try {
            await deleteDoc(doc(db, 'events', eventId));
            setEvents(prev => prev.filter(event => event.id !== eventId));
            alert('Event deleted successfully!');
        } catch (error) {
            console.error('Error deleting event: ', error);
        }
    };

    const handleOpen = async (eventId) => {
        try {
            const participantsQuery = query(collection(db, 'event_participants'), where('eventId', '==', eventId));
            const participantsSnapshot = await getDocs(participantsQuery);
            const participantIds = participantsSnapshot.docs.map(doc => doc.data().userId);

            const usersQuery = query(collection(db, 'users'), where('uid', 'in', participantIds));
            const usersSnapshot = await getDocs(usersQuery);
            const participantList = usersSnapshot.docs.map(doc => doc.data());

            setSelectedEvent(eventId);
            setParticipants(participantList);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching participants: ', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEvent(null);
        setParticipants([]);
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Event Title</TableCell>
                            <TableCell>Participants</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.length > 0 ? (
                            events.map(event => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.content || 'No Title Available'}</TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleOpen(event.id)}
                                        >
                                            {event.participantsCount || 0}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="secondary"
                                            onClick={() => handleDelete(event.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Typography variant="h6" align="center">No events available.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Participants</DialogTitle>
                <DialogContent>
                    {participants.length > 0 ? (
                        <List>
                            {participants.map((participant, index) => (
                                <ListItem key={index}>
                                    {participant.name} ({participant.email})
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1">No participants available.</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EventManager;
