import React, { useState } from 'react'
import AddProduct from './AddProduct'
import ViewProducts from './ViewProducts'
import { Button } from 'react-bootstrap'

const Products = () => {
    const [products, setProducts] = useState([])
    const [view, setView] = useState('view')

    const handleSave = (product) => {
        setProducts([...products, product])
        setView('view')
    }

    const handleDelete = (index) => {
        const updated = products.filter((_, i) => i !== index)
        setProducts(updated)
    }

    const handleEdit = (index) => {
        alert('Edit feature not implemented yet')
    }

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center p-3'>
                <h3>Products</h3>
                <div>
                    <Button onClick={() => setView('view')} variant='info' className='me-2'>View Products</Button>
                    <Button onClick={() => setView('add')} variant='primary'>Add Product</Button>
                </div>
            </div>
            {view === 'add' ? (
                <AddProduct onSave={handleSave} />
            ) : (
                <ViewProducts products={products} onDelete={handleDelete} onEdit={handleEdit} />
            )}
        </div>
    )
}

export default Products;
