// Helper to infer isFake for comments missing it, using votes
function inferIsFakeForComments(comments, votes) {
  if (!Array.isArray(comments) || !Array.isArray(votes)) return comments
  return comments.map(comment => {
    if (typeof comment.isFake === 'boolean') return comment
    // Try to find a vote with close createdAt (within 2 seconds)
    const commentTime = new Date(comment.createdAt).getTime()
    const match = votes.find(v => {
      if (!v.createdAt) return false
      const voteTime = new Date(v.createdAt).getTime()
      return Math.abs(voteTime - commentTime) < 2000
    })
    if (match && typeof match.isFake === 'boolean') {
      return { ...comment, isFake: match.isFake }
    }
    return comment
  })
}
import { defineStore } from 'pinia'

import newsSeed from '../mock/news.json'
import commentsSeed from '../mock/comments.json'
import votesSeed from '../mock/votes.json'

const LS_VOTES_KEY = 'afn.v1.votes'
const LS_COMMENTS_KEY = 'afn.v1.comments'

function groupByNewsId(items) {
  const grouped = {}
  for (const item of items) {
    const key = item.newsId
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(item)
  }
  return grouped
}

function generateId(prefix) {
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now()}_${random}`
}

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [],
    votesByNewsId: {},
    commentsByNewsId: {},
    listFilter: 'all', // 'all' | 'fake' | 'nonfake'
    listPage: 1,
    listPageSize: 10,
    detailCommentsPageByNews: {},
    detailCommentsPageSize: 5,
    hydrated: false,
    // Remove isLoading state since we're not using it
  }),

  getters: {
    voteCountsByNewsId(state) {
      return (newsId) => {
        const votes = state.votesByNewsId[newsId] || []
        let fakeCount = 0
        let nonFakeCount = 0
        for (const v of votes) {
          if (v.isFake) fakeCount++
          else nonFakeCount++
        }
        return { fakeCount, nonFakeCount }
      }
    },

    computedStatusByNewsId(state) {
      return (newsId) => {
        const newsItem = state.news.find(n => n.id === newsId)
        const counts = this.voteCountsByNewsId(newsId)
        const total = counts.fakeCount + counts.nonFakeCount
        if (total === 0 || counts.fakeCount === counts.nonFakeCount) {
          return newsItem ? !!newsItem.isFake : false
        }
        return counts.fakeCount > counts.nonFakeCount
      }
    },

    filteredNews(state) {
      if (state.listFilter === 'all') return state.news
      return state.news.filter(n => {
        const isFakeNow = this.computedStatusByNewsId(n.id)
        return state.listFilter === 'fake' ? isFakeNow : !isFakeNow
      })
    },

    pagedNews(state) {
      const start = (state.listPage - 1) * state.listPageSize
      const end = start + state.listPageSize
      return this.filteredNews.slice(start, end)
    },
  },

  actions: {
    loadSeeds() {
      // Seeds are local JSON imports; synchronous assignment
      this.news = newsSeed.slice().sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
      this.votesByNewsId = groupByNewsId(votesSeed)
      this.commentsByNewsId = groupByNewsId(commentsSeed)
      // Initialize per-news comments page
      for (const n of this.news) {
        if (!this.detailCommentsPageByNews[n.id]) this.detailCommentsPageByNews[n.id] = 1
      }
    },

    hydrateFromLocalStorage() {
      try {
        const storedVotesRaw = localStorage.getItem(LS_VOTES_KEY)
        const storedCommentsRaw = localStorage.getItem(LS_COMMENTS_KEY)
        const storedVotes = storedVotesRaw ? JSON.parse(storedVotesRaw) : []
        const storedComments = storedCommentsRaw ? JSON.parse(storedCommentsRaw) : []

        if (Array.isArray(storedVotes) && storedVotes.length) {
          const mergedVotes = {}
          // start with seed
          for (const [newsId, list] of Object.entries(this.votesByNewsId)) {
            mergedVotes[newsId] = list.slice()
          }
          // append session votes
          for (const v of storedVotes) {
            const key = v.newsId
            if (!mergedVotes[key]) mergedVotes[key] = []
            mergedVotes[key].push(v)
          }
          this.votesByNewsId = mergedVotes
        }

        if (Array.isArray(storedComments) && storedComments.length) {
          const mergedComments = {}
          for (const [newsId, list] of Object.entries(this.commentsByNewsId)) {
            mergedComments[newsId] = list.slice()
          }
          for (const c of storedComments) {
            const key = c.newsId
            if (!mergedComments[key]) mergedComments[key] = []
            mergedComments[key].push(c)
          }
          this.commentsByNewsId = mergedComments
        }
      } catch (e) {
        // If localStorage parsing fails, ignore and continue with seeds
        console.error('Failed to hydrate from localStorage', e)
      } finally {
        this.hydrated = true
      }
    },

    persistToLocalStorage(newVotes = [], newComments = []) {
      try {
        // Votes
        const existingVotesRaw = localStorage.getItem(LS_VOTES_KEY)
        const existingVotes = existingVotesRaw ? JSON.parse(existingVotesRaw) : []
        localStorage.setItem(LS_VOTES_KEY, JSON.stringify([...existingVotes, ...newVotes]))

        // Comments
        const existingCommentsRaw = localStorage.getItem(LS_COMMENTS_KEY)
        const existingComments = existingCommentsRaw ? JSON.parse(existingCommentsRaw) : []
        localStorage.setItem(LS_COMMENTS_KEY, JSON.stringify([...existingComments, ...newComments]))
      } catch (e) {
        console.error('Failed to persist to localStorage', e)
      }
    },

    setFilter(filter) {
      if (!['all', 'fake', 'nonfake'].includes(filter)) return
      this.listFilter = filter
      this.listPage = 1
    },

    setPage(page) {
      this.listPage = Math.max(1, page)
    },

    setPageSize(size) {
      this.listPageSize = size
      this.listPage = 1
    },

    setDetailCommentsPage(newsId, page) {
      this.detailCommentsPageByNews[newsId] = Math.max(1, page)
    },

    getCommentsPage(newsId, page) {
      const list = this.commentsByNewsId[newsId] || []
      const votes = this.votesByNewsId[newsId] || []
      // Patch comments missing isFake using votes
      const patched = inferIsFakeForComments(list, votes)
      const currentPage = page ?? this.detailCommentsPageByNews[newsId] ?? 1
      const start = (currentPage - 1) * this.detailCommentsPageSize
      const end = start + this.detailCommentsPageSize
      return patched.slice(start, end)
    },

    addVoteAndOptionalComment({ newsId, isFake, text, imageUrl }) {
      // Create vote
      const newVote = {
        id: generateId('v'),
        newsId,
        isFake: !!isFake,
        createdAt: new Date().toISOString(),
      }
      if (!this.votesByNewsId[newsId]) this.votesByNewsId[newsId] = []
      this.votesByNewsId[newsId].push(newVote)

        const newComments = []
        if (text && text.trim().length > 0) {
          const newComment = {
            id: generateId('c'),
            newsId,
            text: text.trim(),
            imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : undefined,
            createdAt: new Date().toISOString(),
            isFake: !!isFake,
          }
          if (!this.commentsByNewsId[newsId]) this.commentsByNewsId[newsId] = []
          this.commentsByNewsId[newsId].push(newComment)
          newComments.push(newComment)
      }

      // Persist only newly created items
      this.persistToLocalStorage([newVote], newComments)
    },
  },
})


