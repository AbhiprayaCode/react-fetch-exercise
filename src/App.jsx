import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import GoogleTranslate from './pages/GoogleTranslate'
import BookList from './pages/BookList'
import BookDetail from './pages/BookDetail'
import { Tabs } from 'antd'
import './App.css'
import VirusTotal from './pages/VirusTotal'

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveKey = () => {
    if (location.pathname === '/' || location.pathname === '/home') return 'Home';
    if (location.pathname === ('/posts')) return 'Posts';
    if (location.pathname === '/translate') return 'Translate';
    if (location.pathname === '/scanner') return 'Scanner';
    if (location.pathname === '/books') return 'Books';
    return 'Home';
  };

  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false)
  }, 500)

  const onChange = (key) => {
    if (key === 'Home') navigate('/');
    if (key === 'Posts') navigate('/posts');
    if (key === 'Translate') navigate('/translate');
    if (key === 'Scanner') navigate('/scanner');
    if (key === 'Books') navigate('/books');
  }

  const items = [
    { key: 'Home', label: 'Home' },
    { key: 'Posts', label: 'Posts' },
    { key: 'Translate', label: 'Translate' },
    { key: 'Scanner', label: 'VirusTotal Scanner' },
    { key: 'Books', label: 'Books' }
  ];

  return (
    <>
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      <Tabs
        activeKey={getActiveKey()}
        items={items}
        onChange={onChange}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path='/translate' element={<GoogleTranslate />} /> 
        <Route path='/scanner' element={<VirusTotal />} />
        <Route path='/books' element={<BookList />} />
        <Route path='/books/:bookId' element={<BookDetail />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
