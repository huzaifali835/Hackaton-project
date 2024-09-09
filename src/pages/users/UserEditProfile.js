import React, { useState, useEffect, useContext } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { AuthContext } from '../../context/Auth/contextAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, TextField, Typography, Grid, Card, CardContent, CardMedia, Container } from '@mui/material';

function UserEditProfile() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || '');
          setBio(userData.bio || '');
          setProfilePicURL(userData.profilePicURL || '');
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let newProfilePicURL = profilePicURL;

      if (profilePic) {
        const storageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageRef, profilePic);
        newProfilePicURL = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name: name,
        bio: bio,
        profilePicURL: newProfilePicURL,
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px', textAlign: 'center' }}>
        Edit Profile
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Bio"
              variant="outlined"
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
            />
            <div>
              <label htmlFor="profile-pic-upload">
                <input
                  id="profile-pic-upload"
                  type="file"
                  onChange={handleProfilePicChange}
                  style={{ display: 'none' }}
                />
                <Button variant="contained" component="span">
                  Upload Profile Picture
                </Button>
              </label>
              {profilePicURL && (
                <CardMedia
                  component="img"
                  alt="Profile Picture"
                  image={profilePicURL}
                  style={{ marginTop: '20px', width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
            </div>
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default UserEditProfile;
