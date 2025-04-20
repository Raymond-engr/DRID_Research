"use client";
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function InnovationPage() {
  return (
    <main className="bg-white text-gray-800">
        <Header />
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/innovation-home.jpeg" // Replace with your hero image
          alt="Innovation at UNIBEN"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 backdrop-blur-xs">
          <h1 className="text-white text-4xl md:text-5xl font-bold">Innovation at UNIBEN</h1>
          <p className="text-white mt-4 text-lg md:text-xl max-w-2xl">
            Where Ideas Take Root and Grow into Solutions
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
        <p>
          At the University of Benin, innovation is not an afterthought—it is an embedded culture.
          Fuelled by a vibrant mix of academic rigor, creative talent, and a strong spirit of
          enterprise, UNIBEN is emerging as a launchpad for problem-solvers, changemakers, and
          next-generation innovators.
        </p>
        <p>
          From AI-powered healthcare solutions and real estate platforms, to agro-digital tools,
          logistics services, and entrepreneurship networks, UNIBEN students and recent graduates are
          building startups that respond to real market needs—while staying true to the university’s
          ethos of Knowledge for Service.
        </p>

        <h2 className="text-2xl font-semibold text-fuchsia-700">Turning Research into Real-World Impact</h2>
        <p>
          Through innovation-focused support systems, UNIBEN is helping young entrepreneurs translate
          classroom knowledge into market-ready solutions. These innovations span diverse industries:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>HealthTech:</strong> Artificial intelligence is being used to create mobile-first diagnostic
            tools for underserved populations.
          </li>
          <li>
            <strong>AgriTech & Aquaculture:</strong> Students are building ventures that support fish farming
            sustainability and digital access for farmers.
          </li>
          <li>
            <strong>Logistics & E-Commerce:</strong> Courier and delivery apps are solving urban mobility gaps,
            including in underserved communities.
          </li>
          <li>
            <strong>Digital Real Estate:</strong> Platforms are connecting property seekers with verified
            listings and agents, reducing fraud and inefficiency.
          </li>
          <li>
            <strong>Skill Development & EdTech:</strong> WhatsApp-powered micro-learning platforms are teaching
            financial literacy and business skills to youth across Nigeria.
          </li>
          <li>
            <strong>Creative Industries & Media:</strong> Photography and digital content startups are gaining
            traction through storytelling and brand building.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-fuchsia-700">UNIBEN’s Innovation Ecosystem at a Glance</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>A growing pipeline of student-led and faculty-driven startups</li>
          <li>Multiple ventures in proof-of-concept, MVP, and commercial growth stages</li>
          <li>
            Support from the Centre for Entrepreneurship Development (CED) and the Directorate of
            Research, Innovation, and Development (DRID)
          </li>
          <li>
            Participation in external innovation challenges, grant competitions, and pre-incubation
            programmes
          </li>
          <li>A culture of peer networking, mentorship, and collaborative problem-solving</li>
        </ul>
      </section>

      {/* CTA Section */}
      <section className="bg-fuchsia-900 py-10 px-6 md:px-20 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Want to See Innovation in Action?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Explore stories, features, and case studies from student and faculty innovators making an
          impact in Nigeria and beyond.
        </p>
        <Link
          href="#innovation-articles"
          className="bg-white text-fuchsia-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Read Innovation Articles
        </Link>
      </section>

      {/* Articles Section */}
      <section id="innovation-articles" className="py-16 px-6 md:px-20 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Innovation Stories & Articles</h3>

        {/* You can dynamically render posts here */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Example Card */}
          <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white">
            <Image
              src="/images/article-sample.jpg"
              alt="Innovation article thumbnail"
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-lg">Student Startup Redefines Aquaculture</h4>
              <p className="text-sm text-gray-600 mt-2">How young innovators are using tech to improve fish farming in Nigeria.</p>
              <Link href="/articles/aquaculture-startup" className="text-fuchsia-600 text-sm font-medium mt-3 inline-block">
                Read more →
              </Link>
            </div>
          </div>

          {/* Duplicate more cards dynamically */}
        </div>
      </section>
      <Footer />
    </main>
  );
}
