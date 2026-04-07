import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ModalProvider } from '@/context/ModalContext'
import Navbar from '@/components/layout/Navbar'
import ImageModal from '@/components/ui/ImageModal'

const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] })

export const metadata: Metadata = {
  title: 'My-Website',
  description: 'Backend & Systems Engineer portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${inter.className} antialiased selection:bg-primary selection:text-on-primary`}>
        <ModalProvider>
          <Navbar />
          {children}
          <ImageModal />
        </ModalProvider>
      </body>
    </html>
  )
}
