import viteSVG from '/vite.svg'
export default function Shop (){

  const items = new Array(10).fill({
    name: 'Product Name',
    imgUrl: viteSVG,
    description: 'Aliquip velit mollit do sunt fugiat nostrud. Et excepteur quis consequat aute reprehenderit est cupidatat cillum. Tempor sunt ad proident tempor id excepteur in occaecat enim sint Lorem proident ipsum incididunt. Ut ullamco laborum laboris aute cillum cupidatat.',
    rating: () => (Math.floor(Math.random() * 50) + 1)/10,
    numRatings: () => Math.floor(Math.random() * 10_000) + 1,
    price: () => (Math.floor(Math.random() * 100_000) + 1)/100,
  })

  const formatterNum = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });
  // const formatterShort = Intl.NumberFormat('en', {notation:"compact", maximumFractionDigits: 2})
  const formatterShort = Intl.NumberFormat('en');

  return (
  <div className=''>
    <h1>Shop</h1>
    <div className='grid justify-center gap-6 grid-cols-[repeat(5,_minmax(0,_160px))]'>
      {items.map( ({name, imgUrl, description, price, rating, numRatings}) => (
        <div>
          <h2>{name}</h2>
          <img src={imgUrl} className='w-[100%] object-cover bg-green-200 border-black border-solid border-2'/>
          <p>{formatterNum.format(price())}</p>
          <div className='grid grid-flow-col'>
            <p>{rating()}</p>
            <p>{formatterShort.format(numRatings())}</p>
          </div>
          <p className='line-clamp-4'>{description}</p>
        </div>
      ))}
    </div>
  </div>
  )
}