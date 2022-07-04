import type { GetServerSideProps, NextPage } from 'next'
import { sanityclient, urlFor } from '../sanity'
import Head from 'next/head'
import Image from 'next/image'
import { Collection } from '../typing'
import Link from 'next/link'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className=" mx-auto min-h-screen py-20 px-10 2xl:px-0 max-w-7xl flex-col ">
      <Head>
        <title> NFT Drop</title>; ,
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <h3 className="font-extralight text-3xl lg:text-2xl mt-5 mb-5">
        The{' '}
        <span className="font-extrabold underline decoration-pink-500/60">
          ETHToken
        </span>{' '}
        NFT market place{' '}
      </h3>
      <main className="bg-slate-100 shadow-xl shadow-red-400/20 p-10">
        <div className=" grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collectio) => (
            <Link href={`/nft/${collectio.slug.current}`}>
              <div className="flex cursor-pointer flex-col items-center mt-16 translate-all duration-200 hover:scale-105 ">
                <img
                  className="h-96 w-60 rounded-2xl object-cover"
                  src={urlFor(collectio.mainImage).url()}
                  alt=""
                />
                <div className="p-5">
                  <h1 className="text-3xl">{collectio.title}</h1>
                  <p className="mt-2 text-sm text-gray-400">
                    {collectio.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type=="collection"]{
    _id,
    title,
    address,
    description,
    nftcollectipn,
    mainImage{
    asset
  },
  previewImage{
    asset
  },
  slug{
    current
  },
  creator->{
    _id,
    bio,
    address,
    slug{
    current
  }
}
  }`

  const collections = await sanityclient.fetch(query)

  return {
    props: {
      collections,
    },
  }
}
