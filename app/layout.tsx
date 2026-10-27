import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ModalProvider } from '@/context/ModalContext'
import { VisitorProvider } from '@/context/VisitorContext'
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
export const metadata: Metadata = {
  title: 'Chanitnan Portfolio',
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
    <html lang="en">
      <body
        className={`${inter.className} ${inter.variable} ${display.variable} antialiased selection:bg-primary selection:text-on-primary`}
      >
        <EvidenceNetworkBackground />
        <VisitorProvider>
          <ModalProvider>
            <Navbar />
            {children}
            <ImageModal />
          </ModalProvider>
        </VisitorProvider>
      </body>
    </html>
  )
}
