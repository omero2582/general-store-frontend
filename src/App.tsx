// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Admin from './pages/Admin/Admin'
import { Navbar } from './layout/Navbar'
import { useAppSelector } from './store/store'
import { useEffect } from 'react'
import { useMeQuery } from './store/api/authSlice'
import UserLevelSwitch from './pages/Admin/UserLevelSwitch'
import { Toaster } from './components/ui/toaster'
// import { productSchema } from '@shared/schemas/schemas'
// console.log(productSchema.shape)


function App() {
  const user = useAppSelector((state) => state.user.user);
  useMeQuery();

  const {authProviders, createdAt, updatedAt, __v, ...rest} = user || {};

  return (
    <BrowserRouter>
    <div className='grid'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/userLevel" element={<UserLevelSwitch />} />
      </Routes>
      <div className='grid overflow-hidden'>
        <pre>{JSON.stringify({...rest}, null, 2)}</pre>
      </div>
      <Toaster />
    </div>
    </BrowserRouter>
  )
}

export default App
