import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography } from '@mui/material';

function AdminAppliedJobs() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    const querySnapshot = await getDocs(collection(db, 'applications'));
    const applicationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setApplications(applicationsList);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status });
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status: ', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Profile Pic</TableCell>
            <TableCell>Job Category</TableCell>
            <TableCell>Job Title</TableCell>
            <TableCell>Salary Range</TableCell>
            <TableCell>Experience</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map(app => (
            <TableRow key={app.id}>
              <TableCell>{app.userName}</TableCell>
              <TableCell>{app.userEmail}</TableCell>
              <TableCell>
                <img src={app.userProfilePic} alt={app.userName} style={{ width: 50, height: 50, borderRadius: '50%' }} />
              </TableCell>
              <TableCell>{app.jobCategory}</TableCell>
              <TableCell>{app.jobTitle}</TableCell>
              <TableCell>{app.jobSalary}</TableCell>
              <TableCell>{app.jobExperience}</TableCell>
              <TableCell>{app.status}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusChange(app.id, 'accepted')}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleStatusChange(app.id, 'rejected')}
                  style={{ marginLeft: '10px' }}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AdminAppliedJobs;
