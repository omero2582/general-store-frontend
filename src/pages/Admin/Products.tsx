import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useDeleteProductMutation, useGetProductsQuery } from "../../api/productsApiSlice";
import StarRatings from 'react-star-ratings';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NewProductModal } from "./NewProductModal";

export default function Products({showAdmin = false}) {
  const [deleteDocument, resDeleteDocument] = useDeleteProductMutation();
  const {data, refetch} = useGetProductsQuery();

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

      <div className=" grid justify-center mx-auto gap-6 max-w-[1920px] grid-cols-[repeat(auto-fit,_minmax(0,_250px))]">
        {data && data.products.map(p => (
          <div key={p.id}>
            <div className="bg-stone-100 grid">
              <AspectRatio ratio={1} className="place-self-center">
                <img src={p.image.url} className="max-h-[250px]"/>
              </AspectRatio >
            </div>
            <h3 className="pt-2 font-[500] text-[1.05rem]">{p.name}</h3>
            {/* <p>{p.averageRating} ({p.numRatings})</p> */}
            <div className="mt-[-4px]">
              <StarRatings
                  rating={p.averageRating}
                  numberOfStars={5}
                  name='rating'
                  starDimension='18px'
                  starSpacing='0px'
                  starRatedColor='#E78A2E'
                  // starEmptyColor='#acb9d2'
                  starHoverColor='blue'
                  changeRating={(newRating: number) => console.log('CHANGE', newRating)}
              />
              <span>({p.numRatings})</span>
            </div>
            {/* {p.description && <p className="text-[0.95rem]">{p.description}</p>} */}
            <p className="font-[500] text-[1.20rem] pt-2">{getPrice(p.price)}</p>
            {
              showAdmin && 
              <>
                <p>{p.visibility}</p>
                <div className="space-x-1">
                  <button
                    className="px-3 py-1 bg-red-500 rounded-md text-white"
                    onClick={() => deleteDocument(p.id)}
                    // TODO, how to display success/error when successfully deleted?
                    // would probably end up using an errorSlice redux state, and on every
                    // mutation, if error it would set the error
                  >
                    Delete
                  </button>
                  <button
                    className="px-3 py-1 bg-neutral-800 rounded-md text-white"
                    onClick={() => console.log('EDIT')}
                  >
                    Edit
                  </button>
                </div>
              </>
            }
              {/* <pre>{JSON.stringify(p, null, 2)}</pre> */}
          </div>
          ))}
        </div>
  )
}
