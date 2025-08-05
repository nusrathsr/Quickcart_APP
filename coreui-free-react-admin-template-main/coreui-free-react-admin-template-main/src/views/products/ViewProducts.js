import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Form } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'

const ViewProducts = () => {
    const { categorySlug } = useParams()
    const [products, setProducts] = useState([])
     const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 5

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/products', {
                 params: { page, limit, search, category: categorySlug }
            })
            setProducts(response.data.products || [])
             setTotalPages(response.data.totalPages)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

     useEffect(() => {
        fetchProducts();
    }, [page, search, categorySlug])

    const handleSearch = (event) => {
        const keyword = event.target.value;
        setSearch(keyword);
        setPage(1)
    };

    const deleteProduct = async (id) => {
        await axios.delete('http://localhost:3001/api/products/' + id)
        fetchProducts()
    }

    return (
        <div className="container mt-4">
            <h2>View Products {categorySlug && `- ${categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`}</h2>
            <Form.Control
                        type="text"
                        placeholder="Search products...."
                        value={search}
                        onChange={handleSearch}
                        className='mb-3'
                    />
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                border: '1px solid #ddd',
                                                borderRadius: '6px',
                                                padding: '2px',
                                                background: '#fff',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/products/edit/${product._id}`}>
                                        <Button variant="warning" size="sm" className="me-2">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => deleteProduct(product._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='d-flex justify-content-between'>
                    <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>

                    <span>Page {page} of {totalPages}</span>

                    <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
        </div>
    )
}

export default ViewProducts
