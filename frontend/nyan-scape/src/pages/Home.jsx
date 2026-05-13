import { useState, useEffect } from 'react'
import { getPosts } from '../lib/api'
import PostCard from '../components/PostCard'
import UploadForm from '../components/UploadForm'

function Home({ session }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const res = await getPosts()
      setPosts(res.data)
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="home-container">
      <UploadForm session={session} onUpload={fetchPosts} />
      {loading ? (
        <p className="loading">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="empty">No posts yet! Be the first to share a cat ^-^</p>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              session={session}
              onDelete={fetchPosts}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home