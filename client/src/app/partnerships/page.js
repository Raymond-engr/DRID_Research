"use client";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Partnerships() {
  return (
    <>
      <Header />
      <div className="w-full h-max min-h-auto text-white bg-gray-800 bg-[url('/partnership-landing-page.jpeg')] bg-no-repeat bg-cover bg-center">
        <div className="w-full h-full backdrop-blur-xs py-16 md:py-24 xl:py-36 px-4 text-center">
          <h1 className="text-4xl font-bold mb-6 md:mb-8 md:text-6xl">
            Global Research Partnerships
          </h1>
          <p className="text-lg italic">
            Connecting Ideas. Catalyzing Innovation. Driving Development.
          </p>
        </div>
      </div>
      <main className="w-full bg-white">
        <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-fuchsia-700">
            At the University of Benin
          </h2>
          <p className="text-base md:text-lg">
            At the University of Benin, we believe that solving global
            challenges requires global collaboration. Through dynamic research
            partnerships that span Africa, Europe, the United States, and the
            private sector, UNIBEN is positioning itself as a vital bridge
            between knowledge systems, development needs, and innovation
            ecosystems.
          </p>
          <p className="text-base md:text-lg">
            Our research collaborations are designed to co-create solutions that
            are locally grounded, continentally relevant, and globally
            significant.
          </p>
        </section>
        <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-fuchsia-700">
            Why Partner with UNIBEN?
          </h2>
          <p className="text-base md:text-lg">
            UNIBEN is one of Nigeria’s most respected and research-active
            universities—home to a multidisciplinary network of scholars engaged
            in high-impact work. Our location in West Africa gives partners
            access to rich fieldwork contexts, diverse research expertise, and a
            strong institutional commitment to service and social innovation.
          </p>
          <p className="text-base md:text-lg">
            We provide a platform for equitable partnerships, grounded in shared
            goals, transparency, and mutual benefit. Whether you are a
            university, donor agency, policy think tank, or private enterprise,
            UNIBEN offers you access to both deep research capability and a
            trusted institutional base.
          </p>
        </section>
        <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-fuchsia-700">
            Our Continental and Global Networks
          </h2>
          <p className="text-base md:text-lg">
            Across Africa, UNIBEN works with universities and research
            institutions to tackle continental priorities—from food security to
            governance, youth employment, digital transformation, and
            peacebuilding. These partnerships amplify African knowledge and
            ensure that solutions reflect the lived realities of our people.
          </p>
          <p className="text-base md:text-lg">
            In the United States, our growing collaboration with institutions
            like Northeastern University’s School of Public Policy and Urban
            Affairs is enabling joint research on climate justice, circular
            economies, and sustainable trade. These engagements foster
            north-south dialogue while nurturing young researchers across both
            contexts.
          </p>
          <p className="text-base md:text-lg">
            In Europe, partnerships with institutions such as Aix-Marseille
            University (AMU), France, and other EU-based networks are helping
            UNIBEN researchers access platforms for innovation funding,
            mobility, and multi-country consortium projects. These relationships
            are expanding our footprint across Horizon Europe and other
            collaborative research frameworks.
          </p>
          <p className="text-base md:text-lg">
            With Industry, we are strengthening ties with development-focused
            companies, professional bodies, and research-driven enterprises to
            ensure that knowledge meets application. These linkages help bridge
            the gap between innovation and impact—particularly in energy,
            agriculture, public health, environmental systems, and digital
            governance.
          </p>
        </section>
        <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-fuchsia-700">
            Joint Research, Shared Growth
          </h2>
          <p className="text-base md:text-lg">
            UNIBEN partners participate in joint research programmes, staff and
            student exchange, co-supervision, policy consultation, and capacity
            development projects. These collaborations are not just
            academic—they are purpose-driven, people-centered, and poised to
            shape Africa’s knowledge future.
          </p>
          <blockquote className="border-l-4 border-default pl-4 italic text-base md:text-lg">
            “When we partner, we do not just share knowledge—we multiply its
            potential.”
          </blockquote>
        </section>
        <Footer />
      </main>
    </>
  );
}