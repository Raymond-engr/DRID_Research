"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { articlesApi, articleViewsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

const ArticlePage = () => {
  const params = useParams();
  const articleId = params?.id;
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularArticles, setPopularArticles] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    if (!articleId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const articleData = await articlesApi.getArticle(articleId);
        if (!articleData) {
          setError("Article not found");
          setLoading(false);
          return;
        }

        setArticle(articleData);

        // Record a view for this article
        try {
          await articleViewsApi.recordView(articleId);
        } catch (viewError) {
          console.error("Error recording view:", viewError);
          // Don't fail the whole page if view recording fails
        }

        // Fetch popular articles
        try {
          const popular = await articleViewsApi.getPopularArticles(2);
          if (Array.isArray(popular)) {
            setPopularArticles(popular);
          } else {
            console.error(
              "Popular articles response is not an array:",
              popular
            );
            setPopularArticles([]);
          }
        } catch (popularError) {
          console.error("Error fetching popular articles:", popularError);
          setPopularArticles([]);
        }

        // Fetch articles with the same category for related articles
        try {
          if (articleData && articleData.category) {
            const allArticles = await articlesApi.getArticles({
              category: articleData.category,
            });
            if (Array.isArray(allArticles)) {
              const related = allArticles
                .filter((art) => art._id !== articleId)
                .slice(0, 2);
              setRelatedArticles(related);
            } else {
              console.error(
                "Related articles response is not an array:",
                allArticles
              );
              setRelatedArticles([]);
            }
          }
        } catch (relatedError) {
          console.error("Error fetching related articles:", relatedError);
          setRelatedArticles([]);
        }
      } catch (err) {
        console.error("Error fetching article data:", err);
        setError(
          "Failed to load article. It may have been removed or you don't have permission to view it."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

  if (!articleId) return <div className="p-8">Invalid article ID</div>;
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <div className="p-8 max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error || "Article not found"}
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-fuchsia-900 text-white rounded hover:bg-fuchsia-800 transition flex items-center gap-2"
          >
            <span>← Back</span>
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="py-16 px-4 md:px-20">
        <h1 className="text-3xl font-bold text-fuchsia-900 mb-4">
          {article.title}
        </h1>
        <div className="text-sm text-gray-600 mb-6">
          <span className="mr-4">
            Category:{" "}
            <Link
              href={`/${article.category ? article.category.toLowerCase() : ""}`}
              className="font-bold hover:text-fuchsia-400"
            >
              {article.category || "Uncategorized"}
            </Link>
          </span>
          <span className="mr-4">
            Faculty:{" "}
            {article.faculty?.title || article.faculty?.name || "Unknown"}
          </span>
          <span>Department: {article.department?.title || "Unknown"}</span>
        </div>

        {article.cover_photo && (
          <Image
            src={getImageUrl(article.cover_photo)}
            alt="Cover Photo"
            width={1200}
            height={500}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: article.content
                    ? article.content.replace(/\n/g, "<br/>")
                    : "",
                }}
              ></div>
            </article>

            {article.contributors && article.contributors.length > 0 && (
              <div className="mt-12 text-sm text-gray-700">
                <strong>Contributors:</strong>{" "}
                {article.contributors
                  .map((c) => c.name || c.username)
                  .join(", ")}
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-fuchsia-900 mb-4">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((rel) => (
                    <Link
                      href={`/articles/${rel._id}`}
                      key={rel._id}
                      className="bg-white shadow rounded-lg overflow-hidden block relative"
                    >
                      <div className="absolute top-2 left-2 bg-fuchsia-900 text-white text-xs font-bold px-2 py-1 rounded uppercase z-10">
                        {rel.category}
                      </div>
                      {rel.cover_photo && (
                        <Image
                          src={getImageUrl(rel.cover_photo)}
                          alt={rel.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-fuchsia-900">
                          {rel.title}
                        </h3>
                        <p className="text-xs text-gray-600">{rel.summary}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-fuchsia-900 mb-4">
              Top Articles
            </h2>
            {popularArticles.length > 0 ? (
              <div className="space-y-6">
                {popularArticles.map((top) => (
                  <Link
                    href={`/articles/${top._id}`}
                    key={top._id}
                    className="bg-white shadow rounded-lg overflow-hidden block"
                  >
                    {top.cover_photo && (
                      <Image
                        src={getImageUrl(top.cover_photo)}
                        alt={top.title}
                        width={400}
                        height={200}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-md font-medium text-fuchsia-900">
                        {top.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No popular articles found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArticlePage;
