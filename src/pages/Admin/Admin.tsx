import { useState } from "react";
import ManageProducts from "./Products/ManageProducts";
import ManageCategories from "./Categories/ManageCategories";
import { useAppSelector } from "@/store/store";
import { Link } from "react-router-dom";
import { useMeQuery } from "@/store/api/apiSlice";

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products')
  const { data } = useMeQuery();
  const user = data?.user;

  if(!user){
    return (
      <div className="grid justify-center">
        <h1 className="text-[30px] font-[500] text-center">Admin Panel</h1>
        <a 
          href='/api/auth/google'
          className='justify-self-center bg-blue-950 text-neutral-100 py-[3px] px-4 rounded border-[2px] border-slate-400 font-[500] tracking-wide text-[18px] hover:bg-blue-900 h-full grid items-center'
        >
          Sign In
        </a>
      </div>
    )
  }

  if(user?.userLevel === "user"){
    return (
      <div className="grid justify-center">
        <h1 className="text-[30px] font-[500] text-center">Admin Panel</h1>
        <h2 className="mb-[4px] text-[1.15rem]">You need a higher User Level to access this resource</h2>
        <Link 
          to='/userlevel'
          className='justify-self-center bg-blue-950 text-neutral-100 py-[5px] px-4 rounded border-[2px] border-slate-400 font-[500] tracking-wide text-[18px] hover:bg-blue-900 h-full grid items-center'
        >
          Change User Level
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: "products", label: "Products", component: <ManageProducts/> },
    { id: "categories", label: "Categories", component:  <ManageCategories/>},
  ];

  return (
    <div>
      <h1 className="text-[30px] font-[500] text-center">Admin Panel</h1>
      <div>
        {tabs.map(({id, label}) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`text-[1.05rem] px-2 ${activeTab === id ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tabs.find((tab) => tab.id === activeTab)?.component}
    </div>
  )
}



