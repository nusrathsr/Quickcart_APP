import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CLOUD_NAME = 'dy1sluo6i';
const UPLOAD_PRESET = 'my_unsigned_preset';

const EditSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [masterCategory, setMasterCategory] = useState('');
  const [masterCategories, setMasterCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch subcategory data
  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/sub-categories/${id}`);
        setName(res.data.name);
        setImage(res.data.image);
        setMasterCategory(res.data.masterCategory?._id || '');
      } catch (err) {
        console.error(err);
        setMessage('Failed to fetch subcategory data');
      }
    };

    const fetchMasterCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/master-categories');
        setMasterCategories(res.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to fetch master categories');
      }
    };

    fetchSubCategory();
    fetchMasterCategories();
  }, [id]);

  // Handle Cloudinary image upload
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      setImage(res.data.secure_url);
      setMessage('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      setMessage('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !masterCategory) {
      setMessage('Name and Master Category are required');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:3001/api/sub-categories/${id}`, {
        name,
        image,
        masterCategory,
      });
      setMessage('Sub Category updated successfully!');
      setTimeout(() => navigate('/sub-categories/view'), 1500);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update Sub Category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
      <h3>Edit Sub Category</h3>

      {/* Name */}
      <input
        type="text"
        placeholder="Sub Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />

      {/* Master Category Dropdown */}
      <select
        value={masterCategory}
        onChange={(e) => setMasterCategory(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      >
        <option value="">Select Master Category</option>
        {masterCategories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Image Upload */}
      <input
        type="file"
        onChange={(e) => handleImageUpload(e.target.files[0])}
        style={{ display: 'block', marginBottom: '10px' }}
      />

      {uploading && <p>Uploading image...</p>}
      {image && (
        <div>
          <img src={image} alt="Sub Category" style={{ width: '100px', marginBottom: '10px' }} />
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={loading || uploading}>
        {loading ? 'Updating...' : 'Update Sub Category'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default EditSubCategory;
