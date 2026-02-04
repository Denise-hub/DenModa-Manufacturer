import React from 'react';

// Section Components
import Hero from '../components/sections/Hero';
import IconBoxes from '../components/sections/IconBoxes';
import About from '../components/sections/About';
import Services from '../components/sections/Services';
import Products from '../components/sections/Products';
import Team from '../components/sections/Team';
import Contact from '../components/sections/Contact';
import FAQ from '../components/sections/FAQ';

const HomePage = () => {
  return (
    <>
      <Hero />
      <main id="main">
        <IconBoxes />
        <About />
        <Services />
        <Products />
        <Team />
        <Contact />
        <FAQ />
      </main>
    </>
  );
};

export default HomePage;
