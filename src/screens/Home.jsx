"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Calculator from "@/components/sections/Calculator";
import Articles from "@/components/sections/Articles";
import Gallery from "@/components/sections/Gallery";
import Clanky from "@/components/sections/Clanky";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="bg-sand min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Calculator />
      <Articles />
      <Gallery />
      <Clanky />
      <Contact />
      <Footer />
    </div>
  );
}
