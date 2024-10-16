import { useMeQuery } from "@/store/api/authSlice";
import { useAppSelector } from "@/store/store";
import { formatDistance, formatDistanceToNowStrict } from "date-fns";


export default function Profile() {
  const user = useAppSelector((state) => state.user.user);
  const {isFetching} = useMeQuery()
  // maybe add params to above (undefined, {refetchOnMountOrArgChange: true})
  // so that it always refetches when this page loads


  if(!user || isFetching){
    return (
      <div className="grid justify-center justify-items-start">
        <h1 className="text-[1.8rem] font-medium">Profile</h1>
        <p className="text-[1.1rem] mb-[6px] mt-2">Sign in to view your Profile</p>
        <a 
            href='/api/auth/google'
            className='bg-slate-900 text-neutral-100 py-[3px] px-4 rounded border-[2px] border-slate-400 font-[500] tracking-wide text-[18px] hover:bg-slate-800 h-full grid items-center'
          >
            Sign In
          </a>
      </div>
    )
  }
  //
  const {userLevel, displayName, nameFull, email, username, createdAt, cookie} = user || {};
  // const date2 = dateOriginal.toString()
  const date = new Intl.DateTimeFormat(undefined, { 
    dateStyle: 'medium', timeStyle: 'long'
  }).format(new Date(createdAt || null))
  return (
    <div className="grid justify-center">
      <h1 className="text-[1.8rem] font-medium">Profile</h1>
      <p>User Level: {userLevel}</p>
      <p>Display Name: {displayName}</p>
      <p>First Name: {nameFull?.firstName}</p>
      <p>Last Name: {nameFull?.lastName}</p>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <p>User created At: {date}</p>
      <div className="mt-4">
        <p>Current Session Info:</p>
        <p>{'Expires in: '}
          {formatDistanceToNowStrict(new Date(cookie?.expires || null), {roundingMethod: 'floor'})}
          {' ('} 
          {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'long'})
            .format(new Date(cookie?.expires || null))}
          {')'} 
        </p>
        <p>Original Expiry Time: {formatDistance(0, cookie?.originalMaxAge || null, {includeSeconds: true})}</p>
      </div>
    </div>
  )
}
