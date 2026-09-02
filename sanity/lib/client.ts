import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export interface Car {
  _id: string
  title: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  specs: string
  description: string
  images: any[]
}