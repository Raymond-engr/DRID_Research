import Header from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className="w-full h-max bg-black text-white py-16 md:py-24 px-4 text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Advancing Knowledge. Fueling Innovation. Driving Development.
          </h1>
          <p className="text-lg mb-6">
            At the Department of Research, Innovation, and Development, we
            empower bold ideas, support pioneering research, and create
            solutions that shape tomorrow.
          </p>
          <p className="text-sm italic mb-8">
            Explore how we lead breakthroughs in science, technology, and
            societal transformation.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/research"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
            >
              🔬 Explore Research
            </Link>
            <Link
              href="/innovation"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
            >
              💡 Discover Innovation
            </Link>
            <Link
              href="/development"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
            >
              🚀 Drive Development
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
