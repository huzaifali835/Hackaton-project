import React, { useEffect, useState } from 'react';
import { Card, CardContent, Button, Typography } from '@mui/material';
import { doc, setDoc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

const JobCard = ({ job, user }) => {
  const [applied, setApplied] = useState(false);
  const [uid,setuid]=useState("")

  useEffect(()=>{
    setData()
  },[])

 const setData=()=>{
    var uid = localStorage.getItem("uid")
    setuid(uid)

  }
  const handleApply = async () => {
    
    if (uid=="") return;

    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      const userData = userDoc.data();

      const applicationData = {
        userName: userData.name || 'No Name Provided',
        userEmail: userData.email || 'No Email Provided',
        userProfilePic: userData.profilePicURL || 'No Profile Picture Provided',
        jobTitle: job.title || 'No Title Provided',
        jobSalary: job.salaryRange || 'Salary Not Provided',
        jobExperience: job.experience || 'Experience Not Provided',
        jobCategory: job.category,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        jobId : job.jobId,
        userUid:uid
      };

      console.log(applicationData)

      var res =   await  addDoc(collection(db, 'applications'), applicationData)
      const applicationId = res.id;

      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, {
        applicationId: applicationId
      });

      setApplied(true);
    } catch (error) {
      console.error('Error applying for the job: ', error);
    }
  };

  return (
    <Card sx={{ maxWidth: 345, margin: '16px', padding: '16px' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {job.title || 'No Title Provided'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Salary: {job.salaryRange || 'Salary Not Provided'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Experience: {job.experience || 'Experience Not Provided'} years
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Job Category: {job.category || 'Category Not Provided'} years
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '10px' }}
          onClick={handleApply}
          disabled={applied} // Disable if already applied
        >
          {applied ? 'Applied' : 'Apply Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobCard;
