import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function SendMessageDialog({ open, onClose }) {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (message.trim() === '') {
      alert('Message cannot be empty');
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        message,
        timestamp: new Date(),
      });
      setMessage('');
      alert('Message sent to all users');
      onClose();
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Send Message</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Message"
          type="text"
          fullWidth
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSend}>Send</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SendMessageDialog;
