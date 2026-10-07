import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ModalProvider } from '@/context/ModalContext'
import Navbar from '@/components/layout/Navbar'
import ImageModal from '@/components/ui/ImageModal'
import EvidenceNetworkBackground from '@/components/ui/EvidenceNetworkBackground'

const inter = localFont({
  src: './fonts/Inter-Latin.woff2',
  weight: '100 900',
  variable: '--font-sans',
  display: 'swap',
})
const display = localFont({
  src: './fonts/RobotoCondensed-Latin.woff2',
  weight: '100 900',
  variable: '--font-display',
  display: 'swap',
})
const editorial = localFont({
  src: [
    {
      path: './fonts/Cormorant-Latin.woff2',
      weight: '300 700',
      style: 'normal',
    },
    {
      path: './fonts/Cormorant-Latin-Italic.woff2',
      weight: '300 700',
      style: 'italic',
    },
  ],
  variable: '--font-editorial',
  display: 'swap',
})
const symbols = localFont({
  src: './fonts/Material-Symbols.woff2',
  variable: '--font-symbols',
  display: 'block',
})

export const metadata: Metadata = {
  title: {
    default: 'Chanitnan — Every card tells a story',
    template: '%s · Chanitnan',
  },
  description: 'Backend & Systems Engineer portfolio',
  icons: {
    icon: '/images/TabPicture.png?v=3',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} ${inter.variable} ${display.variable} ${editorial.variable} ${symbols.variable} antialiased selection:bg-primary selection:text-on-primary`}
      >
        <EvidenceNetworkBackground />
        <ModalProvider>
          <Navbar />
          {children}
          <ImageModal />
        </ModalProvider>
      </body>
    </html>
  )
}
