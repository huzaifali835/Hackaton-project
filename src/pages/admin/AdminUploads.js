import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function AdminUploads() {
  const [uploads, setUploads] = useState([]);

  const fetchUploads = async () => {
    const querySnapshot = await getDocs(collection(db, 'uploads'));
    const uploadsList = querySnapshot.docs.map(doc => doc.data());
    setUploads(uploadsList);
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <div>
      <h2>My Uploads</h2>
      <div className="uploads">
        {uploads.map((upload, index) => (
          <div key={index} className="upload-item">
            {upload.type === 'image' ? (
              <img src={upload.url} alt={upload.content} />
            ) : (
              <video controls>
                <source src={upload.url} type="video/mp4" />
              </video>
            )}
            <p>{upload.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUploads;
