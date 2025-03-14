import Image from 'next/image'
import Link from 'next/link'
import type { Media, Product } from '@/payload-types'

interface ProductCardProps {
  product: Product
}

function calculatePrice({ price, markup }: { price: number; markup: number }) {
  return Math.floor(price * (1 + markup / 100))
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.image

  return (
    <div className='group block overflow-hidden rounded-lg border border-gray-200 dark:bg-gray-800 bg-gray-200  shadow-sm transition-all hover:shadow-md'>
      <Link
        href={`/products/${product.slug}`}
        className=""
      >
        <div className="relative h-[250px] w-full overflow-hidden">
          {firstImage ? (
            <Image
              src={`${(firstImage as Media).url}`}
              alt={product.title as string}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="">{product.article}</div>
        <h3 className="line-clamp-2 text-lg font-semibold">{product.title}</h3>
        <div className="">Цена 1: {product.price} рублей</div>
        <div className="">
          Цена 2: {product.price && calculatePrice({ price: product.price, markup: 10 })} рублей
        </div>
        <div className="">
          Цена 3: {product.price && calculatePrice({ price: product.price, markup: 20 })} рублей
        </div>
      </div>
    </div>
  )
}
