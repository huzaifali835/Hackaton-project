import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getDatabase, ref, push } from "firebase/database";
import { collection, addDoc, setDoc, updateDoc, doc } from 'firebase/firestore';
import { database, db } from '../../firebase';

function JobFormDialog({ open, onClose }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobSalary, setJobSalary] = useState({ min: '', max: '' });
  const [experience, setExperience] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'Frontend Developer',
    'Backend Developer',
    'MERN Stack Developer',
    'Android Developer',
    'Graphic Designer'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
    var res =   await  addDoc(collection(db, 'jobs'), {
        title: jobTitle,
        salaryRange: `${jobSalary.min} - ${jobSalary.max}`,
        experience: experience,
        category: category,
        createdAt: new Date(),
        // jobId:newId
      });
      const jobId = res.id;

      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        jobId: jobId
      });
      setJobTitle('');
      setJobSalary({ min: '', max: '' });
      setExperience('');
      setCategory('');
      alert('Job posted successfully');
      onClose();
    } catch (error) {
      console.error('Error posting job: ', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Post a Job</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            fullWidth
            required
            margin="dense"
          />
          <TextField
            label="Min Salary"
            type="number"
            value={jobSalary.min}
            onChange={(e) => setJobSalary({ ...jobSalary, min: e.target.value })}
            fullWidth
            required
            margin="dense"
          />
          <TextField
            label="Max Salary"
            type="number"
            value={jobSalary.max}
            onChange={(e) => setJobSalary({ ...jobSalary, max: e.target.value })}
            fullWidth
            required
            margin="dense"
          />
          <TextField
            label="Experience Required"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            fullWidth
            required
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Post Job</Button>
      </DialogActions>
    </Dialog>
  );
}

export default JobFormDialog;
