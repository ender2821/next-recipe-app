import {createClient, createPreviewSubscriptionHook, createPortableTextComponent} from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url'

const config = {
  projectId: "purfkp0z",
  dataset: "production",
  apiVersion: "2021-10-21",
  useCdn: false,
};

export const sanityClient = createClient(config);

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

export const urlFor = ( source ) => createImageUrlBuilder(config).image(source);

// export const PortableText = createPortableTextComponent({
//   ...config,
//   serializers: {},
// });