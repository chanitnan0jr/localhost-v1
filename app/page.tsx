import Hero from '@/components/phantom/PhantomHero'
import PortfolioTimeline from '@/components/phantom/PortfolioTimeline'
import About from '@/components/home/About'
import LabResearch from '@/components/home/LabResearch'
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
        <Certifications />
        <GetInTouch />
      </div>
      <Footer />
    </main>
  )
}
