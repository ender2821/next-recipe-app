import { useState, useEffect } from 'react';

import styles from './index.module.css'
import { sanityClient, urlFor } from '../../lib/sanity'

const groceriesQuery = `*[_type == "groceries"] {
  _id,
  name,
  slug,
  ingredient[]{
    _key,
    unit,
    wholeNumber,
    fraction,
    ingredient->{
      name,
      image
    }
  }
}`;

export default function GroceryList({ groceries }) {
  const data = { groceries } 
  console.log(data)
  return (
    <>
      <h1>{data?.groceries[0].name}</h1>
      <ul className={styles.list}>
        {data?.groceries[0].ingredient.map((ingredient) => (
          <li key={ingredient._key} className={styles.ingredient}>
            <div className={styles.imageContain} >
              <img src={urlFor(ingredient?.ingredient?.image).url()} alt={ingredient?.ingredient?.name}/>
            </div>
            <div className={styles.contentContain}>
              {ingredient?.wholeNumber}
              {' '}
              {ingredient?.fraction}
              {' '}
              {ingredient?.unit}
              {' '}
              {ingredient?.ingredient?.name} 
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps() {
  const groceries = await sanityClient.fetch(groceriesQuery)
  return { props: { groceries } }
}
