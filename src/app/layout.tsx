import './style/globals.css'
import './style/slider.css'
import './style/metronome-selector.css'
import './style/metronome-view.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rhythm Finder',
  description: 'Tap to find the rhythm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
