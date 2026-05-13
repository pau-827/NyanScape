import { useState } from 'react'
import { createPost } from '../lib/api'

function UploadForm({ session, onUpload }) {
  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!image) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('caption', caption)
      formData.append('user_id', session.user.id)
      await createPost(formData)
      setImage(null)
      setCaption('')
      setPreview(null)
      onUpload()
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-form">
      <h3>Share a cat! 🐱</h3>
      <input type="file" accept="image/*" onChange={handleImage} />
      {preview && <img src={preview} alt="preview" className="preview-image" />}
      <input
        type="text"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading || !image}>
        {loading ? 'Uploading...' : 'Post'}
      </button>
    </div>
  )
}

export default UploadForm