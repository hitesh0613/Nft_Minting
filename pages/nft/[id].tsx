import React, { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { sanityclient, urlFor } from '../../sanity'
import { Collection } from '../../typing'
import { BigNumber } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'

interface Props {
  collection: Collection
}

function heynft({ collection }: Props) {
  const [claimsupply, setclaimsupply] = useState<number>(0)
  const [price, setprice] = useState<string>()
  const [totalsupply, settotaksupply] = useState<BigNumber>()
  const nftdrop = useNFTDrop(String(collection.address))
  const [loading, setloading] = useState(true)

  // auth
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  useEffect(() => {
    if (!nftdrop) return

    const fetchprice = async () => {
      const claimConditions = await nftdrop.claimConditions.getAll()
      setprice(claimConditions?.[0].currencyMetadata.displayValue)
    }

    fetchprice()
  }, [])

  useEffect(() => {
    if (!nftdrop) return

    const fetchnftdata = async () => {
      setloading(true)

      const clamied = await nftdrop.getAllClaimed()
      const total = await nftdrop.totalSupply()

      setclaimsupply(clamied.length)
      settotaksupply(total)

      setloading(false)
    }

    fetchnftdata()
  }, [nftdrop])

  const mintnft = () => {
    if (!nftdrop || !address) return

    const quanitity = 1

    setloading(true)
    const notification = toast.loading('Minting....', {
      style: {
        background: 'white',
        color: 'green',
        fontWeight: 'bolder',
        fontSize: '17px',
        padding: '20px',
      },
    })
    nftdrop
      .claimTo(address, quanitity)
      .then(async (tx) => {
        const recipt = tx[0].receipt
        const claimedtokenid = tx[0].id
        const claimednft = await tx[0].data()

        toast('sucessfully minted !!!!', {
          duration: 8000,
          style: {
            background: 'green',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
        console.log(recipt)
        console.log(claimedtokenid)
        console.log(claimednft)
      })
      .catch((err) => {
        console.log(err)
        toast('something went wrong m!!!!', {
          duration: 8000,
          style: {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
      })
      .finally(() => {
        setloading(false)
        toast.dismiss(notification)
      })
  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10 ">
      <Toaster position="bottom-center" />
      {/* left */}
      <div className="bg-gradient-to-br from-cyan-800 to to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center py-3 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-800 p-2 rounded-xl mt-11 lg:mt-40">
            <img
              className="w-44 rounded-3xl object-cover lg:h-76 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt="img"
            />
          </div>

          <div className="py-5 text-center space-y-3 text-white">
            <h1 className="text-4xl text-white">{collection.nftcollectipn}</h1>
            <h2> {collection.description}</h2>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="lg:col-span-6 p-12 flex flex-1 flex-col">
        {/* head */}
        <header className="flex items-center justify-between py-3 px-2">
          <Link href="/">
            <h3 className="font-extralight lg:text-2xl cursor-pointer">
              The{' '}
              <span className="font-extrabold underline decoration-pink-700">
                ETHToken
              </span>{' '}
              NFT market place{' '}
            </h3>
          </Link>

          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full font-semibold bg-rose-300 text-white px-1 py-1  lg:py-2 lg:px-2 lg:text-base text-sm "
          >
            {' '}
            {address ? 'sign out' : ' sign in'}
          </button>
        </header>
        <hr className="my-2 border bg-rose-600/30 " />
        {address && (
          <p className="text-rose-300 text-center text-sm">
            you are logged in with {address.substring(0, 5)}....
            {address.substring(address.length - 5)}
          </p>
        )}
        {/* mid content */}
        <div className="mt-10 flex flex-1 flex-col  space-y-6 items-center text-center lg:justify-center lg:space-y-0">
          <img
            className=" w-80 object-cover pb-10 lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt=""
          />
          <h1 className="text-2xl font-semibold lg:text-5xl">
            {collection.title}
          </h1>

          {loading ? (
            <p className="pt-2 text-red-700 animate-pulse">
              {' '}
              {!address ? <></> : <> loading supply count......</>}{' '}
            </p>
          ) : (
            <p className="pt-2 text-green-400 mb-3">
              {' '}
              {!address ? (
                <>sign in to see remaining NFT's </>
              ) : (
                <>
                  {' '}
                  {claimsupply}/{totalsupply?.toString()} NFT clamied !!!
                </>
              )}{' '}
            </p>
          )}

          {loading && (
            <img
              className="h-32 w-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt=""
            />
          )}
        </div>

        {/* mint buttton */}
        <button
          onClick={mintnft}
          disabled={
            !address || loading || claimsupply === totalsupply?.toNumber()
          }
          className="disabled:bg-gray-400 rounded-full bg-rose-500 w-full h-10 mt-5   text-white font-light"
        >
          {loading ? (
            <>loading!!</>
          ) : claimsupply === totalsupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>sign in</>
          ) : (
            <span> Mint NFT({price} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default heynft

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type=="collection" && slug.current==$id][0]{
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

  const collection = await sanityclient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
