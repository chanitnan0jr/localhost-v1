import Hero from '@/components/detective/DetectiveHero'
import PortfolioTimeline from '@/components/detective/PortfolioTimeline'
import About from '@/components/home/About'
import LabResearch from '@/components/home/LabResearch'
import Workflow from '@/components/home/Workflow'
import Certifications from '@/components/home/Certifications'
import GetInTouch from '@/components/home/GetInTouch'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="home-portfolio">
      <Hero />
      <div className="portfolio-continuation">
        <PortfolioTimeline />
        <About />
        <div id="work">
          <LabResearch />
        </div>
        <Workflow />
        <Certifications />
        <GetInTouch />
      </div>
      <Footer />
    </main>
  )
}
