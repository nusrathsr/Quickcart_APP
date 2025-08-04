import React, { useState } from 'react'
import axios from 'axios'

const AddMasterCategory = () => {
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Slugify function to generate URL-friendly slugs from name
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')     // Replace multiple - with single -
  }

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
      setMessage('Image upload failed. Please try again.')
      return ''
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const imageUrl = await handleImageUpload()

      // If image upload failed, don't proceed
      if (image && !imageUrl) {
        setLoading(false)
        return
      }

      const slug = slugify(name)

      await axios.post('http://localhost:3001/api/master-categories', {
        name,
        slug,
        image: imageUrl,
      })

      setMessage('Master Category added successfully!')
      setName('')
      setImage(null)
    } catch (error) {
      console.error(error)
      const errMsg = error.response?.data?.error || 'Failed to add master category.'
      setMessage(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Add Master Category</h2>
      <form onSubmit={handleSubmit}>
        {/* Category Name */}
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

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Category Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Master Category'}
        </button>
      </form>

      {/* Message */}
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  )
}

export default AddMasterCategory
