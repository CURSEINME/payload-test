'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getSearchResults(query: string) {
  const payload = await getPayload({ config: configPromise })
  try {
    const results = await payload.find({
      collection: 'products',
      ...(query
        ? {
            where: {
              or: [
                {
                  title: {
                    like: query,
                  },
                },
                {
                  'meta.description': {
                    like: query,
                  },
                },
                {
                  'meta.title': {
                    like: query,
                  },
                },
                {
                  slug: {
                    like: query,
                  },
                },
              ],
            },
          }
        : {}),
    })

    return { error: null, data: results.docs }
  } catch (err) {
    return { error: 'Произошла ошибка', data: null }
  }
}
