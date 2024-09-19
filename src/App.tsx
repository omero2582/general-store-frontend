// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Admin from './pages/Admin/Admin'
import { Navbar } from './layout/Navbar'
// import { productSchema } from '@shared/schemas/schemas'
// console.log(productSchema.shape)

function App() {
  return (
    <BrowserRouter>
    <div className='grid'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
