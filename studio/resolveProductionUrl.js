const previewSecret = 'j8heapkqy4rdz6kudrvsc7ywpvfhrv022abyx5zgmuwpc1xv'

// Replace `remoteUrl` with your deployed Next.js site
const remoteUrl = `https://next-recipe-app-lz31r7nlc-ender2821.vercel.app/`
const localUrl = `http://localhost:3001`

export default function resolveProductionUrl(doc) {
  const baseUrl = window.location.hostname === 'localhost' ? localUrl : remoteUrl

  const previewUrl = new URL(baseUrl)


  previewUrl.pathname = `/api/preview`
  previewUrl.searchParams.append(`secret`, previewSecret)
  previewUrl.searchParams.append(`slug`, `${doc?.slug?.current}` ?? `/`)

  return previewUrl.toString()
}