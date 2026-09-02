import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'p9bfsxng',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export interface Car {
  _id: string
  title: string
  make?: string
  model?: string
  year?: number
  price?: number
  mileage?: number
  specs?: string
  description?: string
  images?: any[]
}