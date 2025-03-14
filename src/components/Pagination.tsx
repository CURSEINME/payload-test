import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  // Если всего 1 страница, не показываем пагинацию
  if (totalPages <= 1) return null

  // Функция для создания URL с параметром страницы
  const createPageUrl = (page: number) => {
    // Проверяем, содержит ли basePath уже параметры запроса
    const hasQueryParams = basePath.includes("?")
    const separator = hasQueryParams ? "&" : "?"
    return `${basePath}${separator}page=${page}`
  }

  // Определяем, какие страницы показывать
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5 // Максимальное количество страниц для отображения

    if (totalPages <= maxPagesToShow) {
      // Если общее количество страниц меньше или равно максимальному, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Всегда показываем первую страницу
      pages.push(1)

      // Определяем начальную и конечную страницы для отображения
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Если мы близко к началу, показываем больше страниц в конце
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4)
      }

      // Если мы близко к концу, показываем больше страниц в начале
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }

      // Добавляем многоточие после первой страницы, если нужно
      if (startPage > 2) {
        pages.push("...")
      }

      // Добавляем промежуточные страницы
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Добавляем многоточие перед последней страницей, если нужно
      if (endPage < totalPages - 1) {
        pages.push("...")
      }

      // Всегда показываем последнюю страницу
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex justify-center mt-8" aria-label="Pagination">
      <ul className="flex items-center space-x-2">
        {/* Кнопка "Предыдущая" */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-100"
              aria-label="Предыдущая страница"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 text-gray-300 cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" />
            </span>
          )}
        </li>

        {/* Номера страниц */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="flex items-center justify-center w-10 h-10">...</span>
            ) : (
              <Link
                href={createPageUrl(page as number)}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  currentPage === page ? "bg-primary text-white dark:text-black" : "border border-gray-300 hover:bg-gray-100"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* Кнопка "Следующая" */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-100"
              aria-label="Следующая страница"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 text-gray-300 cursor-not-allowed">
              <ChevronRight className="w-5 h-5" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}