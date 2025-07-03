import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import GoogleTranslate from './pages/GoogleTranslate'
import BookList from './pages/BookList'
import BookDetail from './pages/BookDetail'
import AddBook from './pages/AddBook'
import EditBook from './pages/EditBook'
import AddCategory from './pages/AddCategory'
import AddComment from './pages/AddComment'
import NavBar from './components/NavBar'
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
    if (location.pathname === '/books/add') return 'Books';
    if (location.pathname === '/books/:bookId/edit') return 'Books';
    if (location.pathname === '/category') return 'Categories';
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
    if (key === 'Categories') navigate('/category');
  }

  return (
    <>
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      <NavBar activeKey={getActiveKey()} onChange={onChange} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path='/translate' element={<GoogleTranslate />} /> 
        <Route path='/scanner' element={<VirusTotal />} />
        <Route path='/books' element={<BookList />} />
        <Route path='/books/:bookId' element={<BookDetail />} />
        <Route path='/books/add' element={<AddBook />} />
        <Route path='/books/:bookId/edit' element={<EditBook />} />
        <Route path='/books/:bookId/add-comment' element={<AddComment />} />
        <Route path='/category' element={<AddCategory />} />
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
