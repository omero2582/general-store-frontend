import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useAddOrEditProductRatingMutation, useDeleteProductMutation, useGetProductsAdminQuery, useGetProductsQuery } from "../store/api/apiSlice";
import StarRatings from 'react-star-ratings';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { getPrice } from "@/lib/utils";
import ProductModalEdit from "./Admin/Products/ProductModal/ProductModalEdit";


export default function Products({showAdmin = false, query}) {
  const [deleteDocument, resDeleteDocument] = useDeleteProductMutation();
  const [addOrEditProductRating] = useAddOrEditProductRatingMutation();
  const {data, refetch, endpointName} = query;

  const handleChangeRating = (newRating: number, id) => {
    addOrEditProductRating({id, body: {rating: newRating}});
  }

  const [searchParams, setSearchParams] = useSearchParams('');
  const filter = searchParams.get('category') ;
  const sort = searchParams.get('sort') || 'default';

  const handleSort = (e) => {
    setSearchParams({...Object.fromEntries(searchParams.entries()), sort: e.target.value})
    // preserves all other search params;
  };



  return (
    <div>
      <div>
        {/*sort and filter?*/}
        <label htmlFor="sort">Sort by:</label>
        <select id="sort"
          value={sort || 'default'}  // sets default, without changing the url
          onChange={handleSort}
          className="border border-black rounded ml-[6px]"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="rating-asc">Rating: Low to High</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
      <div className=" grid justify-center mx-auto gap-4 max-w-[1920px] grid-cols-[repeat(auto-fit,_minmax(0,_220px))]">
        {data && data.products.map(p => {
          const productWithOrderedImages = {...p, images: [...p.images].sort((a, b) => a?.order - b?.order)}
          return(
          <div key={p.id}>
            <Link to={`/product/${p.id}`}>
              <div className="bg-stone-100 grid">
                <AspectRatio ratio={1} className="place-self-center">
                  <img src={productWithOrderedImages.images[0]?.url} className="max-h-[220px]"/>
                </AspectRatio >
              </div>
              <h3 className="pt-2 font-[400] text-[0.95rem] line-clamp-4 hover:underline cursor-pointer">
                {p.name}
              </h3>
            </Link>
            {/* <p>{p.rating} ({p.numRatings})</p> */}
            <div className="mt-[-4px]">
              <StarRatings
                  rating={p.rating}
                  numberOfStars={5}
                  name='rating'
                  starDimension='18px'
                  starSpacing='0px'
                  starRatedColor='#E78A2E'
                  // starEmptyColor='#acb9d2'
                  starHoverColor='blue'
                  changeRating={(newRating: number) => handleChangeRating(newRating, p.id)}
              />
              <span>({new Intl.NumberFormat('en').format(p.numRatings)})</span>
            </div>
            {/* {p.description && <p className="line-clamp-4 text-[0.95rem]">{p.description}</p>} */}
            <p className="font-[500] text-[1.20rem] pt-2">{getPrice(p.price)}</p>
            {
              showAdmin && 
              <>
                <p>{p.visibility}</p>
                <p>In: {p.categories.map(c=> c.name).join(', ') || '-'}</p>
                <div className="space-x-1">
                  <button
                    className="px-3 py-1 bg-red-500 rounded-md text-white"
                    onClick={() => deleteDocument({id: p.id})}
                    // TODO, how to display success/error when successfully deleted?
                    // would probably end up using an errorSlice redux state, and on every
                    // mutation, if error it would set the error
                  >
                    Delete
                  </button>                 
                  <ProductModalEdit product={productWithOrderedImages}>
                    <DialogTrigger className="px-3 py-1 bg-neutral-800 rounded-md text-white">
                      Edit
                    </DialogTrigger>
                  </ProductModalEdit>
                  
                </div>
                {p?.createdBy && <p>created by: {p.createdBy?.username} ({p.createdBy?.userLevel})</p>}
              </>
            }
              {/* <pre>{JSON.stringify(p, null, 2)}</pre> */}
          </div>
          )})}
        </div>
      </div>
  )
}
