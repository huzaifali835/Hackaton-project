import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { storage, db } from '../../firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

function EventPopup({ open, onClose }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (image) {
            const imageRef = ref(storage, `events/${uuidv4()}-${image.name}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);

            await addDoc(collection(db, 'events'), {
                content: content,
                imageUrl: imageUrl,
                createdAt: new Date()
            });

            onClose();
        } else {
            alert("Please upload an image");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogContent>
                <TextField
                    label="Event Content"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    fullWidth
                    required
                    margin="dense"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Create Event</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EventPopup;
