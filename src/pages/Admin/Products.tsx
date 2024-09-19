import { useDeleteProductMutation } from "../../api/productsApiSlice";

export default function Products({data}) {
  const [deleteDocument, resDeleteDocument] = useDeleteProductMutation();

  const getPrice = (price) => {
    if(price === 0){
      return 'FREE'
    } else if (!price){
      return '-'
    } else{
      return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(price)
    }
  }

  if(data) {
    const sec = data.products.find(p => p.name === 'SECCC');
    console.log('PPPP', sec)
  }

  return (
    <div>
        <h2 className="text-[22px] font-[500]">Products</h2>
        <div className="grid justify-center gap-6 grid-cols-[repeat(5,_minmax(0,_160px))]">
          {data && data.products.map(p => (
            <div key={p.id}>
              <img src={p.image.url} className=""/>
              <h3 className="font-[500] text-[1.3rem]">{p.name}</h3>
              {p.description && <p>{p.description}</p>}
              <p>{p.visibility}</p>
              <p>avgRating: {p.averageRating}</p>
              <p>numRatings: {p.numRatings}</p>
              <p>price: {getPrice(p.price)}</p>
              <button
                className="px-3 py-1 bg-red-500 rounded-md text-white"
                onClick={() => deleteDocument(p.id)}
                // TODO, how to display success/error when successfully deleted?
                // would probably end up using an errorSlice redux state, and on every
                // mutation, if error it would set the error
              >
                Delete
              </button>
              {/* <pre>{JSON.stringify(p, null, 2)}</pre> */}
            </div>
          ))}
        </div>
      </div>
  )
}
