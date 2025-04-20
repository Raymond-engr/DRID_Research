"use client";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ResearchNews() {
  return (
    <>
      <Header />
      <div className="w-full h-max min-h-auto text-white bg-gray-800 bg-[url('/research-news-hero.jpeg')] bg-no-repeat bg-cover bg-center">
        <div className="w-full h-full backdrop-blur-xs py-16 md:py-24 xl:py-36 px-4 text-center">
          <h1 className="text-4xl font-bold mb-6 md:mb-8 md:text-6xl">
            UNIBEN Research: <br />
            Cultivating Excellence, Driving Development
          </h1>
          <p className="text-lg italic">
            Explore how our research is shaping the future and driving
            innovation.
          </p>
        </div>
      </div>
      <main className="w-full bg-white">
        <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-fuchsia-700 mb-6">
            Powered by People, Driven by Purpose
          </h2>
          <p className="text-base md:text-lg mb-4">
            The strength of UNIBEN’s research lies in the hands of its committed
            and visionary faculty. Across faculties and disciplines, researchers
            are working at the cutting edge of fields that are key to Nigeria&apos;s
            and Africa’s future.
          </p>
          <p className="text-base md:text-lg mb-4">
            From climate change adaptation and public health systems, to genomic
            research, digital innovation, peace and conflict studies, renewable
            energy, and inclusive governance, UNIBEN’s research themes are
            aligned with global and continental priorities—including the United
            Nations Sustainable Development Goals (SDGs) and the African Union
            Agenda 2063.
          </p>
          <p className="text-base md:text-lg mb-4">
            Examples of this work can be seen in current innovations in genetic
            research for agricultural improvement, national security analysis
            through legal and political frameworks, and engineering solutions
            tailored to Nigeria’s infrastructure needs. Faculty members are
            increasingly producing globally recognized research, leading
            national conversations, and building collaborative pathways that
            bridge science, society, and policy.
          </p>
        </section>
        <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-fuchsia-700 mb-6">
            Research with Real-World Results
          </h2>
          <ul className="list-disc pl-5 space-y-4">
            <li>
              <strong>Policy Impact:</strong> Several research projects have
              informed state and national government strategies in areas like
              education reform, environmental law, health policy, and conflict
              resolution.
            </li>
            <li>
              <strong>Community Engagement:</strong> Research extends into
              communities through participatory approaches—addressing real needs
              in livelihoods, sanitation, agriculture, youth empowerment, and
              more.
            </li>
            <li>
              <strong>Industry Application:</strong> From water purification
              technologies to drug development, innovations developed at UNIBEN
              are responding to market demands and industrial gaps.
            </li>
            <li>
              <strong>Infrastructure Development:</strong> Engineering and
              environmental research at UNIBEN has contributed to practical
              infrastructure design and optimization.
            </li>
            <li>
              <strong>Commercialisation and Entrepreneurship:</strong> The
              university, in partnership with the Centre for Entrepreneurship
              Development, is turning research into enterprise.
            </li>
          </ul>
        </section>
        <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-fuchsia-700 mb-6">
            A Thriving Grant-Winning Culture
          </h2>
          <p className="text-base md:text-lg mb-4">
            UNIBEN is experiencing growing success in securing high-profile,
            competitive grants—locally and internationally. Our researchers are
            recipients of:
          </p>
          <ul className="list-disc pl-5 space-y-4">
            <li>TETFund Institution-Based Research (IBR) Grants</li>
            <li>TETFund National Research Fund (NRF) Grants</li>
            <li>European Union-funded collaborations</li>
            <li>African Development Bank (AfDB) research partnerships</li>
            <li>Grants from the United Nations Development Programme (UNDP)</li>
            <li>Funding from the World Bank</li>
            <li>Climate-focused support from the Green Climate Fund</li>
            <li>
              Innovation and impact-oriented awards from the Robert Bosch
              Stiftung
            </li>
          </ul>
        </section>
        <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-fuchsia-700 mb-6">
            Visibility with Purpose
          </h2>
          <p className="text-base md:text-lg mb-4">
            UNIBEN’s researchers are making their mark on the global academic
            stage. Faculty members maintain active and visible profiles across
            high-impact platforms such as Google Scholar, Scopus, ResearchGate,
            and LinkedIn—elevating the university’s international presence and
            expanding its collaborative reach.
          </p>
          <p className="text-base md:text-lg mb-4">
            Through indexed publications, policy citations, and keynote
            participation in international conferences, UNIBEN’s researchers are
            positioning the university as a thought leader—producing knowledge
            that travels, influences, and transforms.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}