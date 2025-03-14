'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, ChevronDown } from 'lucide-react'
import { useDebounce } from '@/utilities/useDebounce'
import SearchResultsDropdown from './SearchResultDropdown'
// import { useDebounce } from '@/hooks/use-debounce'
// import { useClickOutside } from '@/hooks/use-click-outside'
// import SearchResultsDropdown from './search-results-dropdown'

interface CompactSearchProps {
  placeholder?: string
  className?: string
}

export default function CompactSearch({
  placeholder = 'Поиск товаров...',
  className = '',
}: CompactSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  // // Хук для закрытия поиска при клике вне компонента
  // useClickOutside(searchRef, () => {
  //   if (isExpanded && !query) {
  //     setIsExpanded(false)
  //   }
  // })

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsExpanded(false)
      setQuery('')
    }
  }

  const handleClearQuery = () => {
    setQuery('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleOpenSearch = () => {
    setIsExpanded(true)
  }

  const handleCloseSearch = () => {
    setIsExpanded(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {!isExpanded ? (
        <button
          onClick={handleOpenSearch}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-full transition-colors"
          aria-label="Открыть поиск"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Поиск</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      ) : (
        <div className="relative w-full min-w-[250px] md:min-w-[350px]">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-full text-black border border-gray-300 py-2 pl-10 pr-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              aria-label="Поиск"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {query ? (
              <button
                type="button"
                onClick={handleClearQuery}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label="Очистить поиск"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCloseSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label="Закрыть поиск"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </form>

          {query && debouncedQuery.length >= 2 && (
            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 overflow-hidden max-h-[450px] overflow-y-auto">
              <SearchResultsDropdown query={debouncedQuery} onClose={handleCloseSearch} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
