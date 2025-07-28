import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Image } from 'react-bootstrap'

const ListCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('http://localhost:3001/api/categories')
      setCategories(response.data)
    } catch (err) {
      setError('Failed to fetch categories')
      console.error(err)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    console.log('Deleting category with ID:', id)
    if (!window.confirm('Are you sure you want to delete this category?')) return
    setDeletingId(id)
    try {
      await axios.delete(`http://localhost:3001/api/categories/${id}`)
      fetchCategories()
    } catch (err) {
      alert('Delete failed')
      console.error(err)
    }
    setDeletingId(null)
  }

  return (
    <div>
      <h2>List Categories</h2>

      {loading && <p>Loading categories...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && categories.length === 0 && <p>No categories found.</p>}

      {!loading && !error && categories.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '120px' }}>Image</th>
              <th>Name</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      thumbnail
                      style={{ maxHeight: 80, objectFit: 'contain' }}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td>{category.name}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(category._id)}
                    disabled={deletingId === category._id}
                  >
                    {deletingId === category._id ? 'Deleting...' : 'Delete'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default ListCategories
