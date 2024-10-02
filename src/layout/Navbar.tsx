import { Link } from 'react-router-dom'
import logoSvgUrl from '../assets/react.svg'
import logoutSvg from '../assets/logout.svg'
import { useAppSelector } from '@/store/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogoutGoogleMutation } from '@/store/api/authSlice';

export function Navbar() {
  const user = useAppSelector((state) => state.user.user);
  const [logout, resLogout] = useLogoutGoogleMutation();
  return (
    <nav className="grid grid-flow-col justify-between px-8 bg-slate-900 text-neutral-100">
      <div className='grid gap-x-4 grid-flow-col justify-start'>
        <Link to={'/'}>
          <img src={logoSvgUrl} className='w-[40px] py-[10px] cursor-pointer'/>
        </Link>
        <ul className="grid grid-flow-col text-[24px]">
          {[
            ['Home', '/'],
            ['Shop', '/shop'],
            ['Admin', '/admin'],
            ['UserLevel', '/userLevel'],
          ].map(([title, url]) => (
            <li key={title} className="cursor-pointer">
              <Link className='font-[500] text-[21px] tracking-wide h-full grid items-center px-[10px] hover:bg-slate-800' to={url}>{title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className='grid content-center h-full'>
        {user ?
          <DropdownMenu>
          <DropdownMenuTrigger>
            <img className='cursor-pointer h-[45px] rounded-full' src={user.authProviders.google.profilePicture}/>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem className='space-x-2 cursor-pointer'>
              <img src={logoutSvg} className='w-[26px]'/>
              <button onClick={() => logout()}>Log out</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> 
          :<a 
            href='http://localhost:3000/api/auth/google'
            className='py-[3px] px-4 rounded border-[2px] border-slate-400 font-[500] tracking-wide text-[18px] hover:bg-slate-800 h-full grid items-center'
          >
            Sign In
          </a>
        }
      </div>
        
      
    </nav>
  )
}