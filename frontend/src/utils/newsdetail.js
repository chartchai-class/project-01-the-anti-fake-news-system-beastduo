// Utility to load newsdetail.json in the browser
export async function fetchNewsDetailById(newsId) {
  const res = await fetch('/src/mock/newsdetail.json')
  const all = await res.json()
  return all.find(n => n.newsId === newsId)
}
