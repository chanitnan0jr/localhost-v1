import type { Metadata } from 'next'
import PortfolioTerminal from '@/components/detective/PortfolioTerminal'

export const metadata: Metadata = {
  title: 'Terminal // Runtime',
  description: 'Interactive system console and runtime terminal by Chanitnan Kitnantakhun.',
}

export default function TerminalPage() {
  return (
    <main className="terminal-page">
      <PortfolioTerminal />
    </main>
  )
}
