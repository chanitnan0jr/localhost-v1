import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ModalProvider } from '@/context/ModalContext'
import Navbar from '@/components/layout/Navbar'
import ImageModal from '@/components/ui/ImageModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chanitnan Kitnantakhun — Backend / Systems',
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
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
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
