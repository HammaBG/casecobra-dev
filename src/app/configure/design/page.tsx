import { db } from '@/db'
import { notFound } from 'next/navigation'
//import DesignConfigurator from './DesignConfigurator'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams

return <p>{id}</p>
}

export default Page