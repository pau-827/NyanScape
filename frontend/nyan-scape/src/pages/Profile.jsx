import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getPosts, deletePost } from '../lib/api'

function Profile({ session }) {
  const [profile, setProfile] = useState(null)
  const [myPosts, setMyPosts] = useState([])

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(data)
    }

    const fetchMyPosts = async () => {
      const res = await getPosts()
      setMyPosts(res.data.filter(p => p.user_id === session.user.id))
    }

    fetchProfile()
    fetchMyPosts()
  }, [session])

  const handleDelete = async (postId) => {
    await deletePost(postId)
    setMyPosts(prev => prev.filter(p => p.id !== postId))
  }

  return (
    <div className="profile-container">
      {profile && (
        <div className="profile-header">
          <h2>🐱 {profile.username}</h2>
          <p>{profile.bio || 'No bio yet.'}</p>
          <p className="post-count">{myPosts.length} posts</p>
        </div>
      )}
      <div className="posts-grid">
        {myPosts.map(post => (
          <div key={post.id} className="post-card">
            <img src={post.image_url} alt={post.caption} />
            <p>{post.caption}</p>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile