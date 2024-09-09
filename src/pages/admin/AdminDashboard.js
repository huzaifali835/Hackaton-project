import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/Auth/contextAuth';
import { Link, NavLink } from 'react-router-dom';
import JobFormDialog from '../jobs/JobFormDialog';
import EventPopup from '../Event/EventPopup';
import { Button, AppBar, Toolbar, Typography, Grid } from '@mui/material';
import SendMessageDialog from '../messages/SendMessageDialog';

function AdminPanel() {
  const { handleSignOut } = useContext(AuthContext);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const handleOpenJobDialog = () => {
    setOpenJobDialog(true);
  };

  const handleCloseJobDialog = () => {
    setOpenJobDialog(false);
  };

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleOpenMessageDialog = () => setIsMessageDialogOpen(true);
  const handleCloseMessageDialog = () => setIsMessageDialogOpen(false);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
        </Toolbar>
        <Toolbar>
          {/* <NavLink to="/admin/uploads" style={{ margin: '0 10px' }}>My Uploads</NavLink> */}
          <NavLink to="/admin/usersdata" style={{ margin: '0 10px' }}>User's Data</NavLink>
          <NavLink to="/admin/viewalljobs" style={{ margin: '0 10px' }}>View All Jobs</NavLink>
          <NavLink to="/admin/applied-jobs" style={{ margin: '0 10px' }}>View Applied Jobs</NavLink>
          <NavLink to="/admin/manageEvent" style={{ margin: '0 10px' }}>Manage Events</NavLink>
        </Toolbar>
      </AppBar>

      <div style={{ padding: '20px' }}>
        <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '20px' }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleOpenJobDialog}>
              Post a Job
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleOpenPopup}>
              Create Event
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleOpenMessageDialog}>
              Send Message
            </Button>
            <SendMessageDialog open={isMessageDialogOpen} onClose={handleCloseMessageDialog} />
          </Grid>
        </Grid>
        <JobFormDialog open={openJobDialog} onClose={handleCloseJobDialog} />
        <EventPopup open={isPopupOpen} onClose={handleClosePopup} />
      </div>
    </div>
  );
}

export default AdminPanel;
