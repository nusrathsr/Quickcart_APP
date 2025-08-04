import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditMasterCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [image, setImage] = useState(''); // Store existing image URL
  const [newImage, setNewImage] = useState(null); // Store newly selected file
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch existing category data
  useEffect(() => {
    axios.get(`http://localhost:3001/api/master-categories/${id}`)
      .then(res => {
        setName(res.data.name);
        setImage(res.data.image);
      })
      .catch(err => console.error('Failed to fetch category:', err));
  }, [id]);

  // Handle Cloudinary image upload
  const handleImageUpload = async () => {
    if (!newImage) return image; // Keep old image if no new file selected
    const formData = new FormData();
    formData.append('file', newImage);
    formData.append('upload_preset', 'my_unsigned_preset'); // Cloudinary preset

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dy1sluo6i/image/upload`, formData);
      return res.data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return image; // Fallback to old image if upload fails
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const imageUrl = await handleImageUpload();

      await axios.put(`http://localhost:3001/api/master-categories/${id}`, {
        name,
        image: imageUrl,
      });

      setMessage('Master Category updated successfully!');
      setTimeout(() => navigate('/view-master-categories'), 1500); // Redirect after update
    } catch (error) {
      console.error(error);
      setMessage('Failed to update master category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Master Category</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Current Image Preview */}
        {image && (
          <div className="mb-3">
            <p>Current Image:</p>
            <img src={image} alt="Current" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
          </div>
        )}

        {/* Upload New Image */}
        <div className="mb-3">
          <label className="form-label">Upload New Image (optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setNewImage(e.target.files[0])}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Master Category'}
        </button>
      </form>

      {/* Message */}
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
};

export default EditMasterCategory;
