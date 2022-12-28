import styles from './RecipeListSearch.module.css'

export default function RecipeListSearch (props) {
  const { search, onSearchHandler, favoriteFilter, onFavoriteToggle, placeholder } = props

  return (
    <div className={styles.searchBar}>
    <input value={search} onChange={onSearchHandler} placeholder={placeholder} className={styles.search}></input>
    <button onClick={onFavoriteToggle} aria-label="sort by favorites" className={favoriteFilter ? styles.favoriteButtonActive : styles.favoriteButton}>
      <svg width="15px" height="15px" viewBox="0 0 15 15" fill="currentColor" >
        <path d="M13.91,6.75c-1.17,2.25-4.3,5.31-6.07,6.94c-0.1903,0.1718-0.4797,0.1718-0.67,0C5.39,12.06,2.26,9,1.09,6.75
        C-1.48,1.8,5-1.5,7.5,3.45C10-1.5,16.48,1.8,13.91,6.75z"/>
      </svg>        
    </button>
  </div>
  )
}