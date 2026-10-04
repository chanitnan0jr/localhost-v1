import Hero from '@/components/home/Hero'
import PhotoGallery from '@/components/detective/PhotoGallery'
import About from '@/components/home/About'
import SelectedWork from '@/components/home/SelectedWork'
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
        <SelectedWork />
        <PhotoGallery />
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
