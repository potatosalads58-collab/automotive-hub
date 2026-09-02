import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'car',
  title: 'Car Listing',
  type: 'document',
  fields: [
    // --- Basic Information ---
    defineField({
      name: 'title',
      title: 'Car Title / Model',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'price',
      title: 'Price (EGP)',
      type: 'number',
    }),
    defineField({
      name: 'mileage',
      title: 'Mileage (KM)',
      type: 'number',
    }),

    // --- Media ---
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    // --- Performance & Technical Specs ---
    defineField({
      name: 'specs',
      title: 'Regional Specs',
      type: 'string',
      options: {
        list: [
          { title: 'European', value: 'European' },
          { title: 'GCC', value: 'GCC' },
          { title: 'Egyptian Agency', value: 'Egyptian Agency' },
          { title: 'US', value: 'US' },
        ],
      },
    }),
    defineField({
      name: 'engine',
      title: 'Engine',
      type: 'string',
    }),
    defineField({
      name: 'hp',
      title: 'Horsepower (HP)',
      type: 'number',
    }),
    defineField({
      name: 'nm',
      title: 'Torque (NM)',
      type: 'number',
    }),
    defineField({
      name: 'acceleration',
      title: '0-100 Km/h',
      type: 'string',
    }),
    defineField({
      name: 'topSpeed',
      title: 'Top Speed (Km/h)',
      type: 'number',
    }),
    defineField({
      name: 'transmission',
      title: 'Transmission',
      type: 'string',
    }),
    defineField({
      name: 'drivetrain',
      title: 'Drivetrain',
      type: 'string',
    }),
    defineField({
      name: 'bodyType',
      title: 'Body Type',
      type: 'string',
    }),

    // --- Styling & Options ---
    defineField({
      name: 'exteriorColor',
      title: 'Exterior Colour',
      type: 'string',
    }),
    defineField({
      name: 'interiorColor',
      title: 'Interior Colour',
      type: 'string',
    }),
    defineField({
      name: 'limitedTo',
      title: 'Limited To',
      type: 'string',
    }),
    defineField({
      name: 'ppf',
      title: 'PPF Protection',
      type: 'string',
    }),

    // --- Car Details & Status ---
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'isAvailable',
      title: 'Available in Showroom',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})