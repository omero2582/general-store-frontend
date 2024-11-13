import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop/Shop'
import Admin from './pages/Admin/Admin'
import { Navbar } from './layout/Navbar'
import { useAppSelector } from './store/store'
import { useMeQuery } from './store/api/authSlice'
import UserLevelSwitch from './pages/UserLevelSwitch'
import { Toaster } from './components/ui/toaster'
import Profile from './pages/Profile/Profile'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Footer from './layout/Footer'
import Cart from './pages/Cart/Cart'
// import { productSchema } from '@shared/schemas/schemas'
// console.log(productSchema.shape)


function App() {
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
