import React from "react";
import CalculatorWizard from "./CalculatorWizard";

export default function Calculator() {
  return (
    <section id="kalkulacka" className="relative bg-calc-warm py-20 md:py-32 overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="text-terracotta font-mono text-xs uppercase tracking-[0.14em] mb-3">Poptávka</div>
            <h2 className="display-mega text-brown text-4xl md:text-5xl text-balance max-w-[16ch]">
              Vyžádejte si kalkulaci.
            </h2>
          </div>
          <p className="text-brown-soft max-w-md text-lg leading-relaxed">
            Cenu spočítáme ručně podle vašich údajů a ozveme se vám s nezávaznou nabídkou.
            Projděte pár kroků a pošlete nám poptávku.
          </p>
        </div>

        <CalculatorWizard />
      </div>
    </section>
  );
}