import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import { Media } from '@/payload-types'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const payload = await getPayload({ config: configPromise })

  const { slug } = await params

  const product = await payload.find({
    collection: 'products',
    depth: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const heroImage = (product.docs[0]?.image as Media)?.url

  console.log(heroImage)

  return (
    <div className="container flex gap-10">
      {heroImage ? (
        <div className="relative w-[600px] h-[500px]">
          <Image
            src={heroImage}
            alt={product.docs[0]?.title as string}
            fill
            className="object-contain"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-10">
        <h1>{product.docs[0]?.title}</h1>
        <p className="max-w-[500px]">{product.docs[0]?.description}</p>
      </div>
    </div>
  )
}
