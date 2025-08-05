import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dy1sluo6i/upload'
const UPLOAD_PRESET = 'new_unsigned_preset'

const EditProduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [quantity, setQuantity] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/${id}`)
                const { name, price, quantity, description, image } = response.data.product
                setName(name)
                setPrice(price)
                setQuantity(quantity)
                setDescription(description || '')
                setImage(image)
            } catch (err) {
                console.error('Error fetching product:', err)
                setError('Failed to fetch product data.')
            }
        }
        fetchProduct()
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

            const updatedProduct = {
                name,
                price: Number(price),
                quantity: Number(quantity),
                description,
                image: imageUrl,
            }
            
            const response = await axios.put(`http://localhost:3001/api/products/${id}`, updatedProduct)
            alert(response.data.message || 'Product updated successfully')
            navigate('/products/view')
        } catch (err) {
            console.error('Error updating product:', err.response || err.message)
            setError('Failed to update product: ' + (err.response?.data?.message || err.message))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-4">
            <h2>Edit Product</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="productName" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="productPrice" className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="productQuantity" className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="productDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter product description"
          />
        </Form.Group>

                <Form.Group controlId="productImage" className="mb-3">
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
                        accept="image/*"
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

export default EditProduct
