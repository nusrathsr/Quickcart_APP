"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function MasterCategoryPage() {
  const { masterCategorySlug } = useParams();
  const [masterCategory, setMasterCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch master category by slug
        const masterRes = await axios.get(
          `http://localhost:3001/api/master-categories/slug/${masterCategorySlug}`
        );
        setMasterCategory(masterRes.data);

        // Fetch subcategories linked to this master category
        const subRes = await axios.get(
          `http://localhost:3001/api/sub-categories?masterCategoryId=${masterRes.data._id}`
        );
        setSubcategories(subRes.data);
      } catch (error) {
        console.error("Error fetching master category or subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [masterCategorySlug]);

  if (loading) return <p>Loading...</p>;
  if (!masterCategory) return <p>Master Category not found.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{masterCategory.name}</h1>

      {subcategories.length === 0 ? (
        <p>No subcategories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subcategories.map((sub) => (
            <Link
              key={sub._id}
              href={`/categories/sub/${sub.slug}`}
              className="border rounded shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={sub.image || "/placeholder.png"}
                alt={sub.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{sub.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
