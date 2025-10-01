import type { NextPage } from "next";
import CreateInvoiceForm from "../components/create-invoice-form";
import Meta from "../components/meta/meta";

const IndexPage: NextPage = () => {
  return (
    <div className="max-w-full w-full h-full max-h-full relative overflow-y-scroll flex flex-col bg-base-200 px-4 lg:px-12 md:px-32 2xl:px-80  overflow-x-hidden">
      <Meta />
      <header className="mt-12 w-full lg:max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">
          Hej! Opret nemt faktura PDF'er online med PDFFaktura.dk
        </h1>
        <p className="mt-4 text-sm text-neutral/60 max-w-lg lg:max-w-2xl leading-relaxed">
          PDFFaktura.dk er det perfekte værktøj til at oprette og danne Faktura
          PDF'er på en nem og hurtig måde. Med vores brugervenlige online
          fakturaskabelon kan du oprette en professionel faktura på få minutter
          uden at bekymre dig om at skulle bruge en faktura skabelon i excel
          eller finde en skabelon til faktura andre steder.
        </p>
      </header>
      <main>
        <CreateInvoiceForm dx={{ enabled: process.env.dxEnabled === "true" }} />

        <div className="faq-section mx-auto max-w-5xl mt-8">
          <h2 className="font-bold text-xl">Ofte stillede spørgsmål</h2>
          <div className="faq-question">
            <h3 className="font-bold">
              Hvordan opretter jeg en faktura med PDFFaktura.dk?
            </h3>
            <p>
              Det er nemt! Du kan bruge vores brugervenlige fakturaskabelon og
              indtaste de nødvendige oplysninger for at oprette en faktura på
              ingen tid.
            </p>
          </div>
          {/* <div className="faq-question">
            <h3>Kan jeg tilpasse min fakturaskabelon med mit eget logo og farveskema?</h3>
            <p>
              Ja, du kan tilpasse fakturaskabelonen med dit eget logo og farveskema for at afspejle
              din virksomheds branding.
            </p>
          </div> */}
          <div className="faq-question">
            <h3>
              Kan jeg sende fakturaen direkte til mine kunder via PDFFaktura.dk?
            </h3>
            <p>
              Desværre ikke, men du kan nemt sende fakturaen direkte til dine
              kunder via email når du har downloadet den færdige faktura som
              PDF.
            </p>
          </div>
          <div className="faq-question">
            <h3>
              Er der nogen omkostninger forbundet med brugen af PDFFaktura.dk?
            </h3>
            <p>
              Du kan bruge PDFFaktura.dk helt gratis. Vi har ingen
              abonnementspriser eller andre skjulte omkostninger.
            </p>
          </div>
          <div className="faq-question">
            <h3>Kan jeg oprette fakturaer fra min smartphone eller tablet?</h3>
            <p>
              Ja, PDFFaktura.dk er mobilvenligt og giver dig mulighed for at
              oprette fakturaer fra din smartphone eller tablet, uanset hvor du
              er.
            </p>
          </div>
        </div>
      </main>
      <footer className="footer footer-center p-12 bg-base-200 text-base-content mt-auto mx-auto">
        <div>
          <p>Copyright © 2025 - pdffaktura.dk</p>
          {/* hjemmeside lavet af enevoldsen.io */}
          <p className="text-neutral/60 text-xs mt-4">
            Siden er udviklet af{" "}
            <a
              href="https://chrs.gg?ref=pdffaktura"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              enevoldsen.io
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
