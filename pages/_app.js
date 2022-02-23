import Link from "next/link";

import styles from './_app.module.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>  
      <nav className={styles.header}>
        <Link href="/">
          <a>Recipes &amp; Groceries</a>
        </Link>
      </nav>
      <main className={styles.wrap}>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default MyApp
