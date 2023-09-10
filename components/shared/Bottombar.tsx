"use client"
import { sidebarLinks } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


export default function Bottombar() {
  const pathname=usePathname()
  return (
    <section className="bottombar">
      <div className="bottombar_container">
      {sidebarLinks.map((lin)=>{
          const isActive=(pathname.includes(lin.route) && lin.route.length>1) || pathname===lin.route
          return (
            <Link href={lin.route}
             key={lin.label}
             className={`leftsidebar_link ${isActive? 'bg-primary-500' : ''}`}>
              <Image src={lin.imgURL} alt={lin.label} width={24} height={24}/>
              <p className="text-light-1 max-lg:hidden">{lin.label}</p>
             </Link>
          )
        })}
      </div>
    </section>
  )
}
