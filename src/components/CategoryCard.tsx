import Image from 'next/image'
import Link from 'next/link'
import type { Category, Media } from '@/payload-types'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-slate-300 shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative h-[150px] w-full overflow-hidden">
        {category.image ? (
          <Image
            src={`${(category.image as Media).url}`}
            alt={category.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className=" text-lg font-semibold text-black">{category.title}</h3>
      </div>
    </Link>
  )
}
