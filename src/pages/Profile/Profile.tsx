import { Spinner } from "@/components/Spinner";
import { useMeQuery } from "@/store/api/apiSlice";
import { formatDistance, formatDistanceToNowStrict } from "date-fns";


export default function Profile() {
  const { data, isFetching} = useMeQuery()
  const user = data?.user;
  // maybe add params to above (undefined, {refetchOnMountOrArgChange: true})
  // so that it always refetches when this page loads

  if(isFetching){
    return(
      <div className="grid justify-center">
        <h1 className="pt-[10px] text-[1.8rem] font-medium text-center">Profile</h1>
        <Spinner className='mt-[10px] text-neutral-700 w-[60px] h-auto'/>
      </div>
    )
  }

  if(!user){
    return (
      <div className="grid justify-center">
        <h1 className="pt-[10px] text-[1.8rem] font-medium text-center">Profile</h1>
        <p className="text-[1.1rem] mb-[6px] mt-2">Sign in to view your Profile</p>
        <a 
            href='/api/auth/google'
            className='justify-self-start bg-slate-900 text-neutral-100 py-[3px] px-4 rounded border-[2px] border-slate-400 font-[500] tracking-wide text-[18px] hover:bg-slate-800 h-full grid items-center'
          >
            Sign In
          </a>
      </div>
    )
  }
  //
  const {userLevel, displayName, nameFull, email, username, createdAt, session} = user || {};
  // const date2 = dateOriginal.toString()
  const date = new Intl.DateTimeFormat(undefined, { 
    dateStyle: 'medium', timeStyle: 'long'
  }).format(new Date(createdAt || null))
  
  return (
    <div className="grid justify-center">
      {
      <>
        <h1 className="pt-[10px] pb-[7px] text-[1.8rem] font-medium text-center">Profile</h1>
        <p>Level: {userLevel}</p>
        <p>Display Name: {displayName}</p>
        <p>First Name: {nameFull?.firstName}</p>
        <p>Last Name: {nameFull?.lastName}</p>
        <p>Username: {username}</p>
        <p>Email: {email}</p>
        <p>User created At: {date}</p>
        <div className="mt-4">
          <p>Current Session Info:</p>
          <p>{'Expires in: '}
            {formatDistanceToNowStrict(new Date(session?.expires || null), {roundingMethod: 'floor'})}
            {' ('} 
            {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'long'})
              .format(new Date(session?.expires || null))}
            {')'} 
          </p>
          <p>Original Expiry Time: {formatDistance(0, session?.originalMaxAge || null, {includeSeconds: true})}</p>
        </div>
      </>
      }
    </div>
  )
}
