import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { AuthContext } from '../../context/Auth/contextAuth';
import { Link } from 'react-router-dom';

function NewUsers() {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            name: doc.data().name,
            profilePicURL: doc.data().profilePicURL,
          }))
          .filter(u => u.id !== user.uid);
        
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user.uid]);

  return (
    <div>
      <h3>New Users</h3>
        
          {users.map(user => (
              <div style={{display: 'flex', flex: 1, alignItems: 'center', marginBottom: '20px', padding: '20px'}} key={user.uid}>
                <Link to={`/user/${user.id}`}>{user.profilePicURL && <img src={user.profilePicURL} alt={`${user.name}'s profile`} width="50" height="50" style={{border: '1px solid gray', borderRadius: '50%', objectFit: 'cover'}}/>}
                <span>{user.name}</span></Link>
              </div> 
          ))}
    </div>
  );
}

export default NewUsers;
