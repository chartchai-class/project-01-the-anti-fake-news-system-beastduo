// Load details from bundled JSON to work in both dev and production builds
import newsDetailSeed from '../mock/newsdetail.json'

export async function fetchNewsDetailById(newsId) {
  // Keep async signature for compatibility
  const detail = newsDetailSeed.find((n) => n.newsId === newsId) || null
  return detail
}
