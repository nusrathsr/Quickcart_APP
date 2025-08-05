'use client'

import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'

const MasterCategoryList = () => {
  const [masterCategories, setMasterCategories] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    const fetchMasterCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/master-categories')
        setMasterCategories(res.data)
      } catch (error) {
        console.error('Error fetching master categories:', error)
      }
    }

    fetchMasterCategories()
  }, [])

  const scroll = (direction) => {
    const container = scrollRef.current
    const scrollAmount = 150
    if (container) {
      container.scrollLeft += direction === 'right' ? scrollAmount : -scrollAmount
    }
  }

  return (
    <div className="relative px-6 py-8">
      <h2 className="text-lg font-semibold mb-4">Shop by Category</h2>

      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
        aria-label="Scroll left"
      >
        ◀
      </button>

      {/* Categories container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
      >
        {masterCategories.map((cat) => (
          <div key={cat._id} className="flex flex-col items-center min-w-[100px]">
            <Link href={`/category/${cat.slug}`} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shadow-md hover:scale-105 transition-transform">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-xs mt-2 text-center text-blue-600 hover:underline">
                {cat.name}
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
        aria-label="Scroll right"
      >
        ▶
      </button>
    </div>
  )
}

export default MasterCategoryList
