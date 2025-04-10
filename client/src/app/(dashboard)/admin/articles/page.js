// app/(dashboard)/admin/articles/page.js
'use client';

import { useState, useEffect } from 'react';
import { withAdminAuth } from '@/lib/auth';
import { articlesApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw,
  Eye,
  MessageSquare,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Research',
    researcherId: '',
  });
  const [researchers, setResearchers] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, you would fetch this data from your API
        // For now, we'll use mock data
        
        const mockArticles = [
          { id: 1, title: "Advances in AI Research", category: "Research", views: 245, comments: 12, date: "2025-03-15", researcherName: "Dr. Jane Smith" },
          { id: 2, title: "Blockchain Technology Applications", category: "Innovation", views: 187, comments: 8, date: "2025-03-10", researcherName: "Prof. John Doe" },
          { id: 3, title: "Sustainable Energy Solutions", category: "Development", views: 320, comments: 15, date: "2025-03-05", researcherName: "Dr. Michael Chen" },
          { id: 4, title: "Quantum Computing Breakthroughs", category: "Research", views: 156, comments: 7, date: "2025-02-28", researcherName: "Dr. Jane Smith" },
          { id: 5, title: "Future of Remote Work", category: "Innovation", views: 215, comments: 19, date: "2025-02-20", researcherName: "Dr. Lisa Brown" }
        ];
        
        const mockResearchers = [
          { id: 1, name: "Dr. Jane Smith", faculty: "Computer Science" },
          { id: 2, name: "Prof. John Doe", faculty: "Engineering" },
          { id: 3, name: "Dr. Michael Chen", faculty: "Environmental Science" },
          { id: 4, name: "Dr. Lisa Brown", faculty: "Social Sciences" },
        ];
        
        setArticles(mockArticles);
        setResearchers(mockResearchers);
        setIsLoading(false);
        
        // In a real implementation, you would fetch this data from your API like:
        // const articles = await articlesApi.getArticles();
        // const researchers = await researchersApi.getResearchers();
        
      } catch (error) {
        console.error('Error fetching articles:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleResearcherChange = (value) => {
    setFormData((prev) => ({ ...prev, researcherId: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // In a real implementation, you would call your API
      // const response = await articlesApi.createArticle(formData);
      
      // For now, we'll just simulate the response
      const newArticle = {
        id: articles.length + 1,
        title: formData.title,
        category: formData.category,
        views: 0,
        comments: 0,
        date: new Date().toISOString().split('T')[0],
        researcherName: researchers.find(r => r.id.toString() === formData.researcherId)?.name || 'Unknown',
      };
      
      setArticles([newArticle, ...articles]);
      setShowAddDialog(false);
      setFormData({
        title: '',
        content: '',
        category: 'Research',
        researcherId: '',
      });
    } catch (error) {
      setError(error.message || 'Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        // In a real implementation, you would call your API
        // await articlesApi.deleteArticle(id);
        
        // For now, we'll just update the local state
        setArticles(articles.filter(article => article.id !== id));
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.researcherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Articles Management</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Article</DialogTitle>
              <DialogDescription>
                Create a new research article to be published on the platform.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter article title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Innovation">Innovation</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="researcher">Researcher</Label>
                  <Select 
                    value={formData.researcherId} 
                    onValueChange={handleResearcherChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select researcher" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchers.map((researcher) => (
                        <SelectItem key={researcher.id} value={researcher.id.toString()}>
                          {researcher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter article content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-[200px]"
                  required
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Article'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search articles..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
              <SelectItem value="Innovation">Innovation</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Articles List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Researcher</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Views</th>
                  <th className="px-4 py-3 text-left font-medium">Comments</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No articles found.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{article.title}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.category === 'Research' ? 'bg-blue-100 text-blue-800' :
                          article.category === 'Innovation' ? 'bg-green-100 text-green-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {article.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">{article.researcherName}</td>
                      <td className="px-4 py-3">{article.date}</td>
                      <td className="px-4 py-3 flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-gray-400" />
                        {article.views}
                      </td>
                      <td className="px-4 py-3 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-gray-400" />
                        {article.comments}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/articles/${article.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )};