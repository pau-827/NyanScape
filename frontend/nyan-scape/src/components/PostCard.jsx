import { useState, useEffect } from 'react'
import { likePost, unlikePost, getLikes, getComments, addComment } from '../lib/api'

function PostCard({ post, session, onDelete }) {
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    getLikes(post.id).then(res => setLikes(res.data.likes))
    getComments(post.id).then(res => setComments(res.data))
  }, [post.id])

  const handleLike = async () => {
    await likePost({ user_id: session.user.id, post_id: post.id })
    setLikes(prev => prev + 1)
  }

  const handleUnlike = async () => {
    await unlikePost({ user_id: session.user.id, post_id: post.id })
    setLikes(prev => Math.max(0, prev - 1))
  }

  const handleComment = async () => {
    if (!newComment.trim()) return
    await addComment({
      user_id: session.user.id,
      post_id: post.id,
      content: newComment
    })
    const res = await getComments(post.id)
    setComments(res.data)
    setNewComment('')
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="username">🐱 {post.profiles?.username || 'Unknown'}</span>
      </div>
      <img src={post.image_url} alt={post.caption} className="post-image" />
      <div className="post-body">
        <p className="caption">{post.caption}</p>
        <div className="post-actions">
          <button onClick={handleLike}>❤️ {likes}</button>
          <button onClick={handleUnlike}>💔</button>
          <button onClick={() => setShowComments(!showComments)}>
            💬 {comments.length}
          </button>
          {session.user.id === post.user_id && (
            <button onClick={() => onDelete(post.id)}>🗑️</button>
          )}
        </div>
        {showComments && (
          <div className="comments">
            {comments.map(c => (
              <div key={c.id} className="comment">
                <strong>{c.profiles?.username}:</strong> {c.content}
              </div>
            ))}
            <div className="comment-input">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleComment}>Post</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard