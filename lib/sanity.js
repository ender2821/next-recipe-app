import { createClient } from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url'
import sanityClient from '@sanity/client';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "purfkp0z",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2021-10-21",
  useCdn: true,
};

export const configuredSanityClient = sanityClient(config);

export const sanityClientOld = createClient(config);

export const urlFor = ( source ) => createImageUrlBuilder(config).image(source);
