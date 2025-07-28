import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dy1sluo6i/upload' // your cloud name
const UPLOAD_PRESET = 'new_unsigned_preset' // your unsigned preset

const AddProduct = ({ onAddSuccess }) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null)
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/categories')
        setCategories(res.data)
      } catch (err) {
        console.error('Failed to fetch categories', err)
      }
    }
    fetchCategories()
  }, [])

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    try {
      const response = await axios.post(CLOUDINARY_URL, formData)
      return response.data.secure_url
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Failed to upload image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryId) {
      alert('Please select a category')
      return
    }

    setLoading(true)

    try {
      let imageUrl = ''
      if (file) {
        imageUrl = await uploadImage(file)
      }

      const productData = {
        name,
        price: Number(price),
        quantity: Number(quantity),
        description,
        image: imageUrl,
        category: categoryId,
      }
      console.log("Description:", description);
console.log("Sending product data:", productData);

      const response = await axios.post('http://localhost:3001/products', productData)

      if (response.data) {
        alert('Product added successfully')
        navigate('/products/view')
        setName('')
        setPrice('')
        setQuantity('')
        setDescription('')
        setFile(null)
        setCategoryId('')
        if (onAddSuccess) onAddSuccess()
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Add Product</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="productName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="productPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="productQuantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="productDescription">
  <Form.Label>Description</Form.Label>
  <Form.Control
    as="textarea"
    rows={3}
    placeholder="Enter product description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
  />
</Form.Group>

        <Form.Group controlId="productCategory">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="productImage">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading} className="mt-3">
          {loading ? 'Uploading...' : 'Add Product'}
        </Button>
      </Form>
    </div>
  )
}

export default AddProduct
