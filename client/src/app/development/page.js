"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/header";
import Link from "next/link";
import Footer from "@/components/footer";
import { articlesApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

export default function DevelopmentPage() {
  const [developmentArticles, setDevelopmentArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const fetchDevelopmentArticles = async () => {
      try {
        const filters = {
          category: "Development",
        };
        const articles = await articlesApi.getArticles(filters);
        setDevelopmentArticles(articles.slice(0, 3)); // Get first 3 articles
      } catch (error) {
        console.error("Error fetching development articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchDevelopmentArticles();
  }, []);

  return (
    <main className="bg-white text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/development-hero.jpeg" // Replace with appropriate image
          alt="Research-Driven Development"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 backdrop-blur-xs">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            Research-Driven Development at UNIBEN
          </h1>
          <p className="text-white mt-4 text-lg md:text-xl max-w-2xl">
            Transforming Knowledge Into Progress
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-20 py-16 space-y-8 max-w-5xl mx-auto">
        <p>
          At the University of Benin, research is more than an academic
          endeavor—it is a strategic engine for development. Rooted in the
          university’s founding vision of Knowledge for Service, UNIBEN is
          committed to harnessing research to address the pressing challenges of
          society, shape national policy, build local industries, and improve
          lives.
        </p>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          Influencing Policy and Governance
        </h2>
        <p>
          UNIBEN researchers play a prominent role in policy formulation, legal
          reform, and governance innovation. Through commissioned studies,
          technical reports, and advisory services, the university contributes
          to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            National legislation on environment, health, education, and justice
          </li>
          <li>State-level development planning and budgeting frameworks</li>
          <li>
            International treaty interpretation and regional security governance
          </li>
          <li>
            Climate change and natural resource management policies across West
            Africa
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          Building Human Capital and Institutional Capacity
        </h2>
        <p>
          UNIBEN’s research supports postgraduate training, research mentorship,
          and fieldwork experiences that equip a new generation of researchers,
          civil servants, and entrepreneurs. From our law clinic and
          entrepreneurship centre to research in agriculture, medicine, and
          technology, we ensure that learning translates into leadership.
        </p>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          Supporting Livelihoods, Health, and the Environment
        </h2>
        <p>
          UNIBEN’s applied research enhances public health, food security, and
          environmental sustainability. Our researchers are:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Developing eco-friendly agricultural practices and post-harvest
            solutions
          </li>
          <li>
            Strengthening public health systems through disease mapping and
            intervention studies
          </li>
          <li>
            Offering legal, medical, and environmental support to vulnerable
            populations
          </li>
          <li>
            Promoting gender equity and youth inclusion through grassroots
            action
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          Linking Innovation to Industry and Enterprise
        </h2>
        <p>
          Through CED and DRID, UNIBEN is commercializing innovations, fostering
          industry-academic partnerships, and driving enterprise growth via:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Startup incubation and product development</li>
          <li>Patent support and commercialization of research</li>
          <li>Collaborative problem-solving with industry</li>
        </ul>

        <h2 className="text-2xl font-semibold text-fuchsia-700">
          A Catalyst for Regional and National Development
        </h2>
        <p>
          From national development plans to climate security and inclusive
          education, UNIBEN demonstrates that universities can be powerful
          agents of transformation.
          <br />
          <strong>
            “At UNIBEN, research drives development—not by accident, but by
            design.”
          </strong>
        </p>
      </section>

      {/* CTA Section */}
      <section className="bg-fuchsia-900 py-10 px-6 md:px-20 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Discover Our Development Impact
        </h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Learn more about how UNIBEN research is shaping policy, improving
          livelihoods, and advancing innovation across Nigeria and beyond.
        </p>
        <Link
          href="#articles"
          className="bg-white text-fuchsia-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Explore Development Stories
        </Link>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-16 px-6 md:px-20 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">
          UNIBEN Development Articles
        </h3>

        {loadingArticles ? (
          <div className="text-center">Loading development articles...</div>
        ) : developmentArticles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {developmentArticles.map((article) => (
              <div
                key={article._id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white"
              >
                {article.cover_photo && (
                  <Image
                    src={getImageUrl(article.cover_photo)}
                    alt={article.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{article.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    {article.summary}
                  </p>
                  <Link
                    href={`/articles/${article._id}`}
                    className="text-fuchsia-600 text-sm font-medium mt-3 inline-block"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No development articles available at the moment.</p>
            <p className="mt-2">Check back soon for updates!</p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
