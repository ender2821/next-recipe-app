import { useState } from 'react'
import { useRouter } from 'next/router';

import {PortableText} from '@portabletext/react';
import { sanityClient, urlFor } from '../../lib/sanity';

import styles from './[slug].module.css';


const cocktailQuery = `*[_type == "cocktail" && slug.current == $slug][0]{
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
  
  const [favorite, setFavorite] = useState(data?.cocktail?.favorite);
  const [groceryList, setGroceryList] = useState();

  const router = useRouter();

  if( router.isFallback ) {
    return <div>...Loading</div>;
  }

  const { cocktail } = data;

  const handleFavorite = async() => {
    if ( favorite ) {
      const res = await fetch('/api/remove-favorite', {
        method: 'post',
        body: JSON.stringify({ _id: cocktail._id}),
      }).catch((error) => console.log(error))

      const data = await res.json();

      setFavorite(data.favorite)
    } else {
      const res = await fetch('/api/add-favorite', {
        method: 'post',
        body: JSON.stringify({ _id: cocktail._id}),
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
        body: JSON.stringify({ _id: '05300c41-3a2d-4309-94ed-9d2ef7ec0502', ingredient: cocktail.ingredient}),
      }).catch((error) => console.log(error))
    }
  }

  return (
    <article className={styles.cocktail}>
      <div className={styles.title}>
        <h1>{cocktail?.name}</h1>
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
          <img src={urlFor(cocktail?.mainImage).url()} alt={cocktail?.name}/>
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
            {cocktail.ingredient?.map((ingredient) => (
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
          <div className={styles.textContain}>
            <PortableText value={cocktail?.instructions}/>
          </div>
        </div>
      </div>
    </article>
  )
}

export async function getStaticPaths() {
  const paths = await sanityClient.fetch(
    `*[_type == "cocktail" && defined(slug.current)]{
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
  const cocktail = await sanityClient.fetch(cocktailQuery, { slug })

  if (!cocktail) return { notFound: true }

  return { props: { data: { cocktail }, preview: true } }
}

