import './App.css'
import {Routes, Route, useLocation} from 'react-router-dom'
import Navbar from '../src/components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Verify from './pages/Verify'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import Create from './pages/Create'
import Update from './pages/Update'
import View from './pages/View'


axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

function App() {

  const location = useLocation()

  const isHome = location.pathname === '/home'
  const isCreate = location.pathname === '/create'
  const isUpdate = location.pathname === '/update/:id'
  const isView = location.pathname === '/view'

  return (
    <>
    {(isHome || isCreate || isUpdate || isView) && <Navbar />}
    <Routes>
      <Route path='/' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/create' element={<Create />} />
      <Route path='/update/:id' element={<Update />} />
      <Route path='/verify/:id' element={<Verify />} />
      <Route path='/view' element={<View />} />
    </Routes>
    </>


  )
}

export default App
