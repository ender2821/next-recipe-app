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
    detail,
    ingredient->{
      name,
      image,
      section
    }
  },
  instructions,
  favorite
}`;

export default function OneRecipe({ data }) {
  
  const [favorite, setFavorite] = useState(data?.recipe?.favorite);
  const [groceryList, setGroceryList] = useState();

  const router = useRouter();

  if( router.isFallback ) {
    return <div>...Loading</div>;
  }

  const { recipe } = data;

  const handleFavorite = async() => {
    if ( favorite ) {
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

  const addToGroceryList = async() => {
    if(!groceryList) {
      setGroceryList(true);
      await fetch('/api/add-to-grocery-list', {
        method: 'post',
        body: JSON.stringify({ _id: '05300c41-3a2d-4309-94ed-9d2ef7ec0502', ingredient: recipe.ingredient}),
      }).catch((error) => console.log(error))
    }
  }

  console.log(data)

  return (
    <article className={styles.recipe}>
      <div className={styles.title}>
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
      </div>
      <div className={styles.page}>
        <div className={styles.mainImageContain}>
          <img src={urlFor(recipe?.mainImage).url()} alt={recipe?.name}/>
        </div>
        <div className={styles.ingredientContain}>
          {groceryList 
            ? <button disabled>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                <span>Added to groceries</span>
              </button> 
            : <button onClick={addToGroceryList}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                <span>Add to groceries</span>
              </button>
          }
          <ul>
            {recipe.ingredient?.map((ingredient) => (
              <li key={ingredient._key} className={styles.ingredient}>
                <div className={styles.imageContain} >
                  <img src={urlFor(ingredient?.ingredient?.image).url()} alt={ingredient?.ingredient?.name}/>
                </div>
                <div className={styles.contentContain}>
                  <p>{ingredient?.wholeNumber} {ingredient?.fraction} {ingredient?.unit} {ingredient?.ingredient?.name} {ingredient?.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.directionsContain}>
        <div className={styles.textContain}>
          <PortableText value={recipe?.instructions}/>
        </div>
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

