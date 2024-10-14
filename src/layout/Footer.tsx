import githubLogo from '../assets/github/github-mark-white.svg'

export default function Footer() {
  return (
    <footer className="py-1 grid gap-y-1 justify-center justify-items-center text-neutral-200 bg-slate-950">
      <a target='_blank' href='https://github.com/omero2582/general-store'><img src={githubLogo} className='w-6 h-auto'/></a>
      <p>Sebastian Cevallos</p>
    </footer>
  )
}
