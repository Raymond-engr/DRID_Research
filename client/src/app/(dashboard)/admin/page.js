"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  Eye,
  MessageSquare,
  BarChart4,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { withAdminAuth } from "@/lib/auth";
import {
  articlesApi,
  researchersApi,
  articleViewsApi,
  facultyApi,
  departmentApi,
} from "@/lib/api";

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalResearchers: 0,
    totalViews: 0,
    categoryCounts: {
      Research: 0,
      Innovation: 0,
      Development: 0,
    },
    loading: true,
  });

  const [recentArticles, setRecentArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch dashboard data from backend
        const dashboardData = await articlesApi.getDashboardData();
        const researchers = await researchersApi.getResearchers();
        const popularArticles = await articleViewsApi.getPopularArticles(5);

        // Calculate total views
        let totalViews = 0;
        if (dashboardData.recent_articles) {
          dashboardData.recent_articles.forEach((article) => {
            if (article.views && article.views.count) {
              totalViews += article.views.count;
            }
          });
        }

        setStats({
          totalArticles: dashboardData.recent_articles?.length || 0,
          totalResearchers: researchers?.length || 0,
          totalViews: totalViews,
          categoryCounts: dashboardData.category_counts || {
            Research: 0,
            Innovation: 0,
            Development: 0,
          },
          loading: false,
        });

        // Format the articles for display
        const formattedArticles =
          dashboardData.recent_articles?.map((article) => ({
            id: article._id,
            title: article.title,
            category: article.category,
            views: article.views?.count || 0,
            date: new Date(article.publish_date).toISOString().split("T")[0],
          })) || [];

        setRecentArticles(formattedArticles);

        // Format popular articles
        if (
          popularArticles &&
          popularArticles.data &&
          Array.isArray(popularArticles.data)
        ) {
          const formattedPopular = popularArticles.data.map((article) => ({
            id: article._id,
            title: article.title,
            category: article.category,
            views: article.views?.count || 0,
            date: new Date(article.publish_date).toISOString().split("T")[0],
          }));

          setPopularArticles(formattedPopular);
        } else {
          setPopularArticles([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Articles
              </p>
              <h3 className="text-2xl font-bold mt-2">{stats.totalArticles}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Researchers
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {stats.totalResearchers}
              </h3>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <h3 className="text-2xl font-bold mt-2">{stats.totalViews}</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-full">
              <Eye className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Research Articles
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {stats.categoryCounts.Research}
              </h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Articles</h2>
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
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentArticles.length > 0 ? (
                    recentArticles.map((article) => (
                      <tr
                        key={article.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium">
                          {article.title}
                        </td>
                        <td className="px-4 py-3">{article.category}</td>
                        <td className="px-4 py-3">{article.views}</td>
                        <td className="px-4 py-3">{article.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center">
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

      {/* Popular Articles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Most Popular Articles</h2>
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
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {popularArticles.length > 0 ? (
                    popularArticles.map((article) => (
                      <tr
                        key={article.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium">
                          {article.title}
                        </td>
                        <td className="px-4 py-3">{article.category}</td>
                        <td className="px-4 py-3">{article.views}</td>
                        <td className="px-4 py-3">{article.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center">
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

      {/* Category Distribution */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Category Distribution</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.entries(stats.categoryCounts).map(([category, count]) => (
            <Card key={category}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{category}</h3>
                <div className="flex items-center">
                  <div
                    className={`h-2 rounded-full mr-2 flex-grow ${
                      category === "Research"
                        ? "bg-blue-500"
                        : category === "Innovation"
                          ? "bg-green-500"
                          : "bg-amber-500"
                    }`}
                    style={{
                      width: `${Math.max(
                        (count / (stats.totalArticles || 1)) * 100,
                        5
                      )}%`,
                    }}
                  />
                  <span className="font-medium">{count}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboardPage);
