"use client";

import Link from "next/link";
import { IoLogoDiscord } from "react-icons/io5";



export default function ContactUsOnDiscord() {
 
  return (
    <Link href="https://discord.gg/GK6gvbTF" target="_blank">
      
        <div className="flex h-12 cursor-pointer items-center justify-center bg-black text-white hover:underline">
          <p className="mx-2">An unexpected error happened. Please contact us on Discord</p>
          <IoLogoDiscord className="h-6 w-6" />
        </div>
      </Link>
  );
}
