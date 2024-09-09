import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography } from '@mui/material';

function AdminUserData() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const usersList = querySnapshot.docs.map(doc => doc.data());
    setUsers(usersList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        User's Data
      </Typography>
      <Button variant="contained" color="primary" onClick={fetchUsers} style={{ marginBottom: '20px' }}>
        Refresh User Data
      </Button>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Bio</strong></TableCell>
              <TableCell><strong>Profile</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.bio}</TableCell>
                <TableCell>
                  {user.profilePicURL && (
                    <img
                      src={user.profilePicURL}
                      alt={`${user.name}'s profile`}
                      width="50"
                      height="50"
                      style={{ border: '1px solid gray', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default AdminUserData;
