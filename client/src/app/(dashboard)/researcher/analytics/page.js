"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { withResearcherAuth } from "@/lib/auth";
import { researcherDashboardApi } from "@/lib/api";
import { RefreshCw, TrendingUp, BarChart2, Calendar, Eye, Filter } from "lucide-react";
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from "recharts";

function ResearcherAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalArticles: 0,
    totalViews: 0,
    mostViewed: null,
    articlesByMonth: [],
    categoriesDistribution: [],
    viewsOverTime: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState("year"); // year, month, week

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
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

  // Mock data for chart visualization
  const generateMockViewsData = () => {
    const now = new Date();
    const data = [];
    
    if (timeFrame === "year") {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        data.push({
          name: date.toLocaleString('default', { month: 'short' }),
          views: Math.floor(Math.random() * 200) + 50,
        });
      }
    } else if (timeFrame === "month") {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        data.push({
          name: date.getDate().toString(),
          views: Math.floor(Math.random() * 30) + 5,
        });
      }
    } else { // week
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        data.push({
          name: date.toLocaleString('default', { weekday: 'short' }),
          views: Math.floor(Math.random() * 15) + 3,
        });
      }
    }
    
    return data;
  };

  const viewsData = analytics.viewsOverTime?.length > 0 ? 
    analytics.viewsOverTime : generateMockViewsData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Process categoryDistribution for the chart
  const categoryData = analytics.categoriesDistribution?.length > 0 
    ? analytics.categoriesDistribution.map(cat => ({
        name: cat._id,
        articles: cat.count
      }))
    : [
        { name: "Research", articles: 12 },
        { name: "Innovation", articles: 8 },
        { name: "Technology", articles: 5 },
        { name: "Education", articles: 3 }
      ];

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
                <h3 className="text-3xl font-bold">{analytics.totalArticles || 0}</h3>
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
                <h3 className="text-3xl font-bold">{analytics.totalViews || 0}</h3>
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
                <p className="text-gray-500 text-sm">Average Views per Article</p>
                <h3 className="text-3xl font-bold">
                  {analytics.totalArticles ? 
                    Math.round(analytics.totalViews / analytics.totalArticles) : 
                    0}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Views Over Time Chart */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <CardTitle>Views Over Time</CardTitle>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#4F46E5" 
                activeDot={{ r: 8 }} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Categories Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Articles by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
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
        </CardContent>
      </Card>

      {/* Most Viewed Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Most Viewed Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Article Title</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Published Date</th>
                  <th className="px-4 py-3 text-left font-medium">Views</th>
                </tr>
              </thead>
              <tbody>
                {/* Mock data - in a real app, this would come from the API */}
                {[
                  {
                    id: 1,
                    title: "Advances in Machine Learning Research",
                    category: "Research",
                    date: "2023-04-15",
                    views: 345
                  },
                  {
                    id: 2,
                    title: "Educational Technology Innovations",
                    category: "Innovation",
                    date: "2023-06-22",
                    views: 287
                  },
                  {
                    id: 3,
                    title: "The Future of Quantum Computing",
                    category: "Technology",
                    date: "2023-08-10",
                    views: 211
                  },
                  {
                    id: 4,
                    title: "Sustainable Computing Practices",
                    category: "Research",
                    date: "2023-09-05",
                    views: 189
                  },
                  {
                    id: 5,
                    title: "AI Ethics and Governance",
                    category: "Education",
                    date: "2023-11-18",
                    views: 162
                  }