
import { useNextSanityImage } from 'next-sanity-image';
import sanityClient from '@sanity/client';
import Img from 'next/image';



  export default function SanityImage (props) {

    const configuredSanityClient = sanityClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: "2021-10-21",
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: true
    });

    const imageProps = useNextSanityImage(
      configuredSanityClient,
      props.imageProps
    );

    return (
      <Img {...imageProps} layout={props.layout} objectfit={props.objectFit} alt={props.alt}></Img>
    )
  }