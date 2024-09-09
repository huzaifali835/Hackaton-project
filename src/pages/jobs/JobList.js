import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const querySnapshot = await getDocs(collection(db, 'jobs'));
      const jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsList);
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await deleteDoc(doc(db, 'jobs', id));
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: 20 }}>
      <Typography variant="h6" style={{ padding: '16px 16px 0 16px' }}>
        All Job Postings
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>Job Category</TableCell>
            <TableCell>Job Title</TableCell>
            <TableCell align="right">Salary Range</TableCell>
            <TableCell align="right">Experience Required</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.category}</TableCell>
              <TableCell>{job.title}</TableCell>
              <TableCell align="right">{job.salaryRange}</TableCell>
              <TableCell align="right">{job.experience}</TableCell>
              <TableCell align="right">
                <IconButton 
                  aria-label="delete"
                  onClick={() => handleDelete(job.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobList;
