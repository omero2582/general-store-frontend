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

function App() {
  useMeQuery();
  // After above, consider adding an if Loading {return spinner} and/or turning it
  // into a context/hook and/or Route wrapper comonent
  // research how to properly do this. Off the top of my head there are pros & cons
  // Cons: 
  // you are creating an uncesseary waterfall to your first app load, which will
  // make the initial load slower, since it MUST wait for useMeQuery response before
  // firing the rest of our responses in child components, instead of running in parallel
  // Pros:
  // You prevent the same client firing an extra X amount of fetch calls,
  // that might be routes that only work if you are signed in.
  // that is the other issue we need better reasearch on: We have some routes 
  // that should ONLY be accessible if the user is logged in, and other routes
  // that should be accessible to everyone even if not signed in

  const user = useAppSelector((state) => state.user.user);
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
