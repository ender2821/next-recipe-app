import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url'

const config = {
  projectId: "purfkp0z",
  dataset: "production",
  apiVersion: "2021-10-21",
  useCdn: false,
};

export const sanityClient = createClient(config);

export const urlFor = ( source ) => imageUrlBuilder(config).image(source);