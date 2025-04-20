"use client";
import Image from "next/image";
import Header from "@/components/header";
import Link from "next/link";
import {
  Microscope,
  FlaskConical,
  BookOpenCheck,
  Brain,
  Layers,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <div className="w-full h-max min-h-10/12 text-white bg-gray-800 bg-[url('/hero-main.png')] bg-no-repeat bg-cover bg-center">
        <div className="w-full h-full backdrop-blur-xs py-16 md:py-24 xl:py-36 px-4 text-center">
          <h1 className="text-4xl font-bold mb-6 md:mb-8 md:text-6xl">
            Advancing Knowledge.
            <br />
            Fueling Innovation.
            <br />
            Driving Development.
          </h1>
          <p className="text-lg mb-6">
            At the Department of Research, Innovation, and Development, we
            empower bold ideas, support pioneering research, and create
            solutions that shape tomorrow.
          </p>
          <p className="text-base italic mb-8">
            Explore how we lead breakthroughs in science, technology, and
            societal transformation.
          </p>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 justify-center items-center space-x-0">
            <Link
              href="/research"
              className="w-max shadow-md bg-fuchsia-900 hover:bg-fuchsia-800 transition-colors text-white font-semibold py-2 md:py-4 px-4 rounded-full flex justify-between space-x-1"
            >
              <BookOpenCheck /> <span>Explore Research</span>
            </Link>
            <Link
              href="/innovation"
              className="w-max shadow-md bg-fuchsia-900 hover:bg-fuchsia-800 transition-colors text-white font-semibold py-2 md:py-4 px-4 rounded-full flex justify-between space-x-1"
            >
              <Brain /> <span>Discover Innovation</span>
            </Link>
            <Link
              href="/development"
              className="w-max shadow-md bg-fuchsia-900 hover:bg-fuchsia-800 transition-colors text-white font-semibold py-2 md:py-4 px-4 rounded-full flex justify-between space-x-1"
            >
              <Layers /> <span>Drive Development</span>
            </Link>
          </div>
        </div>
      </div>
      <main className="w-full bg-[url('/white-detail.png')] bg-no-repeat bg-fixed bg-cover bg-center">
        <section className="w-full px-4 md:px-[150px] py-10 md:py-20">
          <div className="h-1 w-40 bg-black mb-5"></div>
          <h2 className="text-xl md:text-3xl text-fuchsia-900 font-bold">
            Advancing Research for Sustainable Development at the University of
            Benin
          </h2>
          <div className="w-full py-4 px-2 md:px-6 rounded-sm bg-gray-200/80 my-10 text-gray-900">
            <p className="mb-5">
              Following the adoption of the United Nations Sustainable
              Development Goals (SDGs) in 2015 and the African Union’s Agenda
              2063, the University of Benin (UNIBEN) began a progressive
              alignment of its research priorities to these global and
              continental development frameworks. Over the years, our
              researchers and faculties have continued to respond to the urgent
              need for innovative, context-driven research that directly
              addresses Nigeria’s and Africa’s most pressing challenges.
            </p>
            <p className="mb-5">
              UNIBEN’s interdisciplinary research culture is grounded in
              practical engagement with societal issues such as environmental
              degradation, public health, poverty alleviation, gender equity,
              responsible governance, and sustainable livelihoods. Several of
              our academic leaders and research teams have been actively
              contributing to national and regional policy dialogues, supporting
              implementation of climate action strategies, and promoting
              inclusive education and justice – all of which are central to the
              SDGs.
            </p>
            <p className="mb-5">
              Notably, the Directorate of Research, Innovation, and Development
              (DRID) has taken a lead role in mainstreaming the SDGs into our
              research governance. This includes encouraging grant-winning
              proposals that explicitly link to one or more of the goals,
              strengthening partnerships with government, civil society, and the
              private sector, and developing a research repository that
              highlights SDG-focused outputs. Collaborations with international
              development agencies, including the African Development Bank,
              UNDP, and the Green Climate Fund, have enabled our scholars to
              make practical contributions to sustainable development in Nigeria
              and the wider West African sub-region.
            </p>
            <p className="mb-5">
              Our efforts are also aligned with the African Union’s Agenda 2063
              – “The Africa We Want.” UNIBEN has contributed to regional efforts
              on climate security in the Sahel, sustainable agriculture, and
              youth capacity development, in line with the aspirations of a
              prosperous, integrated, and peaceful Africa. Our participation in
              cross-border research on transboundary eco-security, food systems
              transformation, and digital innovation showcases our commitment to
              locally relevant, globally informed scholarship.
            </p>
            <p className="mb-5">
              A university rooted in the heart of Benin City, UNIBEN recognizes
              its responsibility to lead by example. We have taken steps to
              promote environmental sustainability across our campus, including
              the integration of renewable energy solutions, improved waste
              management systems, and the promotion of sustainability literacy
              through student-led initiatives. Plans are also underway to
              develop a formal environmental sustainability framework in line
              with national and international benchmarks.
            </p>
            <p className="mb-5">
              Through our Vision 2025 and beyond, the University of Benin is
              strengthening its role as a knowledge institution committed to
              solving real-world problems and nurturing research that is
              impactful, inclusive, and transformative. Our motto, “Knowledge
              for Service,” resonates now more than ever, as we work to ensure
              that our research outcomes contribute meaningfully to the SDGs and
              a more just and resilient society.
            </p>
          </div>
          <div className="h-1 w-1/3 bg-black mt-5 place-self-end"></div>
        </section>
        <section className="w-full bg-white px-4 md:px-[250px] py-10 md:py-20">
          <div className="w-full h-max min-h-56 flex md:flex-row flex-col-reverse space-x-0 space-y-4 md:space-y-0 md:space-x-6 md:justify-between md:items-start rounded-lg bg-black p-3 md:p-6 md:px-16">
            <div className="w-full h-max md:w-1/2 text-white mt-2 md:mt-0">
              <h2 className="text-2xl md:text-4xl font-bold">
                <span className="text-base text-fuchsia-600 block">
                  UNIBEN Research:
                </span>
                <span className="block mt-2">
                  Cultivating Excellence, Driving Development
                </span>
              </h2>
              <p className="mt-6">
                At the University of Benin, research is more than a mandate—it
                is a mission. As a powerhouse of innovation, UNIBEN is home to a
                vibrant and growing community of researchers who are unlocking
                solutions to some of Africa’s most complex and urgent
                challenges. Whether addressing national security through public
                policy reform or advancing biotechnology in agriculture, our
                scholars are creating knowledge that matters.
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/research-news"
                      className="w-max block text-center text-base px-3 py-2 md:px-5 rounded-full border-2 border-solid mt-8 hover:bg-fuchsia-900"
                    >
                      LEARN MORE
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>READ MORE ON OUR RESEARCH NEWS PAGE</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-full h-full md:w-1/2">
              <Image
                src={"/research-news.jpeg"}
                alt="Research news Illustration"
                title="Research news illustration"
                width={150}
                height={150}
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
        <section
          id="partnership"
          className="w-full bg-gray-800 bg-[url('/partnership-landing-page.jpeg')] bg-fixed bg-no-repeat bg-cover bg-center"
        >
          <div className="w-full h-full backdrop-blur-xs px-4 md:px-[150px] py-10 md:py-20 text-white text-center">
            <p className="text-base md:text-lg font-medium">
              Connecting Ideas. Catalyzing Innovation. Driving Development.
            </p>
            <h2 className="text-2xl md:text-4xl font-bold uppercase mt-6">
              Global Research Partnerships
            </h2>
            <p className="text-base md:text-lg font-medium mt-6">
              At the University of Benin, we collaborate across continents to
              co-create solutions that are locally rooted and globally relevant.
              Our partnerships span Africa, Europe, and the United
              States—bridging knowledge, empowering people, and shaping the
              future.
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/partnerships"
                    className="w-max block mx-auto text-center text-base px-3 py-2 md:px-5 rounded-full border-2 border-solid mt-8 hover:bg-fuchsia-900"
                  >
                    PARTNERSHIPS
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>READ MORE ON PARTNERSHIPS</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>
        <section className="bg-gray-50 py-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Research Hubs and Centres of Excellence
            </h2>
            <p className="text-lg text-gray-700 mt-2">
              Driving Change Through Collaborative, Thematic, and
              Impact-Oriented Research
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-md text-left">
              <p className="text-gray-700 leading-relaxed">
                At the University of Benin, research is organized through an
                evolving network of faculties, departments, dedicated research
                centres, centres of excellence, and interdisciplinary clusters.
                These formal groupings serve as intellectual engines—bringing
                together a critical mass of scholars, students, and industry
                partners to co-create solutions for Nigeria, Africa, and the
                world.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-left">
              <p className="text-gray-700 leading-relaxed">
                Whether focused on advancing biotechnology, climate security,
                health systems, or legal reform, UNIBEN’s research hubs serve as
                catalysts for innovation and development.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-left">
              <p className="text-gray-700 leading-relaxed">
                Many of these centres engage actively in policy advisory,
                entrepreneurship, community-based innovation, and donor-funded
                consortia, creating strong linkages between research and
                real-world impact.
              </p>
            </div>
          </div>
        </section>
        <section className="bg-white py-16 px-4 md:px-20" id="innovation">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Innovation at UNIBEN
              </h2>
              <h3 className="text-xl font-semibold text-fuchsia-600 mb-6">
                Where Ideas Take Root and Grow into Solutions
              </h3>
              <p className="text-gray-700 mb-4">
                At the University of Benin, innovation is not an afterthought—it
                is an embedded culture. Fuelled by a vibrant mix of academic
                rigor, creative talent, and a strong spirit of enterprise,
                UNIBEN is emerging as a launchpad for problem-solvers,
                changemakers, and next-generation innovators.
              </p>
              <p className="text-gray-700 mb-4">
                From AI-powered healthcare solutions and real estate platforms,
                to agro-digital tools, logistics services, and entrepreneurship
                networks, UNIBEN students and recent graduates are building
                startups that respond to real market needs—while staying true to
                the university’s ethos of Knowledge for Service.
              </p>
              <Link
                href="/innovation"
                className="inline-block mt-6 bg-fuchsia-900 text-white px-6 py-3 rounded-full shadow-md hover:bg-fuchsia-700 transition"
              >
                Explore Innovation at UNIBEN
              </Link>
            </div>

            {/* Image */}
            <div className="w-full h-full">
              <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/innovation-home.jpeg"
                  alt="UNIBEN students collaborating on innovation projects"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
        <div className="h-24 bg-gray-800 w-2 mx-auto" />

        <section className="bg-amber-50 py-16 px-4 md:px-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              UNIBEN Research Publications
            </h2>
            <p className="text-gray-800 text-lg mb-6 leading-relaxed">
              From groundbreaking academic journals to policy briefs and
              innovation reports, UNIBEN is committed to shaping scholarship,
              informing policy, and deepening impact through rigorous and
              accessible research.
            </p>
            <Link
              href="/research"
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-full font-medium shadow hover:bg-gray-700 transition-all duration-200"
            >
              Explore Research Publications →
            </Link>
          </div>

          {/* Image */}
          <div className="relative h-64 w-full">
            <Image
              src="/publications.jpeg"
              alt="UNIBEN Research Engagement"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </section>
        <div className="h-24 bg-gray-800 w-24 ml-10" />
        <section className="bg-gray-50 py-16 px-4 md:px-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              Research-Driven Development
            </h2>
            <p className="text-gray-800 text-lg mb-6 leading-relaxed">
              At UNIBEN, research drives progress. From shaping policy to
              building industries, our scholars are turning ideas into solutions
              that change lives, strengthen systems, and grow communities.
            </p>
            <Link
              href="/development"
              className="inline-block bg-amber-800 text-white px-6 py-3 rounded-full font-medium shadow hover:bg-amber-700 transition-all duration-200"
            >
              Learn More →
            </Link>
          </div>

          {/* Image */}
          <div className="relative h-64 w-full">
            <Image
              src="/development-hero.jpeg"
              alt="UNIBEN Research in Action"
              fill
              className="object-cover rounded-xl shadow"
            />
          </div>
        </section>
        <section className="bg-blue-50 py-16 px-4 md:px-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-800" />

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-fuchsia-900">
              At UNIBEN, Research drives Development—
              <br className="hidden md:block" />
              <span className="text-fuchsia-600">
                not by accident, but by Innovative design.
              </span>
            </h2>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
