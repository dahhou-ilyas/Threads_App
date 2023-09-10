import type { Metadata } from 'next'
import '../globals.css'
import {ClerkProvider} from '@clerk/nextjs'
import { Inter } from 'next/font/google'

export const metadata:Metadata={
    title:'Threads',
    description:'my Next js app meta threads Apllication'
}
const inter=Inter({subsets:['latin']})

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <ClerkProvider>
        <html lang='en'>
            <body className={`${inter.className} bg-dark-1`}>
                {children}
            </body>
        </html>
      </ClerkProvider>
    )
  }