import { getPayload } from 'payload'
import configPromise from '@payload-config'
import CategoryCard from '@/components/CategoryCard'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    depth: 2,
    limit: 12,
    overrideAccess: false,
    where: {
      parent: {
        equals: null,
      },
    },
  })

  return (
    <div className="container grid grid-cols-4 gap-8">
      {categories.docs.map((category) => {
        return <CategoryCard key={category.id} category={category} />
      })}
    </div>
  )
}
