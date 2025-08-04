import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ViewSubCategories = () => {
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  // Fetch subcategories
  const fetchSubCategories = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:3001/api/sub-categories')
      setSubCategories(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch subcategories')
    } finally {
      setLoading(false)
    }
  }

  // Delete subcategory
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return
    try {
      await axios.delete(`http://localhost:3001/api/sub-categories/${id}`)
      setSubCategories(subCategories.filter((sub) => sub._id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete subcategory')
    }
  }

  useEffect(() => {
    fetchSubCategories()
  }, [])

  return (
    <div className="container mt-4">
      <h2>Sub Categories</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && subCategories.length === 0 && <p>No subcategories found.</p>}

      {subCategories.length > 0 && (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Master Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((sub) => (
              <tr key={sub._id}>
                <td>
                  {sub.image ? (
                    <img
                      src={sub.image}
                      alt={sub.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>{sub.name}</td>
                <td>{sub.masterCategory?.name || 'N/A'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/sub-categories/edit/${sub._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(sub._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ViewSubCategories
