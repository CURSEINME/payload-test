import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Category, Product } from '../../../payload-types'

export const revalidateProduct: CollectionAfterChangeHook<Product> = async ({
  doc,
  previousDoc,
  req: { payload, context},
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/products/${doc.slug}`

      payload.logger.info(`Revalidating product at path: ${path}`)

      // if multiple categories change

      if (typeof doc.categories?.[0] === 'object') {
        //revalidate updated doc categories

        doc.categories.forEach((category) => {
          payload.logger.info(
            `Revalidating category at path: /categories/${(category as Category).slug}`,
          )
          revalidatePath(`/categories/${(category as Category).slug}`)
        })
      }

      //single doc change

      if (typeof doc.categories?.[0] === 'string') {
        //get updated doc categories

        const categories = await payload.find({
          collection: 'categories',
          where: {
            id: {
              in: doc.categories,
            },
          },
        })

        //revalidate updated doc categories

        categories.docs?.forEach((category) => {
          payload.logger.info(`Revalidating category at path: /categories/${category.slug}`)
          revalidatePath(`/categories/${category.slug}`)
        })
      }

      //get previous doc categories

      const previousCategories = await payload.find({
        collection: 'categories',
        where: {
          id: {
            in: previousDoc.categories,
          },
        },
      })

      //revalidate old doc categories

      previousCategories.docs?.forEach((category) => {
        payload.logger.info(`Revalidating old category at path: /categories/${category.slug}`)
        revalidatePath(`/categories/${category.slug}`)
      })

      revalidatePath('/categories')

      revalidatePath('/products')
      revalidatePath(path)
      revalidateTag('products-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/products/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath('/products')
      revalidatePath(oldPath)
      revalidateTag('products-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Product> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/products/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('products-sitemap')
  }

  return doc
}
