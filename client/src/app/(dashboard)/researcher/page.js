"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  Eye,
  TrendingUp,
  RefreshCw,
  Calendar,
  BarChart4,
  Link as LinkIcon,
} from "lucide-react";
import { withResearcherAuth } from "@/lib/auth";
import { researcherDashboardApi } from "@/lib/api";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

function ResearcherDashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    profile: null,
    articles: [],
    collaborators: [],
    stats: {
      total_articles: 0,
      sole_author: 0,
      collaborations: 0,
    },
  });
  const [popularArticles, setPopularArticles] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalArticles: 0,
    totalViews: 0,
    mostViewed: null,
    articlesByMonth: [],
    categoriesDistribution: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearcherData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch researcher profile data (includes articles and collaborators)
        const profileResponse = await researcherDashboardApi.getProfile();

        // Fetch popular articles
        const popularResponse =
          await researcherDashboardApi.getPopularArticles(3);

        // Fetch analytics data
        const analyticsResponse = await researcherDashboardApi.getAnalytics();

        // Set state with fetched data
        if (profileResponse?.data) {
          setProfileData(profileResponse.data);
        }

        if (popularResponse?.data) {
          setPopularArticles(popularResponse.data);
        }

        if (analyticsResponse?.data) {
          setAnalytics(analyticsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching researcher data:", error);
        setError("Failed to load researcher data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearcherData();
  }, []);

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const { profile, articles, collaborators, stats } = profileData;

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight">
        Researcher Dashboard
      </h1>

      {/* Researcher Profile Summary */}
      {profile && (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                    {profile.profilePicture ? (
                      <Image
                        src={getImageUrl(profile.profilePicture)}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-center">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    {profile.title || "Researcher"}
                  </p>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    {profile.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-3/4">
            <Card>
              <CardHeader>
                <CardTitle>Research Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Articles</p>
                      <p className="text-xl font-bold">
                        {stats.total_articles || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Collaborations</p>
                      <p className="text-xl font-bold">
                        {stats.collaborations || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Eye className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Views</p>
                      <p className="text-xl font-bold">
                        {analytics.totalViews || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Published Articles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Published Articles</h2>
        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article) => (
              <Link
                href={`/article/${article._id}`}
                key={article._id}
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="aspect-video relative">
                    {article.cover_photo ? (
                      <Image
                        src={getImageUrl(article.cover_photo)}
                        alt={article.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                      {article.summary}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.publish_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views?.count || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">
                You haven&apos;t published any articles yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Most Popular Articles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Popular Articles</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Views</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Published
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {articles && articles.length > 0 ? (
                    articles
                      .sort(
                        (a, b) => (b.views?.count || 0) - (a.views?.count || 0)
                      )
                      .slice(0, 5)
                      .map((article) => (
                        <tr
                          key={article._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium">
                            {article.title}
                          </td>
                          <td className="px-4 py-3">{article.category}</td>
                          <td className="px-4 py-3">
                            {article.views?.count || 0}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(
                              article.publish_date
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/article/${article._id}`}
                              className="flex items-center text-blue-500 hover:text-blue-700"
                            >
                              <LinkIcon className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-center">
                        No articles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collaborators */}
      {collaborators && collaborators.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Collaborators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collaborators.map((collaborator) => (
              <Card key={collaborator._id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      {collaborator.profilePicture ? (
                        <Image
                          src={getImageUrl(collaborator.profilePicture)}
                          alt={collaborator.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">
                        {collaborator.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {collaborator.title || "Researcher"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {analytics.categoriesDistribution &&
        analytics.categoriesDistribution.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Research Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {analytics.categoriesDistribution.map((category) => (
                <Card key={category._id}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      {category._id}
                    </h3>
                    <div className="flex items-center">
                      <div
                        className={`h-2 rounded-full mr-2 flex-grow ${
                          category._id === "Research"
                            ? "bg-blue-500"
                            : category._id === "Innovation"
                              ? "bg-green-500"
                              : "bg-amber-500"
                        }`}
                        style={{
                          width: `${Math.max(
                            (category.count / (stats.total_articles || 1)) *
                              100,
                            5
                          )}%`,
                        }}
                      />
                      <span className="font-medium">{category.count}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

export default withResearcherAuth(ResearcherDashboard);
