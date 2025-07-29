import React from "react";
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        <div className="flex-1 max-w-xs">
          <h2 className="font-medium text-gray-900 mb-5">Company</h2>
          <ul className="text-sm space-y-2">
            <li>
              <a className="hover:underline transition" href="#">
                Home
              </a>
            </li>
            <li>
              <a className="hover:underline transition" href="#">
                About us
              </a>
            </li>
            <li>
              <a className="hover:underline transition" href="#">
                Contact us
              </a>
            </li>
            <li>
              <a className="hover:underline transition" href="#">
                Privacy policy
              </a>
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
