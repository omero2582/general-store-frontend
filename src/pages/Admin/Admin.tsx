import { useState } from "react";
import ManageProducts from "./Products/ManageProducts";
import ManageCategories from "./Categories/ManageCategories";

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products')

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



