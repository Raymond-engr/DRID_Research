'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Users, 
  Eye, 
  MessageSquare, 
  BarChart4,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { withAdminAuth } from '@/lib/auth';
import { articlesApi, researchersApi } from '@/lib/api';

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalResearchers: 0,
    totalViews: 0,
    totalComments: 0,
    loading: true
  });

  const [recentArticles, setRecentArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, you would fetch this data from your API
        // For now, we'll use mock data
        
        const mockArticles = [
          { id: 1, title: "Advances in AI Research", category: "Research", views: 245, comments: 12, date: "2025-03-15" },
          { id: 2, title: "Blockchain Technology Applications", category: "Innovation", views: 187, comments: 8, date: "2025-03-10" },
          { id: 3, title: "Sustainable Energy Solutions", category: "Development", views: 320, comments: 15, date: "2025-03-05" },
          { id: 4, title: "Quantum Computing Breakthroughs", category: "Research", views: 156, comments: 7, date: "2025-02-28" },
          { id: 5, title: "Future of Remote Work", category: "Innovation", views: 215, comments: 19, date: "2025-02-20" }
        ];
        
        // Calculate total stats
        const totalViews = mockArticles.reduce((sum, article) => sum + article.views, 0);
        const totalComments = mockArticles.reduce((sum, article) => sum + article.comments, 0);
        
        setStats({
          totalArticles: mockArticles.length,
          totalResearchers: 8,
          totalViews,
          totalComments,
          loading: false
        });
        
        setRecentArticles(mockArticles);
        setIsLoading(false);
        
        // In a real implementation, you would fetch this data from your API like:
        // const articles = await articlesApi.getArticles();
        // const researchers = await researchersApi.getResearchers();
        // ... and then calculate the stats
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
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
              <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
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
              <p className="text-sm font-medium text-muted-foreground">Researchers</p>
              <h3 className="text-2xl font-bold mt-2">{stats.totalResearchers}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views</p>
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
              <p className="text-sm font-medium text-muted-foreground">Comments</p>
              <h3 className="text-2xl font-bold mt-2">{stats.totalComments}</h3>
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
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-left font-medium">Views</th>
                    <th className="px-4 py-3 text-left font-medium">Comments</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentArticles.map((article) => (
                    <tr key={article.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{article.title}</td>
                      <td className="px-4 py-3">{article.category}</td>
                      <td className="px-4 py-3">{article.views}</td>
                      <td className="px-4 py-3">{article.comments}</td>
                      <td className="px-4 py-3">{article.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Graph (Placeholder) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Performance Overview</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="flex flex-col items-center text-center">
                <BarChart4 className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Analytics visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboardPage);