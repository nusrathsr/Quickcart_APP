import React, { useState } from 'react'
import axios from 'axios'
import { Form, Button, Spinner } from 'react-bootstrap'

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dy1sluo6i/upload'
const UPLOAD_PRESET = 'my_unsigned_preset'

const CreateCategory = () => {
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)

        setLoading(true)
        try {
            const res = await axios.post(CLOUDINARY_URL, formData)
            setImage(res.data.secure_url)
        } catch (err) {
            alert('Image upload failed')
        }
        setLoading(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !image) return alert('Please enter name and upload image')

        try {
            await axios.post('http://localhost:3001/api/categories', { name, image })
            alert('Category created successfully!')
            setName('')
            setImage('')
        } catch (err) {
            alert('Failed to create category')
        }
    }

    return (
        <div>
            <h2>Create Category</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Category Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageUpload} required />
                    {loading && <Spinner animation="border" size="sm" />}
                    {image && (
                        <div className="mt-2">
                            <img src={image} alt="preview" height={80} />
                        </div>
                    )}
                </Form.Group>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Create'}
                </Button>
            </Form>
        </div>
    )
}

export default CreateCategory
