import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { revalidatePath } from 'next/cache'
import { Category } from '@/payload-types'

const revalidateCategory: CollectionAfterChangeHook<Category> = async ({
  doc,
  req: { payload },
}) => {
  if (doc.parent) {
    const parentId = typeof doc.parent === 'object' ? doc.parent.id : doc.parent

    const parent = await payload.findByID({
      collection: 'categories',
      id: parentId,
    })

    revalidatePath(`/categories/${parent.slug}`)
    console.log('revalidatePath: ' + '/categories/' + parent.slug)
  }
  if (!doc.parent) revalidatePath('/categories')

  return doc
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Категория',
    plural: 'Категории',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      label: 'Название',
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      label: 'Изображение',
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      label: 'Родительская категория',
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: id,
          },
        }
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateCategory],
  },
}
