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

function App() {
  useEffect(() => {
    // const socket = io('/socket.io'); // does not work, it confuses this with namespace
    const socket = io({
      path: "/socket.io",
    });
    
    // https://socket.io/docs/v3/emit-cheatsheet/
    //const socket = io();  // also works
    // const socket = io('http://127.0.0.1:3000'); // works, but w need proxy, not direct connect
    // Emit an event to the server
    // socket.emit('message', 'hi');

    // client-side
    socket.on("connect", () => {
      console.log(`Socket connected ${socket.id}`);
    });
    
    socket.on("join-room", (room) => {
      console.log(`Joined room ${room}`);
    })

     // Clean up on component unmount
     return () => {
      socket.disconnect();
    };
  }, [])
  const user = useAppSelector((state) => state.user.user);
  useMeQuery();

  const {authProviders, createdAt, updatedAt, __v, ...rest} = user || {};

  return (
    <BrowserRouter>
    <div className='grid grid-rows-[auto_1fr_auto] min-h-[100vh] items-start'>
      <Navbar/>
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
