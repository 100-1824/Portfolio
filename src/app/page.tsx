import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import About from '@/components/About';
import Capabilities from '@/components/Capabilities';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Capabilities />
        <Projects />
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      {/* film grain */}
      <div aria-hidden className="noise pointer-events-none fixed inset-0 z-[110] opacity-[0.035] mix-blend-overlay" />
    </>
  );
}
