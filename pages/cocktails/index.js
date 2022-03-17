import Head from 'next/head'
import Link from 'next/link'
import { sanityClient, urlFor } from '../../lib/sanity'
import { useState, useEffect } from 'react';

import styles from './index.module.css'

const cocktailsQuery = `*[_type == "cocktail"] | order(_createdAt desc){
  _createdAt,
  _id,
  name,
  slug,
  mainImage,
  favorite
}`;

export default function Home({ cocktails }) {

  const [ favoriteFilter, setFavoriteFilter ] = useState();
  const [ search, setSearch] = useState('');
  const [ searchData, setSearchData ] = useState([]);
  const [ pageData, setPageData ] = useState([]);

  const onSearchHandler = event => {
    setSearch(event.target.value);
  }

  const onFavoriteToggle = () => {
    if ( favoriteFilter ) {
      setFavoriteFilter(false) 
    } else {
      setFavoriteFilter(true) 
    }
  }

  useEffect(() => {
    if ( favoriteFilter ) {
      const filteredFavorites = cocktails.filter((cocktail) => {
        return cocktail.favorite === true;
      });
      setPageData(filteredFavorites)

    } else {
      setPageData(cocktails)
    }
  }, [cocktails, favoriteFilter])

  useEffect(() => {
    if(search !== '') {
      const newSearchData = pageData.filter((cocktail) => {
        return Object.values(cocktail.name).join('').toLowerCase().includes(search.toLowerCase())
      });
      setSearchData(newSearchData);
    } else {
      setSearchData(pageData);
    }
  }, [search, pageData])

  const cocktailList = (data) => {
    return (
      <>
        {data?.length > 0 && data.map((recipe, i) => (
          <li key={recipe._id} className={styles.recipeCard}>
            <Link href={`/cocktails/${recipe.slug.current}`}>
              <a>
                <div className={styles.imageContain}>
                  {recipe.favorite && <div className={styles.favorite}>
                    <svg width="15px" height="15px" viewBox="0 0 15 15" fill="#FF725C" >
                      <path d="M13.91,6.75c-1.17,2.25-4.3,5.31-6.07,6.94c-0.1903,0.1718-0.4797,0.1718-0.67,0C5.39,12.06,2.26,9,1.09,6.75
                      C-1.48,1.8,5-1.5,7.5,3.45C10-1.5,16.48,1.8,13.91,6.75z"/>
                    </svg>
                  </div>}
                  <img src={urlFor(recipe.mainImage).url()} alt={recipe.name}/>
                </div>
                <span>{recipe.name}</span>
              </a>
            </Link>
          </li>
        ))}
      </>
    )
  }

  return (
    <div className={styles.container}>

      <h1>Lets make some cocktails</h1>
      <div className={styles.searchBar}>
        <input value={search} onChange={onSearchHandler} placeholder='Search Cocktails' className={styles.search}></input>
        <button onClick={onFavoriteToggle} aria-label="sort by favorites" className={favoriteFilter ? styles.favoriteButtonActive : styles.favoriteButton}>
          <svg width="15px" height="15px" viewBox="0 0 15 15" fill="currentColor" >
            <path d="M13.91,6.75c-1.17,2.25-4.3,5.31-6.07,6.94c-0.1903,0.1718-0.4797,0.1718-0.67,0C5.39,12.06,2.26,9,1.09,6.75
            C-1.48,1.8,5-1.5,7.5,3.45C10-1.5,16.48,1.8,13.91,6.75z"/>
          </svg>        
        </button>
      </div>
      <ul className={styles.recipesList}>
      {search !== '' ? cocktailList(searchData) : cocktailList(pageData)}
      </ul>
    </div>
  )
}

// We await this function so that on build time Next.js will prerender this page using these fetched props. 
export async function getStaticProps() {
  const cocktails = await sanityClient.fetch(cocktailsQuery)
  return { props: { cocktails } }
}
