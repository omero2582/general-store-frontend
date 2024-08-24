import { Link } from 'react-router-dom'
import logoSvgUrl from '../assets/react.svg'

export function Navbar() {
  return (
    <nav className="grid grid-flow-col justify-between px-8 bg-slate-900 text-white">
      <Link to={'/'}>
        <img src={logoSvgUrl} className='w-[40px] box-content py-[10px] cursor-pointer'/>
      </Link>
      <ul className="grid grid-flow-col text-[24px]">
        {[
          ['Home', '/'],
          ['Shop', '/shop'],
        ].map(([title, url]) => (
          <li key={title} className="font-[500] cursor-pointer">
            <Link className='h-full grid items-center px-[25px] bg-red-400 hover:bg-slate-800' to={url}>{title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}