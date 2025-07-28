import React from 'react'
import Image from 'next/image'

const CategoryCard = ({ category }) => {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer">
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-gray-200 shadow-md hover:scale-105 transition-transform duration-200">
        <Image
          src={category.image}
          alt={category.name}
          width={192}
          height={192}
          className="object-cover w-full h-full"
        />
      </div>
      <p className="text-sm font-medium">{category.name}</p>
    </div>
  )
}

export default CategoryCard
