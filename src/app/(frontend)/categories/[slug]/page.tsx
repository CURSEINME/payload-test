import { notFound } from 'next/navigation'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Pagination from '@/components/Pagination'

type TCategoriesPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const payload = await getPayload({ config: configPromise })

  const { slug } = await params

  const category = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.docs[0]?.title} | Product Catalog`,
    description: category.docs[0]?.title || `Browse products in ${category.docs[0]?.title}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'categories',
    select: {
      slug: true,
    },
  })

  const params = res.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

export default async function CategoryPage({ params, searchParams }: TCategoriesPageProps) {
  const payload = await getPayload({ config: configPromise })

  const { slug } = await params
  const { page } = await searchParams

  const currentPage = page ? Number.parseInt(page) : 1

  const category = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!category) {
    notFound()
  }

  const subcategories = await payload.find({
    collection: 'categories',
    where: {
      parent: {
        equals: category.docs[0]?.id,
      },
    },
  })

  const productsData = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 8,
    page: currentPage,
    pagination: true,
    where: {
      categories: {
        equals: category.docs[0]?.id,
      },
    },
  })

  const { docs: products, totalPages } = productsData

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">{category.docs[0]?.title}</h1>

      {subcategories.docs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Категории</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subcategories.docs.map((subcategory) => (
              <CategoryCard key={subcategory.id} category={subcategory} />
            ))}
          </div>
        </div>
      )}

      {products.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Продукты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No products found in this category.</p>
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        basePath={`/categories/${slug}`}
      />
    </main>
  )
}
