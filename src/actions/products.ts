'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { queryDatabase } from '@/utilities/db'

type Result = {
  success: boolean
  message: string
  updatedCount: number
}

export async function updateProductPrices() {
  try {
    const payload = await getPayload({ config: configPromise })

    let updatedCount = 0

    //get products

    const productsData = await payload.find({
      collection: 'products',
      limit: 40,
      depth: 1,
    })

    const { docs: products } = productsData

    for (const product of products) {
      if (product.article) {
        const getId = await queryDatabase({
          query: 'SELECT id FROM info WHERE BINARY value = ?',
          values: [product.article],
        })

        if (getId[0]?.id) {
          const id = getId[0]?.id

          const productPrice = await queryDatabase({
            query: 'SELECT value FROM info WHERE id = ? AND `key` = ?',
            values: [id, 'price'],
          })

          if (product.price !== Number(productPrice[0]?.value)) {
            console.log(
              'article ',
              product.article,
              'currentPrice: ',
              product.price,
              'dbPrice: ',
              productPrice[0]?.value,
            )

            await payload.update({
              collection: 'products',
              where: {
                article: {
                  equals: product.article,
                },
              },
              data: {
                price: Number(productPrice[0]?.value),
              },
            })

            updatedCount++
          }
        }
      }
    }

    return { success: true, message: 'Prices updated', updatedCount }
  } catch (err) {
    return { success: false, message: 'Prices not updated', updatedCount: 0 }
  }
}
