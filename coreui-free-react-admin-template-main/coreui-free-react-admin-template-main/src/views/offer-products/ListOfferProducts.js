import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Form, Row, Col, Pagination } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const ListOfferProducts = () => {
    const [offers, setOffers] = useState([])
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 5

    const fetchOffers = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/offer-products?search=${search}&page=${page}&limit=${limit}`)
            setOffers(response.data.offers || [])
            setTotalPages(response.data.totalPages)
        } catch (err) {
            console.error('Error fetching offer products:', err)
        }
    }

    useEffect(() => {
        fetchOffers();
    }, [page, search])

    const handleSearch = (event) => {
        const keyword = event.target.value;
        setSearch(keyword);
        setPage(1)
    };

    const deleteProduct = async (id) => {
        await axios.delete('http://localhost:3001/api/offer-products/' + id)
        fetchOffers()
    }

    return (
        <div className="container mt-4">
            <h2>Offer Products List</h2>
            <Form.Control
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={handleSearch}
                className='mb-3'
            />

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Title</th>          
                        <th>Offer Text</th>
                        <th>Name</th>
                        <th>Original Price</th>
                        <th>Offer Price</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {offers.length > 0 ? (
                        offers.map((product) => (
                            <tr key={product._id}>
                                <td>{product.title || '-'}</td>        
                                <td>{product.offerText || '-'}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.offerPrice}</td>
                                <td>
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            width="60"
                                            height="60"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/offer-products/edit/${product._id}`}>
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
                            <td colSpan="7" className="text-center">
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

export default ListOfferProducts
