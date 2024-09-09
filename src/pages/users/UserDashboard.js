import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/Auth/contextAuth';
import { NavLink } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import JobPost from '../jobs/JobPost';
import { Button, AppBar, Toolbar, Typography, Grid } from '@mui/material';

function UserDashboard() {
  const { handleSignOut } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState('All');
  const categories = [
    'All',
    'Frontend Developer',
    'Backend Developer',
    'MERN Stack Developer',
    'Android Developer',
    'Graphic Designer'
  ];

  // Consolidate fetchJobs function
  const fetchJobs = async (category) => {
    const uid = localStorage.getItem("uid");
    let q;
    if (category === 'All') {
      q = query(collection(db, 'jobs'));
    } else {
      q = query(collection(db, 'jobs'), where('category', '==', category));
    }
    
    try {
      const jobsSnapshot = await getDocs(q);
      const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filteredJobs = [];

      for (const job of jobsList) {
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('jobId', '==', job.id),
          where('userUid', '==', uid)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);
        if (applicationsSnapshot.empty) {
          filteredJobs.push(job);
        }
      }

      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching jobs: ', error);
    }
  };

  useEffect(() => {
    fetchJobs(category);
  }, [category]);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            User Dashboard
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
        </Toolbar>
        <Toolbar>
          <NavLink to="/user/editprofile" style={{ margin: '0 10px' }}>Edit Profile</NavLink>
          <NavLink to="/user/viewjobstatus" style={{ margin: '0 10px' }}>View Job Status</NavLink>
          <NavLink to="/user/adminmessage" style={{ margin: '0 10px' }}>Admin's Message</NavLink>
          <NavLink to="/user/events" style={{ margin: '0 10px' }}>Events</NavLink>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '20px' }}>
          {categories.map(cat => (
            <Grid item key={cat}>
              <Button
                variant={category === cat ? 'contained' : 'outlined'}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            </Grid>
          ))}
        </Grid>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobPost key={job.id} job={job} />
          ))
        ) : (
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            No jobs available in this category.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
