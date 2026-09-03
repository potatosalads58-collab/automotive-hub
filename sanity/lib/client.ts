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
  year?: number
  price?: number
  mileage?: number
  specs?: string
  engine?: string
  hp?: number
  nm?: number
  acceleration?: string
  topSpeed?: number
  transmission?: string
  drivetrain?: string
  bodyType?: string
  exteriorColor?: string
  interiorColor?: string
  limitedTo?: string
  ppf?: string
  description?: string
  isAvailable?: boolean
  thumbnail?: any
  gallery?: any[]
}