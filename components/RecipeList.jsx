import Link from 'next/link'
import { urlFor } from '../lib/sanity'

import styles from './RecipeList.module.css'

export default function recipeList (props) {

  const { data, page } = props;

  return (
    <ul className={styles.recipesList}>
      {data?.length > 0 && data.map((recipe, i) => (
        <li key={recipe._id} className={styles.recipeCard}>
          <Link href={`/${page}/${recipe.slug.current}`}>
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
    </ul>
  )
}