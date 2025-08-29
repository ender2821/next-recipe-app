import { useNextSanityImage } from "next-sanity-image";
import { createClient } from "@sanity/client";
import Image from "next/image";

export default function SanityImage(props) {
  const configuredSanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2021-10-21",
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: true,
  });

  const imageProps = useNextSanityImage(
    configuredSanityClient,
    props.imageProps
  );

  return (
    <Image
      {...imageProps}
      style={{ objectFit: props.objectFit || "cover" }}
      alt={props.alt || ""}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
