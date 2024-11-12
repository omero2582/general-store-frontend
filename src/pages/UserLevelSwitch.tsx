import { Spinner } from '@/components/Spinner';
import { useToast } from '@/hooks/use-toast';
import { useMeQuery } from '@/store/api/authSlice';
import { useChangeUserLevelMutation } from '@/store/api/userSlice';
import { useAppSelector } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeUserLevelSchema, TChangeUserLevelSchema } from '@shared/dist/schemas';
import { useEffect } from 'react'
import { useForm } from 'react-hook-form';

// TODO add toast
export default function UserLevelSwitch() {
  const user = useAppSelector((state) => state.user.user);
  const { toast } = useToast()


  const formHook = useForm<TChangeUserLevelSchema>({
    resolver: zodResolver(changeUserLevelSchema),
    defaultValues: {
      // userLevel: user?.userLevel, // doesnt work because redux user state is set after fetch call
      // thinking about it more, maybe user should be an RTK Query call, and we should be reading it
      // from the cache, but then we would have to specify that every call provides this cache too & maybe too cimplcated
    }
  });

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
    setError,
    getValues,
    watch,
    setValue,
  } = formHook;

  const {userLevel} = watch()

  useEffect(() => {
    if(user){
      setValue('userLevel', user.userLevel)
    }
  }, [user])
  // TODO I think now that we know we can get the value of user from meQuery,
  // not sure if I should remove this effect and just listen to the querry result?
  // prob not because there were 2 reasons we had this:
  // 1 - wait for initial fetch
  // 2 - change when user changes
  // I belive this second reason would NOT be solved by swithcing our strategy to ocmment above
  // Not sure though, have to think about this, i havent thought muhc abt this
  const {isLoading, data} = useMeQuery();



  const [changeUserLevel, resChangeUserLevel] = useChangeUserLevelMutation();
  const onSubmit = async (body: TChangeUserLevelSchema) => {
    console.log('SUBMIT', body);

    const result = await changeUserLevel(body);
    if(result.error){
      console.error(result.error);
      return
    }
    
    toast({
      title: 'Success',
      description: `Set user level to ${body.userLevel}`,
      className: 'bg-neutral-900 text-neutral-300'
      //https://github.com/shadcn-ui/ui/issues/2157
    })
    // reset(); // clear inputs
  }

  

  return (
    <div className='grid gap-y-6 mt-5'>
      <h1 className='text-[40px] font-[500] tracking-[0.02rem] justify-self-center'>Choose User Level</h1>
      <form className='grid gap-y-5 place-items-center' noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-flow-col gap-x-3 auto-cols-fr'>
        {[
          {label: 'User', value: 'user', details: ['Regular access to the store', 'Cannot modify the store']},
          {label: 'Admin', value: 'admin', details: ['All benefits of User level', 'Can add, edit, and delete items, except those set by a higher level (owner)']}
        ].map(({label, value, details}) => (
          <label key={value} className={`grid  ${userLevel === value ? 'selected' : ''}`}>
            <input
              type="radio"
              // name="userLevel"
              // onChange={handleChange}
              value={value}
              checked={userLevel === value}
              className='sr-only'
              {...register("userLevel")}
            />
            <div className={`cursor-pointer border-[4px] bg-zinc-100 rounded px-5 py-5 min-h-[100px] max-w-[350px]
              ${userLevel === value ? 'border-amber-400' : 'border-transparent'} `}
            >
              <h4 className='mb-[8px] tracking-wide text-[28px] font-medium text-center'>{label}</h4>
              {details.map((bulletPoint, i) => (
                <p key={i} className='text-[17px] tracking-[0.01rem]'>- {bulletPoint}</p>
              ))}
            </div>
          </label>
        ))}
        </div>
        {/**px-5 py-2 */}
        {!user && !isLoading &&
          // <button onClick={() => signin} type='button' className={` bg-emerald-700 hover:bg-emerald-600 w-[106px] h-[46px] text-white rounded text-[20px] tracking-wide`}>
          //   Sign In
          // </button>
          <a 
            href='/api/auth/google'
            className='bg-slate-900 text-neutral-100 py-[3px] px-4 rounded border-[2px] border-slate-400 font-[500] tracking-wide text-[18px] hover:bg-slate-800 h-full grid items-center'
          >
            Sign In
          </a>
        }
        {user && 
          <button disabled={resChangeUserLevel.isLoading} className={` disabled:bg-emerald-800 bg-emerald-700 hover:bg-emerald-600 w-[106px] h-[46px] text-white rounded text-[20px] tracking-wide`}>
            {resChangeUserLevel.isLoading?
            <Spinner className='text-neutral-100'/>
            :'Submit'}
          </button>
        }
      </form>
    </div>
  )
}
