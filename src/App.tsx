import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop/Shop'
import Admin from './pages/Admin/Admin'
import { Navbar } from './layout/Navbar'
import { useAppSelector } from './store/store'
import { useMeQuery } from './store/api/apiSlice'
import UserLevelSwitch from './pages/UserLevelSwitch'
import { Toaster } from './components/ui/toaster'
import Profile from './pages/Profile/Profile'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Footer from './layout/Footer'
import Cart from './pages/Cart/Cart'
// import { productSchema } from '@shared/schemas/schemas'
// console.log(productSchema.shape)
import { io } from "socket.io-client";
import { useEffect } from 'react'
import { useSocketContext } from './hooks/socket'

function App() {
  useMeQuery();
  const user = useAppSelector((state) => state.user.user);
  const {authProviders, createdAt, updatedAt, __v, ...rest} = user || {};

  const {socket} = useSocketContext();

  return (
    <BrowserRouter>
    <div className='grid grid-rows-[auto_1fr_auto] min-h-[100vh] items-start'>
      <Navbar/>
      <button
        className='p-2 bg-slate-700 rounded text-white'
        onClick={() => socket.emit('message', 'BUTTON')}
      >
        EMIT WHEN WS CONNECTED
      </button>
      <Routes>
        <Route path="/" element={<Navigate to="/shop"/> }/>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/userLevel" element={<UserLevelSwitch />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer/>
      {/* <div className='grid overflow-hidden'>
        <pre>{JSON.stringify({...rest}, null, 2)}</pre>
      </div> */}
      <Toaster />
    </div>
    </BrowserRouter>
  )
}

export default App
