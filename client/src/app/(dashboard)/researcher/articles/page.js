"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { researcherDashboardApi } from "@/lib/api";
import { withResearcherAuth } from "@/lib/auth";
import {
  FileText,
  RefreshCw,
  Calendar,
  Eye,
  Filter,
  Search,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";

function ResearcherArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await researcherDashboardApi.getProfile();
        if (response?.data?.articles) {
          setArticles(response.data.articles);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(
              response.data.articles.map((article) => article.category)
            ),
          ].filter(Boolean);

          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles based on search term and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "" || article.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

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
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">My Articles</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
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
                  <div className="flex flex-wrap justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-1 mb-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.publish_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 mb-2">
                      <Eye className="h-3 w-3" />
                      {article.views?.count || 0} views
                    </span>
                    {article.category && (
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <Tag className="h-3 w-3" />
                        {article.category}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory
                ? "No articles match your search criteria."
                : "You haven't published any articles yet."}
            </p>
            {(searchTerm || filterCategory) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default withResearcherAuth(ResearcherArticlesPage);
