import * as XLSX from 'xlsx'
import { CollectionAfterChangeHook } from 'payload'
import { File } from '@/payload-types'
import { revalidatePath } from 'next/cache'

export const importAfterChange: CollectionAfterChangeHook<File> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  try {
    const file = await payload.findByID({
      collection: 'media',
      id: doc.data as string,
    })

    if (!file) {
      console.log('File not found in Media collection.')
      return doc
    }

    const s3Endpoint = process.env.S3_ENDPOINT
    const s3Bucket = process.env.S3_BUCKET

    if (!s3Endpoint || !s3Bucket) {
      console.log('S3_ENDPOINT or S3_BUCKET environment variables are not set.')
      return doc
    }

    const fileUrl = `${s3Endpoint}/${s3Bucket}/media/${file.filename}`

    const res = await fetch(fileUrl)
    if (!res.ok) {
      return res
    }

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) {
      return doc
    }
    const worksheet = workbook.Sheets[sheetName]
    if (!worksheet) {
      return doc
    }

    type TJson = {
      title: string
      article: string
      price: number
    }
    const jsonData: TJson[] = XLSX.utils.sheet_to_json(worksheet)

    for (const item of jsonData) {
      const product = await payload.find({
        collection: 'products',
        where: {
          article: {
            equals: item.article,
          },
        },
      })

      if (product.docs[0]) {
        await payload.update({
          collection: 'products',
          id: product.docs[0].id,
          data: {
            title: item.title,
            slug: item.title,
            price: item.price,
            article: item.article,
            _status: 'published',
          },
        })
        console.log(`Product with article ${item.article} updated`)
      }

      if (!product.docs[0]) {
        await payload.create({
          collection: 'products',
          data: {
            title: item.title,
            slug: item.title,
            price: item.price,
            article: item.article,
            _status: 'published',
          },
        })
        console.log(`Product with article ${item.article} created`)
      }
    }
    return doc
  } catch (err: any) {
    console.log(err)
    return doc
  }
}
