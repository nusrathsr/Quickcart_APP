import React, { useState } from 'react'
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dy1sluo6i/upload'
const UPLOAD_PRESET = 'my_unsigned_preset'

const AddOfferProduct = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [title, setTitle] = useState('')         
  const [offerText, setOfferText] = useState('') 
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const uploadImage = async () => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const response = await axios.post(CLOUDINARY_URL, formData)
    return response.data.secure_url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const imageUrl = await uploadImage()

      await axios.post('http://localhost:3001/api/offer-products', {
        name,
        price: Number(price),
        offerPrice: Number(offerPrice),
        image: imageUrl,
        title,
        offerText,
        
      })

      alert('Offer product added successfully')
      navigate('/offer-products/list')
    } catch (err) {
      alert('Failed to add offer product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Add Offer Product</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Original Price</Form.Label>
          <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Offer Price</Form.Label>
          <Form.Control type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Banner Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Next-Level Gaming Starts Here..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Offer Subtitle</Form.Label>
          <Form.Control
            type="text"
            value={offerText}
            onChange={(e) => setOfferText(e.target.value)}
            placeholder="Hurry up only few lefts!"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </Form>
    </div>
  )
}

export default AddOfferProduct