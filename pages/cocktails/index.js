import { sanityClient } from '../../lib/sanity'
import { useState, useEffect } from 'react';

import RecipeList from '../../components/RecipeList'
import RecipeListSearch from '../../components/RecipeListSearch'

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
  const placeholder = 'Search Cocktails';

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

  return (
    <div className={styles.container}>
      <h1>Lets make some cocktails</h1>
      <RecipeListSearch search={search} placeholder={placeholder} onSearchHandler={onSearchHandler} onFavoriteToggle={onFavoriteToggle} favoriteFilter={favoriteFilter} />
      <RecipeList data={search !== '' ? searchData : pageData} page={'cocktails'} />
    </div>
  )
}

// We await this function so that on build time Next.js will prerender this page using these fetched props. 
export async function getStaticProps() {
  const cocktails = await sanityClient.fetch(cocktailsQuery)
  return { props: { cocktails }, revalidate: 60, }
}
