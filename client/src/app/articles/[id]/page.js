'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';

const ArticlePage = () => {
  const params = useParams();
  const articleId = params?.id;

  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Simulate fetching article by ID
    const fetchedArticle = {
      id: articleId,
      title: 'Innovating for Local Impact',
      category: 'development',
      faculty: 'Faculty of Engineering',
      department: 'Mechanical Engineering',
      contributors: ['Dr. Jane Doe', 'Prof. John Smith'],
      coverPhoto: '/images/sample-cover.jpg',
      body: `At the University of Benin, research is deeply linked with action. This article explores...`,
      topArticles: [
        {
          id: 'top1',
          title: 'Harnessing AI for Sustainable Agriculture',
          image: '/images/agriculture.jpg',
        },
        {
          id: 'top2',
          title: 'Water Purification Innovation Wins Award',
          image: '/images/water.jpg',
        },
      ],
      relatedArticles: [
        {
          id: 'rel1',
          title: 'Clean Energy Startups from UNIBEN',
          image: '/energy.jpg',
          description : "Description",
          category : "development"
        },
        {
          id: 'rel2',
          title: 'UNIBEN Leads Climate Resilience Research',
          image: '/climate.jpg',
          description : "Description",
          category : "development"
        },
      ],
    };

    setArticle(fetchedArticle);
  }, [articleId]);

  if (!article) return <div className="p-8">Loading...</div>;

  return (
    <>
    <Header />
    <div className="py-16 px-4 md:px-20">
      <h1 className="text-3xl font-bold text-fuchsia-900 mb-4">{article.title}</h1>
      <div className="text-sm text-gray-600 mb-6">
        <span className="mr-4">Category: <Link href={`/${article.category}`} className='font-bold hover:text-fuchsia-400'>{article.category}</Link></span>
        <span className="mr-4">Faculty: {article.faculty}</span>
        <span>Department: {article.department}</span>
      </div>

      <Image
        src={article.coverPhoto}
        alt="Cover Photo"
        width={1200}
        height={500}
        className="w-full h-64 object-cover rounded-xl mb-8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <article className="prose max-w-none">
            <p>{article.body}</p>
          </article>
            <div className="mt-12 text-sm text-gray-700">
                <strong>Contributors:</strong> {article.contributors.join(', ')}
            </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-fuchsia-900 mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {article.relatedArticles.map((rel) => (
                <Link href={"/articles/" + rel.id} key={rel.id} className="bg-white shadow rounded-lg overflow-hidden block relative">
                  <div className="absolute top-2 left-2 bg-fuchsia-900 text-white text-xs font-bold px-2 py-1 rounded uppercase z-10">
                    {rel.category}
                  </div>
                  <Image
                    src={rel.image}
                    alt={rel.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-fuchsia-900">{rel.title}</h3>
                    <p className='text-xs text-gray-600'>{rel.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-fuchsia-900 mb-4">Top Articles</h2>
          <div className="space-y-6">
            {article.topArticles.map((top) => (
              <Link href={"/articles/" + top.id} key={top.id} className="bg-white shadow rounded-lg overflow-hidden block">
                <Image
                  src={top.image}
                  alt={top.title}
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-md font-medium text-fuchsia-900">{top.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
    <Footer />
    </>
  );
};

export default ArticlePage;
