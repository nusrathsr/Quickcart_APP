"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch master category name
  useEffect(() => {
    if (!slug) return;

    const fetchMasterCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/master-categories/slug/${slug}`);
        setCategoryName(res.data.name);
      } catch {
        setCategoryName("Category Not Found");
      }
    };

    fetchMasterCategory();
  }, [slug]);

  // Fetch subcategories for this master category
  useEffect(() => {
    if (!slug) return;

    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/sub-categories/by-master/${slug}`);
        setSubCategories(res.data);
      } catch {
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [slug]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

      {subCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {subCategories.map((sub) => (
            <Link key={sub._id} href={`/sub-category/${sub.slug}`} className="border rounded shadow p-4 flex flex-col items-center">
              <img
                src={sub.image}
                alt={sub.name}
                className="w-24 h-24 object-cover rounded-full mb-2"
              />
              <span className="font-semibold">{sub.name}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p>No subcategories available</p>
      )}
    </div>
  );
}
