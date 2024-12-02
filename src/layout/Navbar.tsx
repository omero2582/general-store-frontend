import { Link } from 'react-router-dom'
import logoSvgUrl from '../assets/react.svg'
import Logout from '../assets/logout.svg?react'
import Profile from '../assets/profile.svg?react'
import { MdShoppingCart } from "react-icons/md";
import { useAppSelector } from '@/store/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogoutGoogleMutation, useMeQuery } from '@/store/api/apiSlice';
import { useGetCartQuery } from '@/store/api/apiSlice'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function Navbar() {
  const user = useAppSelector((state) => state.user.user);
  const {isLoading, data} = useMeQuery();
  const [logout, resLogout] = useLogoutGoogleMutation();

  const cartQuery = useGetCartQuery(undefined, {
    skip: !user
  });

  return (
    <nav className="grid grid-flow-col justify-between px-8 bg-slate-900 text-neutral-100">
      <div className='grid gap-x-4 grid-flow-col justify-start'>
        <Link to={'/shop'}>
          <img src={logoSvgUrl} className='w-[40px] py-[10px] cursor-pointer'/>
        </Link>
        <ul className="grid grid-flow-col text-[24px]">
          {[
            // ['Home', '/'],
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
      <div className='grid  grid-flow-col h-full'>
        {user ?
          <>
          <Link to={'/cart'} className='grid grid-flow-col content-center px-3 hover:bg-slate-800'>
            <MdShoppingCart className='w-full h-full' />
            <span className='text-[1.5rem] font-medium'>
              {cartQuery?.data?.cart?.items?.reduce((sum, cur) => sum += cur.quantity, 0) || 0}
            </span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className='hover:bg-slate-800 px-2'>
              {/* <img className=' cursor-pointer h-[45px] rounded-full' src={user.authProviders.google.profilePicture}/> */}
              <Avatar className='h-[45px] w-auto'>
                <AvatarImage src={user.authProviders.google.profilePicture} />
                <AvatarFallback className='h-[45px] w-[45px] bg-neutral-600'></AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-[240px]'>
              <div className='mt-1 mb-[2px] grid grid-flow-col px-3 gap-x-2'>
                {/* <img className='cursor-pointer h-[45px] rounded-full' src={user.authProviders.google.profilePicture}/> */}
                <Avatar className='h-[45px] w-auto'>
                  <AvatarImage src={user.authProviders.google.profilePicture} />
                  <AvatarFallback className='h-[45px] w-[45px] bg-neutral-600'></AvatarFallback>
                </Avatar>
                <div className='grid content-center'>
                  <p className='text-[0.85rem]'>level: {user.userLevel}</p>
                  <p className='text-[0.85rem]'>{user.username}</p>
                </div>
              </div>
              <Link to={'/profile'}>
                <DropdownMenuItem className='space-x-2 cursor-pointer'>
                  <Profile className='w-[26px] h-auto'/>
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className='space-x-2 cursor-pointer' onClick={() => logout()}>
                <Logout className='w-[26px] h-auto'/>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </>
          : isLoading?
          <div className='mx-2 self-center bg-stone-300 h-[45px] w-[45px] rounded-full'></div>
          :<a 
            href='/api/auth/google'
            className='self-center py-[3px] px-4 rounded border-[2px] border-slate-400 font-[500] tracking-wide text-[18px] hover:bg-slate-800 grid items-center'
          >
            Sign In
          </a>
        }
      </div>
        
      
    </nav>
  )
}