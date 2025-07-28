'use client'
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import CategoryCard from './CategoryCard'

const CategoryList = () => {
  const [categories, setCategories] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const scroll = (direction) => {
    const container = scrollRef.current
    const scrollAmount = 200 // adjust based on card width
    if (container) {
      container.scrollLeft += direction === 'right' ? scrollAmount : -scrollAmount
    }
  }

  return (
    <div className="my-12 relative px-4">
      <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>

      {/* Scroll Arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-[60%] z-10 bg-white shadow p-2 rounded-full"
        aria-label="Scroll left"
      >
        ◀
      </button>

      {/* Scroll container */}
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ maxWidth: '100%', padding: '0 2rem' }}
        >
          {categories.map((cat) => (
            <div key={cat._id} className="min-w-[150px] flex-shrink-0">
              <Link href={`/category/${cat.slug}`}>
                
                  <CategoryCard category={cat} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-[60%] z-10 bg-white shadow p-2 rounded-full"
        aria-label="Scroll right"
      >
        ▶
      </button>
    </div>
  )
}

export default CategoryList
