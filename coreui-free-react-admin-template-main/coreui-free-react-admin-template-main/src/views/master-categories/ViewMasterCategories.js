import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ViewMasterCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:3001/api/master-categories')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      await axios.delete(`http://localhost:3001/api/master-categories/${id}`)
      setCategories(categories.filter((cat) => cat._id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete category')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="container mt-4">
      <h2>Master Categories</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && categories.length === 0 && <p>No master categories found.</p>}

      {categories.length > 0 && (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>{category.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/master-categories/edit/${category._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(category._id)}
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

export default ViewMasterCategories
