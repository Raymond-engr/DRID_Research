"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  Eye,
  AlertTriangle,
  RefreshCw,
  Calendar,
  ChevronLeft,
  LinkIcon,
} from "lucide-react";
import { authApi } from "@/lib/api";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { withAdminAuth } from "@/lib/auth";

function AdminResearcherDashboard({ params }) {
  const researcherId = params.id;
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    articles: [],
    collaborators: [],
    stats: {
      total_articles: 0,
      sole_author: 0,
      collaborations: 0,
    },
    analytics: {
      totalArticles: 0,
      totalViews: 0,
      categoriesDistribution: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearcherDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch researcher dashboard data
        const response = await authApi.getResearcherDashboard(researcherId);

        // Set state with fetched data
        if (response?.data?.data) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching researcher dashboard:", error);
        setError("Failed to load researcher dashboard. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (researcherId) {
      fetchResearcherDashboard();
    }
  }, [researcherId]);

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error handling
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Failed to load data</h3>
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { profile, articles, collaborators, stats, analytics } = dashboardData;

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()}
          className="mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {profile?.name}'s Dashboard
        </h1>
      </div>

      {/* Researcher Profile Summary */}
      {profile && (
        <div className="flex flex-col md:flex-row gap-6 items-start">
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
        <h2 className="text-xl font-semibold">Published Articles</h2>
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
                No published articles found.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Most Popular Articles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Popular Articles</h2>
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
          <h2 className="text-xl font-semibold">Collaborators</h2>
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
            <h2 className="text-xl font-semibold">Research Categories</h2>
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

export default withAdminAuth(AdminResearcherDashboard);