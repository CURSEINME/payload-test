'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, ArrowRight } from 'lucide-react'
import type { Media, Product } from '@/payload-types'
import { getSearchResults } from '@/actions/search'

interface SearchResultsDropdownProps {
  query: string
  onClose: () => void
}

export default function SearchResultsDropdown({ query, onClose }: SearchResultsDropdownProps) {
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)

      const results = await getSearchResults(query)

      if (results.error) {
        setError(results.error)
      }
      if (results.data) {
        setResults(results.data)
      }

      setIsLoading(false)
    }

    fetchResults()
  }, [query])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (results.length === 0 && query.length >= 2) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>{`По запросу ${query} ничего не найдено`}</p>
      </div>
    )
  }

  return (
    <div className="py-2 text-black">
      {results.length > 0 && (
        <>
          <div className="px-4 py-2 text-xs font-semibold text-gray-500">Результаты поиска</div>

          <div className="space-y-2">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="flex items-center px-4 py-2 hover:bg-gray-100 gap-3" // Убрал gap-2, сделал gap-3
              >
                {/* Фиксированный размер для изображения / заглушки */}
                <div className="relative flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-300">
                  {product.image ? (
                    <Image
                      src={(product?.image as Media)?.url as string}
                      alt={product.title as string}
                      fill
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-center p-1">
                      Нет фото
                    </div>
                  )}
                </div>

                {/* Текстовый блок */}
                <div className="flex flex-col min-w-0">
                  {' '}
                  {/* min-w-0 предотвращает растягивание */}
                  <span className="text-sm font-medium">{product.article}</span>
                  <h4 className="text-sm font-medium line-clamp-1">{product?.title}</h4>
                  <p className="text-xs">{product.price?.toFixed(2)} руб</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-2 pt-2 px-4">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex items-center justify-between py-2 text-sm hover:underline"
            >
              <span>Показать все результаты</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
