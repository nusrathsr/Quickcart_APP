import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dy1sluo6i/upload'
const UPLOAD_PRESET = 'my_unsigned_preset'

const EditOfferProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [image, setImage] = useState('')
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')          
  const [offerText, setOfferText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/offer-products/${id}`)
        const { name, price, offerPrice, image, title, offerText } = response.data.offer
                setName(name)
                setPrice(price)
                setOfferPrice(offerPrice)
                setImage(image)
                setTitle(title || '')           // new
                setOfferText(offerText || '')
                } catch (err) {
                console.error('Error fetching product:', err)
                setError('Failed to fetch product data.')
            }
        }
        fetchOffer()
    }, [id])

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

     try {
    const response = await axios.post(CLOUDINARY_URL, formData)
    return response.data.secure_url
   } catch (err) {
            console.error('Upload error:', err)
            throw new Error('Failed to upload image')
        }
    }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrl = image
      if (file) {
        imageUrl = await uploadImage(file)
      }

      const updatedOfferProduct = {
                name,
                price: Number(price),
                offerPrice: Number(offerPrice),
                image: imageUrl,
                title,       
                offerText,
            }

      const response = await axios.put(`http://localhost:3001/api/offer-products/${id}`, updatedOfferProduct)

      alert('Offer product updated successfully')
      navigate('/offer-products/list')
    } catch (err) {
      console.error('Error updating offer product:', err)
      setError('Failed to update offer product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit Offer Product</h2>

      {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
          <Form.Label>Banner Title</Form.Label>    {/* new */}
          <Form.Control
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Next-Level Gaming Starts Here..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Offer Subtitle</Form.Label>  {/* new */}
          <Form.Control
            type="text"
            value={offerText}
            onChange={e => setOfferText(e.target.value)}
            placeholder="Hurry up only few lefts!"
          />
        </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Original Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Offer Price</Form.Label>
            <Form.Control
              type="number"
              value={offerPrice}
              onChange={e => setOfferPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Image</Form.Label><br />
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Current product"
                                        width="100"
                                        height="100"
                                        style={{ objectFit: 'cover', marginBottom: '10px' }}
                                    />
                                ) : (
                                    <p>No image available</p>
                                )}
            <Form.Control
              type="file"
              onChange={e => setFile(e.target.files[0])}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
          </Button>
        </Form>
        </div>
      )
    }

export default EditOfferProduct