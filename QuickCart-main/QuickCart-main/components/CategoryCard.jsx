import React from 'react'
import Image from 'next/image'

const CategoryCard = ({ category }) => {
  // Check if category.image is a valid URL (starts with http/https or '/')
  const isValidImage =
    typeof category.image === 'string' &&
    (category.image.startsWith('http') || category.image.startsWith('/'))

  const imageSrc = isValidImage ? category.image : '/default-category.png' // fallback image in /public folder

  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer">
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-gray-200 shadow-md hover:scale-105 transition-transform duration-200">
        <Image
          src={imageSrc}
          alt={category.name || 'Category'}
          width={192}
          height={192}
          className="object-cover w-full h-full"
          // optional: prevent layout shift
          priority={false}
          unoptimized={false}
        />
      </div>
      <p className="text-sm font-medium">{category.name}</p>
    </div>
  )
}

export default CategoryCard
