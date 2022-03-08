import Link from "next/link";
import { useRouter } from 'next/router';

import styles from './_app.module.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>  
      <nav className={styles.header}>
        <div className={styles.headerWrap}>
          <Link href="/">
            <a className={router.pathname == "/" ? styles.navLinkActive : styles.navLink}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
              <span>Recipes</span>
            </a>
          </Link>
          <Link href="/groceries">
            <a className={router.pathname == "/groceries" ? styles.navLinkActive : styles.navLink}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
              <span>Groceries</span>
            </a>
          </Link>
        </div>
      </nav>
      <main className={styles.wrap}>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default MyApp
