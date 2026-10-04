import Hero from '@/components/home/Hero'
import ProfileGrid from '@/components/home/ProfileGrid'
import About from '@/components/home/About'
import LabResearch from '@/components/home/LabResearch'
import CoreStack from '@/components/home/CoreStack'
import Workflow from '@/components/home/Workflow'
import Competitions from '@/components/home/Competitions'
import Certifications from '@/components/home/Certifications'
import GetInTouch from '@/components/home/GetInTouch'
import Footer from '@/components/layout/Footer'
import PortfolioTerminal from '@/components/detective/PortfolioTerminal'

export default function HomePage() {
  return (
    <main className="home-portfolio pb-20">
      <Hero />
      <PortfolioTerminal />
      <div className="portfolio-continuation">
        <ProfileGrid />
        <About />
        <div id="work">
          <LabResearch />
        </div>
        <CoreStack />
        <Workflow />
        <Competitions />
        <Certifications />
        <GetInTouch />
      </div>
      <Footer />
    </main>
  )
}
