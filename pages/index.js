import Head from 'next/head'
import Link from 'next/link'
import sanityClient from '@sanity/client';

import SanityImage from '../components/SanityImage'

import styles from './index.module.css'

const recipesQuery = `*[_type == "recipe"]{
  _id,
  name,
  slug,
  mainImage
}`;

export default function Home({ recipes }) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Recipes &amp; Groceries</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Lets cook some recipes</h1>

      <ul className={styles.recipesList}>
        {recipes?.length > 0 && recipes.map((recipe, i) => (
          <li key={recipe._id} className={styles.recipeCard}>
            <Link href={`/recipes/${recipe.slug.current}`}>
              <a>
                <div className={styles.imageContain}>
                  <SanityImage imageProps={recipe.mainImage} layout="fill" objectFit="cover" alt={recipe.name}/>
                </div>
                <span>{recipe.name}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const configuredSanityClient = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true
});

// We await this function so that on build time Next.js will prerender this page using these fetched props. 
// export async function getStaticProps() {
//   const recipes = await sanityClient.fetch(recipesQuery)
//   return { props: { recipes } }
// }

export const getServerSideProps = async function () {
  const recipes = await configuredSanityClient.fetch(recipesQuery)
  return { props: { recipes } }
}