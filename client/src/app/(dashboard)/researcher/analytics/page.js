"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withResearcherAuth } from "@/lib/auth";
import { researcherDashboardApi } from "@/lib/api";
import {
  RefreshCw,
  TrendingUp,
  BarChart2,
  Calendar,
  Eye,
  Filter,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

function ResearcherAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalArticles: 0,
    totalViews: 0,
    mostViewed: null,
    articlesByMonth: [],
    categoriesDistribution: [],
    viewsOverTime: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState("year"); // year, month, week

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await researcherDashboardApi.getAnalytics();
        if (response?.data) {
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Process the articlesByMonth data to have proper format for charts
  const processArticlesByMonth = () => {
    if (!analytics.articlesByMonth || analytics.articlesByMonth.length === 0) {
      return [];
    }

    return analytics.articlesByMonth.map((item) => {
      const monthName = new Date(0, item._id.month - 1).toLocaleString(
        "default",
        { month: "short" }
      );
      return {
        name: `${monthName} ${item._id.year}`,
        articles: item.count,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

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

  // Process categoryDistribution for the chart
  const categoryData =
    analytics.categoriesDistribution?.length > 0
      ? analytics.categoriesDistribution.map((cat) => ({
          name: cat._id,
          articles: cat.count,
        }))
      : [];

  // For articles by month/views over time
  const timeData = processArticlesByMonth();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Articles</p>
                <h3 className="text-3xl font-bold">
                  {analytics.totalArticles || 0}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart2 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Views</p>
                <h3 className="text-3xl font-bold">
                  {analytics.totalViews || 0}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Average Views per Article
                </p>
                <h3 className="text-3xl font-bold">
                  {analytics.totalArticles
                    ? Math.round(analytics.totalViews / analytics.totalArticles)
                    : 0}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles By Month Chart */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <CardTitle>Articles Published By Month</CardTitle>
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            {["week", "month", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setTimeFrame(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  timeFrame === period
                    ? "bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {period === "week"
                  ? "Last 7 Days"
                  : period === "month"
                    ? "Last 30 Days"
                    : "Last 12 Months"}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="h-80">
          {timeData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-gray-500">
              <Calendar className="h-12 w-12 mb-2 opacity-30" />
              <p>No article data available yet</p>
              <p className="text-sm">
                Data will appear as you publish articles
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  type="monotone"
                  dataKey="articles"
                  fill="#4F46E5"
                  stroke="#4F46E5"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Categories Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Articles by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-gray-500">
              <BarChart2 className="h-12 w-12 mb-2 opacity-30" />
              <p>No category data available</p>
              <p className="text-sm">
                Data will appear as you categorize your articles
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="articles" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Most Viewed Article */}
      {analytics.mostViewed && (
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Article</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {analytics.mostViewed.title}
                </h3>
                <div className="flex gap-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {analytics.mostViewed.views.count || 0} views
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(
                      analytics.mostViewed.publish_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Button variant="outline" asChild>
                <Link
                  href={`/article/${analytics.mostViewed._id}`}
                  key={analytics.mostViewed._id}
                  className="block"
                >
                  View Article
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default withResearcherAuth(ResearcherAnalyticsPage);
