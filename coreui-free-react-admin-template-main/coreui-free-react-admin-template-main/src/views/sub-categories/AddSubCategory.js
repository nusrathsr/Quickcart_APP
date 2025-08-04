import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AddSubCategory = () => {
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const [masterCategories, setMasterCategories] = useState([])
  const [selectedMasterCategory, setSelectedMasterCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch all master categories for dropdown
  const fetchMasterCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/master-categories')
      setMasterCategories(res.data)
    } catch (err) {
      console.error('Failed to fetch master categories:', err)
    }
  }

  useEffect(() => {
    fetchMasterCategories()
  }, [])

  // Handle image upload to Cloudinary
  const handleImageUpload = async () => {
    if (!image) return ''
    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', 'my_unsigned_preset') // your Cloudinary preset

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dy1sluo6i/image/upload`, formData)
      return res.data.secure_url
    } catch (error) {
      console.error('Image upload failed:', error)
      return ''
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedMasterCategory) {
      setMessage('Please select a master category.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const imageUrl = await handleImageUpload()

      await axios.post('http://localhost:3001/api/sub-categories', {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        image: imageUrl,
        masterCategory: selectedMasterCategory,
      })

      setMessage('Sub Category added successfully!')
      setName('')
      setImage(null)
      setSelectedMasterCategory('')
    } catch (error) {
      console.error(error)
      setMessage('Failed to add sub category.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Add Sub Category</h2>
      <form onSubmit={handleSubmit}>
        {/* Sub Category Name */}
        <div className="mb-3">
          <label className="form-label">Sub Category Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Select Master Category */}
        <div className="mb-3">
          <label className="form-label">Master Category</label>
          <select
            className="form-control"
            value={selectedMasterCategory}
            onChange={(e) => setSelectedMasterCategory(e.target.value)}
            required
          >
            <option value="">-- Select Master Category --</option>
            {masterCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Sub Category Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Sub Category'}
        </button>
      </form>

      {/* Message */}
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  )
}

export default AddSubCategory
