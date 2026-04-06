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

export default function HomePage() {
  return (
    <main className="pt-[140px] pb-20">
      <Hero />
      <ProfileGrid />
      <About />
      <LabResearch />
      <CoreStack />
      <Workflow />
      <Competitions />
      <Certifications />
      <GetInTouch />
      <Footer variant="full" />
    </main>
  )
}
