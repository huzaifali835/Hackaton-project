import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Box, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';

function AdminMessage() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesList = [];
            querySnapshot.forEach((doc) => {
                messagesList.push(doc.data());
            });
            setMessages(messagesList);
        });
        return () => unsubscribe();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Messages
            </Typography>
            {messages.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    No messages available.
                </Typography>
            ) : (
                <Paper sx={{ padding: 2 }}>
                    <List>
                        {messages.map((msg, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemText
                                        primary={<Typography variant="body1">{msg.message}</Typography>}
                                        secondary={
                                            <Typography variant="caption" color="textSecondary">
                                                {new Date(msg.timestamp.seconds * 1000).toLocaleString()}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < messages.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}

export default AdminMessage;
