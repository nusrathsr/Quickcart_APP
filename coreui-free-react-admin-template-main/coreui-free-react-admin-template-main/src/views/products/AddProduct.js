import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dy1sluo6i/upload'
const UPLOAD_PRESET = 'new_unsigned_preset'

const AddProduct = ({ onAddSuccess }) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)

  // For categories
  const [masterCategories, setMasterCategories] = useState([])
  const [selectedMasterCategory, setSelectedMasterCategory] = useState('')
  const [subCategories, setSubCategories] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState('')

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // Fetch master categories on mount
  useEffect(() => {
    const fetchMasterCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/master-categories')
        setMasterCategories(res.data)
      } catch (err) {
        console.error('Failed to fetch master categories', err)
      }
    }
    fetchMasterCategories()
  }, [])

  // Fetch subcategories when master category changes
  useEffect(() => {
    if (!selectedMasterCategory) {
      setSubCategories([])
      setSelectedSubCategory('')
      return
    }

    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/sub-categories?masterCategoryId=${selectedMasterCategory}`
        )
        setSubCategories(res.data)
        setSelectedSubCategory('') // reset subcategory selection
      } catch (err) {
        console.error('Failed to fetch subcategories', err)
      }
    }

    fetchSubCategories()
  }, [selectedMasterCategory])

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
    if (!selectedMasterCategory) {
      alert('Please select a master category')
      return
    }
    if (!selectedSubCategory) {
      alert('Please select a subcategory')
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
        masterCategory: selectedMasterCategory,
        subCategory: selectedSubCategory,
      }

      console.log("Sending product data:", productData);

      const response = await axios.post('http://localhost:3001/api/products', productData)

      if (response.data) {
        alert('Product added successfully')
        navigate('/products/view')
        setName('')
        setPrice('')
        setQuantity('')
        setDescription('')
        setFile(null)
        setSelectedMasterCategory('')
        setSubCategories([])
        setSelectedSubCategory('')
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
        <Form.Group controlId="productName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="productPrice" className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="productQuantity" className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="productDescription" className="mb-3">
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

        <Form.Group controlId="masterCategory" className="mb-3">
          <Form.Label>Master Category</Form.Label>
          <Form.Select
            value={selectedMasterCategory}
            onChange={(e) => setSelectedMasterCategory(e.target.value)}
            required
          >
            <option value="">Select master category</option>
            {masterCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="subCategory" className="mb-3">
          <Form.Label>Subcategory</Form.Label>
          <Form.Select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            required
            disabled={!selectedMasterCategory || subCategories.length === 0}
          >
            <option value="">Select subcategory</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="productImage" className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Add Product'}
        </Button>
      </Form>
    </div>
  )
}

export default AddProduct
