import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import SkillsSection from '@/components/SkillsSection';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import FloatingSymbols from '@/components/FloatingSymbols';

export default function Home() {
  return (
    <>
      <FloatingSymbols />
      <Navbar />
      <main>
        <Hero />
        <About />
        <SkillsSection />
        <Projects />
        <Experience />
        <Certifications />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
