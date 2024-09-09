import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { AuthContext } from '../../context/Auth/contextAuth';

function UserProfile() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        if (user && userProfile) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setIsFollowing(userData.following.includes(userId));
          }
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    checkIfFollowing();
  }, [userProfile, user, userId]);

  const handleFollow = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const profileRef = doc(db, 'users', userId);

      if (isFollowing) {
        await updateDoc(userRef, {
          following: arrayRemove(userId),
        });
        await updateDoc(profileRef, {
          followers: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(userRef, {
          following: arrayUnion(userId),
        });
        await updateDoc(profileRef, {
          followers: arrayUnion(user.uid),
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <img 
                src={userProfile.profilePicURL || 'https://via.placeholder.com/150'} 
                alt={`${userProfile.name}'s profile`} 
                style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid black', objectFit: 'cover' }} 
            />
            <h1>{userProfile.name}</h1>
        </div>
      <p>{userProfile.bio}</p>
      <button onClick={handleFollow}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}

export default UserProfile;
