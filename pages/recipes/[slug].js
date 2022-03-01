import { useState } from 'react'
import { useRouter } from 'next/router';

import {PortableText} from '@portabletext/react';
import { sanityClient, urlFor } from '../../lib/sanity';

import styles from './[slug].module.css';


const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  mainImage,
  ingredient[]{
    _key,
    unit,
    wholeNumber,
    fraction,
    ingredient->{
      name,
      image
    }
  },
  instructions,
  favorite
}`;

export default function OneRecipe({ data, preview }) {
  
  const [favorite, setFavorite] = useState(data?.recipe?.favorite);

  const router = useRouter();

  if( router.isFallback ) {
    return <div>...Loading</div>;
  }

  // TODO: Get Preview mode working, curently errors out. 
  // const { data: recipe } = usePreviewSubscription(recipeQuery, {
  //   params: { slug: data.recipe?.slug.current },
  //   initialData: data,
  //   enabled: preview
  // });

  const { recipe } = data;

  const handleFavorite = async() => {
    if ( favorite ) {
      console.log('click!')
      const res = await fetch('/api/remove-favorite', {
        method: 'post',
        body: JSON.stringify({ _id: recipe._id}),
      }).catch((error) => console.log(error))

      const data = await res.json();

      setFavorite(data.favorite)
    } else {
      const res = await fetch('/api/add-favorite', {
        method: 'post',
        body: JSON.stringify({ _id: recipe._id}),
      }).catch((error) => console.log(error))

      const data = await res.json();

      setFavorite(data.favorite)
    }
  };

  return (
    <article className={styles.recipe}>
      <h1>{recipe?.name}</h1>

      <button 
        className={favorite ? styles.favButtonActive : styles.favButton}
        onClick={handleFavorite}
      >
        <svg width="15px" height="15px" viewBox="0 0 15 15" fill="currentColor" >
          <path d="M13.91,6.75c-1.17,2.25-4.3,5.31-6.07,6.94c-0.1903,0.1718-0.4797,0.1718-0.67,0C5.39,12.06,2.26,9,1.09,6.75
          C-1.48,1.8,5-1.5,7.5,3.45C10-1.5,16.48,1.8,13.91,6.75z"/>
        </svg>
      </button>
      <div className={styles.page}>
        <div className={styles.mainImageContain}>
          <img src={urlFor(recipe?.mainImage).url()} alt={recipe?.name}/>
        </div>
        <ul>
          {recipe.ingredient?.map((ingredient) => (
            <li key={ingredient._key} className={styles.ingredient}>
              <div className={styles.imageContain} >
                <img src={urlFor(ingredient?.ingredient?.image).url()} alt={ingredient?.ingredient?.name}/>
              </div>
              <div className={styles.contentContain}>
                {ingredient?.wholeNumber}
                {ingredient?.fraction}
                {' '}
                {ingredient?.unit}
                <br/>
                {ingredient?.ingredient?.name} 
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.directionsContain}>
        <PortableText value={recipe?.instructions}/>
      </div>
    </article>
  )
}

export async function getStaticPaths() {
  const paths = await sanityClient.fetch(
    `*[_type == "recipe" && defined(slug.current)]{
      "params": {
        "slug": slug.current
      }
    }`
  );

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps ({ params }) {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug })

  if (!recipe) return { notFound: true }

  return { props: { data: { recipe }, preview: true } }
}

