import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

function JobStatusTable() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      const q =
        filter === 'all'
          ? query(collection(db, 'applications'))
          : query(collection(db, 'applications'), where('status', '==', filter));

      const querySnapshot = await getDocs(q);
      const jobsList = querySnapshot.docs.map((doc) => doc.data());
      setJobs(jobsList);
    };

    fetchJobs();
  }, [filter]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Job Status
      </Typography>
      <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setFilter('all')}
          sx={{ marginRight: 1 }}
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'contained' : 'outlined'}
          color="warning"
          onClick={() => setFilter('pending')}
          sx={{ marginRight: 1 }}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'accepted' ? 'contained' : 'outlined'}
          color="success"
          onClick={() => setFilter('accepted')}
          sx={{ marginRight: 1 }}
        >
          Accepted
        </Button>
        <Button
          variant={filter === 'rejected' ? 'contained' : 'outlined'}
          color="error"
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{job.jobTitle}</TableCell>
                  <TableCell align="center">{job.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">No jobs found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default JobStatusTable;
