import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from './index.module.css'
import { sanityClient, urlFor } from '../../lib/sanity'

const groceriesQuery = `*[_type == "groceries"] {
  _id,
  name,
  slug,
  location,
  ingredient[]{
    _key,
    unit,
    wholeNumber,
    fraction,
    ingredient{
      name,
      image,
      section
    }
  },
}`;


export default function GroceryList({ groceries }) {
  const data = { groceries } 
  const router = useRouter();
  
  const initialData = data.groceries[0].ingredient;
  const sortKey = data.groceries[0].location
  const sortedData = initialData.sort(function(x, y){
    const section1 = x.ingredient.section;
    const section2 = y.ingredient.section;

    const idx1 = sortKey.findIndex((x)=> x === section1);
    const idx2 = sortKey.findIndex((x)=> x === section2);


    if (idx1<idx2){
      return -1;
    } 
    if (idx1 > idx2){
      return 1;
    }

    if (x.ingredient.name < y.ingredient.name){
      return -1;
    }
    if (x.ingredient.name > y.ingredient.name){
      return 1;
    }
    return 0;

  });

  const handleDelete = async(event) => {
      const ingredientId = event.target.value;

      const res = await fetch('/api/delete-ingredient', {
        method: 'post',
        body: JSON.stringify({ _id: data.groceries[0]._id, ingredient: ingredientId}),
      }).then(() => {
        router.replace(router.asPath);
        const deleteStatus = res.json();
      }).catch((error) => console.log(error));
  };

  const ingredientKeys = data?.groceries[0].ingredient.map((item) => `_key=="${item._key}"`);

  const handleFullListDelete = async(event) => {
    const res = await fetch('/api/delete-all-ingredients', {
      method: 'post',
      body: JSON.stringify({ _id: data.groceries[0]._id, ingredientKeys: ingredientKeys}),
    }).then(() => {
      router.replace(router.asPath);
      const deleteStatus = res.json();
    }).catch((error) => console.log(error));
  }

  if( router.isFallback ) {
    return <div>...Loading</div>;
  }

  return (
    <>
      <div className={styles.headerContain}>
        <h1>{data?.groceries[0].ingredient.length <= 0 ? 'Add some recipes' : data?.groceries[0].name}</h1>
        {data?.groceries[0].ingredient.length > 0 && (
        <button onClick={handleFullListDelete} className={styles.deleteAll}>
          <div className={styles.delete}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" fill="currentColor">
              <path d="M945.7,989.4L10,53.8L54.3,9.4L990,945.1L945.7,989.4z"/><path d="M10,946.2L945.7,10.6L990,54.9L54.3,990.6L10,946.2L10,946.2z"/>
            </svg>   
            </div> 
          Delete all          
        </button>
        )
      }
      </div>
      <ul className={styles.list}>
        {data && sortedData.map((ingredient) => (
          <li key={ingredient._key} className={styles.ingredient}>
            <div className={styles.imageContain} >
              <img src={urlFor(ingredient?.ingredient?.image).url()} alt={ingredient?.ingredient?.name}/>
            </div>
            <div className={styles.contentContain}>
              <div className={styles.titleContain}>
                {ingredient?.wholeNumber}
                {' '}
                {ingredient?.fraction}
                {' '}
                {ingredient?.unit}
                {' '}
                {ingredient?.ingredient?.name} 
              </div>
            </div>
            <div className={styles.buttonContain}>
              <button value={ingredient?._key} onClick={handleDelete} className={styles.delete}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" fill="currentColor">
                  <path d="M945.7,989.4L10,53.8L54.3,9.4L990,945.1L945.7,989.4z"/><path d="M10,946.2L945.7,10.6L990,54.9L54.3,990.6L10,946.2L10,946.2z"/>
                </svg>              
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

// export async function getStaticProps() {
//   const groceries = await sanityClient.fetch(groceriesQuery)
//   return { props: { groceries } }
// }

export const getServerSideProps = async() => {
  const groceries = await sanityClient.fetch(groceriesQuery)
  return {
    props: { groceries }
  }
}