import type { Metadata } from 'next'
import PortfolioTerminal from '@/components/phantom/PortfolioTerminal'

export const metadata: Metadata = {
  description: 'Interactive system console and runtime terminal by Chanitnan Kitnantakhun.',
}

export default function TerminalPage() {
  return (
    <main className="terminal-page">
      <PortfolioTerminal />
    </main>
  )
}
