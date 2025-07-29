import React from "react";
import Link from "next/link";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="flex-1 max-w-xs">
          <Image
            width={112}
            style={{ height: "auto", cursor: "pointer" }}
            src={assets.logo}
            alt="logo"
          />
          <p className="mt-6 text-sm">
            Welcome to QuickCart! We are committed to providing you with the best
            online shopping experience. Our platform offers a wide range of products
            across multiple categories, ensuring you find exactly what you need.
            QuickCart was founded with the vision to simplify online shopping and
            bring convenience to your fingertips. Thank you for choosing us!
          </p>
        </div>

        <div className="flex-1 max-w-xs">
          <h2 className="font-medium text-gray-900 mb-5">Company</h2>
          <ul className="text-sm space-y-2">
            <li>
              <Link href="/" className="hover:underline transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline transition">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline transition">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:underline transition">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-1 max-w-xs">
          <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
          <div className="text-sm space-y-2">
            <p>+1-234-567-890</p>
            <p>contact@greatstack.dev</p>
          </div>
        </div>
      </div>

      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © GreatStack.dev All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
