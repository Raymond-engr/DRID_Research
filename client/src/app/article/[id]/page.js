"use client";

import { useState, useEffect } from "react";
import { articlesApi, articleViewsApi, facultyApi } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Eye, Calendar, User, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

export default function ArticleDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleData = await articlesApi.getArticle(id);
        setArticle(articleData);

        // Record a view for this article
        await articleViewsApi.recordView(id);

        if (articleData.faculty) {
          try {
            const response = await facultyApi.getFacultyById(
              articleData.faculty
            );
            if (response && response.data) {
              setFaculty(response.data);
            } else {
              console.error("Faculty response is invalid:", response);
              setFaculty(null);
            }
          } catch (facultyError) {
            console.error("Error fetching faculty:", facultyError);
            setFaculty(null);
          }
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(
          "Failed to load article. It may have been removed or you don't have permission to view it."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error || "Article not found"}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          Return Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-fuchsia-900">
        {article.title}
      </h1>

      <div className="flex flex-wrap gap-3 mb-6 text-sm text-gray-600">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          <span>By {article.owner?.username || "Anonymous"}</span>
        </div>

        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date(article.publish_date).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          <span>{article.views?.count || 0} views</span>
        </div>

        <span>
          Category:{" "}
          <Link
            href={`/${article.category.toLowerCase()}`}
            className="font-bold hover:text-fuchsia-400"
          >
            {article.category}
          </Link>
        </span>

        {article.department && (
          <span>Department: {article.department.title || "Unknown"}</span>
        )}

        {article.faculty && <span>Faculty: {faculty?.title || "Unknown"}</span>}
      </div>

      {article.cover_photo && (
        <div className="mb-8">
          <Image
            src={getImageUrl(article.cover_photo)}
            alt={`Cover image for ${article.title}`}
            className="w-full h-auto rounded-lg object-cover max-h-96"
            width={1200}
            height={500}
          />
        </div>
      )}

      <div className="prose max-w-none">
        {/* Display article content with proper formatting */}
        <div
          dangerouslySetInnerHTML={{
            __html: article.content.replace(/\n/g, "<br/>"),
          }}
        ></div>
      </div>

      {article.contributors && article.contributors.length > 0 && (
        <div className="mt-12 border-t pt-6">
          <h3 className="text-xl font-semibold text-fuchsia-900 mb-4">
            Contributors
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.contributors.map((contributor) => (
              <div
                key={contributor._id}
                className="flex items-center p-4 border rounded-lg"
              >
                {contributor.profile_image ? (
                  <Image
                    src={getImageUrl(contributor.profile_image)}
                    alt={contributor.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                )}

                <div>
                  <h4 className="font-medium">
                    {contributor.name || contributor.username}
                  </h4>
                  <p className="text-sm text-gray-600">{contributor.email}</p>
                  {contributor.bio && (
                    <p className="text-sm mt-1 text-gray-700 line-clamp-2">
                      {contributor.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
