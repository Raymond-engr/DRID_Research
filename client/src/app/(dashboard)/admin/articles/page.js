"use client";

import { useState, useEffect } from "react";
import { withAdminAuth } from "@/lib/auth";
import {
  articlesApi,
  facultyApi,
  departmentApi,
  researchersApi,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  MessageSquare,
  Filter,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    category: "Research",
    faculty: "",
    department: "",
    contributors: [],
    cover_photo: null,
  });
  const [summaryWordCount, setSummaryWordCount] = useState(0);
  const [researchers, setResearchers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch articles, researchers, faculties, and departments
        const articlesData = await articlesApi.getArticles();
        const researchersData = await researchersApi.getResearchers();
        const facultiesData = await facultyApi.getFaculties();
        const departmentsData = await departmentApi.getDepartments();

        setArticles(articlesData);
        setResearchers(researchersData.data);
        setFaculties(facultiesData.data);
        setDepartments(departmentsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate word count when content changes
  useEffect(() => {
    if (formData.content) {
      const words = formData.content.trim()
        ? formData.content.trim().split(/\s+/).length
        : 0;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [formData.content]);

  useEffect(() => {
    if (formData.summary) {
      const words = formData.summary.trim()
        ? formData.summary.trim().split(/\s+/).length
        : 0;
      setSummaryWordCount(words);
    } else {
      setSummaryWordCount(0);
    }
  }, [formData.summary]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cover_photo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFacultyChange = (value) => {
    setFormData((prev) => ({ ...prev, faculty: value, department: "" }));
  };

  const handleDepartmentChange = (value) => {
    setFormData((prev) => ({ ...prev, department: value }));
  };

  const handleContributorsChange = (value) => {
    setFormData((prev) => {
      // Check if contributors already includes this value
      if (prev.contributors.includes(value)) {
        return {
          ...prev,
          contributors: prev.contributors.filter((id) => id !== value),
        };
      } else {
        return {
          ...prev,
          contributors: [...prev.contributors, value],
        };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      category: "Research",
      faculty: "",
      department: "",
      contributors: [],
      cover_photo: null,
    });
    setCoverPhotoPreview(null);
    setWordCount(0);
    setSummaryWordCount(0);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate word count
    if (wordCount > 1000) {
      setError("Content exceeds the 1000 word limit");
      return;
    }

    if (summaryWordCount > 50) {
      setError("Summary exceeds the 50 word limit");
      return;
    }

    // Validate required fields
    if (
      !formData.title ||
      !formData.content ||
      !formData.summary || // Add summary validation
      !formData.faculty ||
      !formData.department
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate contributors
    if (formData.contributors.length === 0) {
      setError("Please select at least one contributor");
      return;
    }

    if (!formData.cover_photo) {
      setError("Please add a cover photo");
      return;
    }

    console.log("Form data before submission:", {
      title: formData.title,
      category: formData.category,
      content: formData.content,
      faculty: formData.faculty, // Check if this is correctly set
      department: formData.department,
      contributors: formData.contributors,
    });

    setIsSubmitting(true);

    try {
      // Create FormData object for file upload
      const articleFormData = new FormData();
      articleFormData.append("title", formData.title);
      articleFormData.append("category", formData.category);
      articleFormData.append("content", formData.content);
      articleFormData.append("summary", formData.summary);
      articleFormData.append("faculty", formData.faculty);
      articleFormData.append("department", formData.department);

      // Add contributors if any
      if (formData.contributors && formData.contributors.length > 0) {
        formData.contributors.forEach((contributor) => {
          articleFormData.append("contributors[]", contributor);
        });
      }

      // Add cover photo if any
      if (formData.cover_photo) {
        articleFormData.append("cover_photo", formData.cover_photo);
      }

      console.log("FormData contents:");
      for (let pair of articleFormData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await articlesApi.createArticle(articleFormData);

      // Add new article to the list
      setArticles((prevArticles) => [response, ...prevArticles]);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create article";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await articlesApi.deleteArticle(id);

        // Update articles list
        setArticles(articles.filter((article) => article._id !== id));
      } catch (error) {
        console.error("Error deleting article:", error);
        setError("Failed to delete article");
      }
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.contributors &&
        article.contributors.some(
          (contributor) =>
            contributor.name &&
            contributor.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesCategory =
      categoryFilter === "all" || article.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const filteredDepartments = departments.filter(
    (dept) => !formData.faculty || dept.faculty === formData.faculty
  );

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
        <h1 className="text-2xl font-bold tracking-tight">
          Articles Management
        </h1>
        <Dialog
          open={showAddDialog}
          onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter article title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Add Summary field with word count */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="summary">Summary* (50 words max)</Label>
                  <span
                    className={`text-sm ${
                      summaryWordCount > 50
                        ? "text-red-500 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {summaryWordCount}/50 words
                  </span>
                </div>
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="Enter a brief summary of the article"
                  value={formData.summary}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
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
                  <Label htmlFor="contributors">Contributors</Label>
                  <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                    {researchers.map((researcher) => (
                      <div
                        key={researcher._id}
                        className="flex items-center space-x-2 py-1"
                      >
                        <input
                          type="checkbox"
                          id={`contributor-${researcher._id}`}
                          checked={formData.contributors.includes(
                            researcher._id
                          )}
                          onChange={() => {
                            const newContributors =
                              formData.contributors.includes(researcher._id)
                                ? formData.contributors.filter(
                                    (id) => id !== researcher._id
                                  )
                                : [...formData.contributors, researcher._id];
                            setFormData((prev) => ({
                              ...prev,
                              contributors: newContributors,
                            }));
                          }}
                        />
                        <label htmlFor={`contributor-${researcher._id}`}>
                          {researcher.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty*</Label>
                  <Select
                    value={formData.faculty}
                    onValueChange={handleFacultyChange}
                  >
                    <SelectTrigger className="truncate">
                      <SelectValue
                        placeholder="Select faculty"
                        className="truncate max-w-full"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem
                          key={faculty._id}
                          value={faculty.code}
                          className="truncate"
                          title={faculty.title}
                        >
                          {faculty.title.length > 30
                            ? faculty.title.substring(0, 30) + "..."
                            : faculty.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department*</Label>
                  <Select
                    value={formData.department}
                    onValueChange={handleDepartmentChange}
                    disabled={!formData.faculty}
                  >
                    <SelectTrigger className="truncate max-w-full">
                      <SelectValue
                        placeholder={
                          formData.faculty
                            ? "Select depart"
                            : "Select faculty first"
                        }
                        className="truncate"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDepartments.map((department) => (
                        <SelectItem
                          key={department._id}
                          value={department.code}
                          className="truncate"
                          title={department.title}
                        >
                          {department.title.length > 30
                            ? department.title.substring(0, 30) + "..."
                            : department.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_photo">Cover Photo*</Label>
                <div className="mt-1 flex items-center">
                  <Input
                    id="cover_photo"
                    name="cover_photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="cover_photo"
                    className="cursor-pointer px-4 py-2 border rounded-md text-sm flex items-center"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {formData.cover_photo ? "Change Image" : "Upload Image"}
                  </label>
                  {coverPhotoPreview && (
                    <div className="ml-4">
                      <img
                        src={coverPhotoPreview}
                        alt="Cover preview"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="content">Content*</Label>
                  <span
                    className={`text-sm ${wordCount > 1000 ? "text-red-500 font-medium" : "text-gray-500"}`}
                  >
                    {wordCount}/1000 words
                  </span>
                </div>
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

              <DialogFooter className="sticky bottom-0 pt-2 pb-2 bg-white border-t mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || wordCount > 1000 || summaryWordCount > 50
                  }
                >
                  {isSubmitting ? "Creating..." : "Create Article"}
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
                  <th className="px-4 py-3 text-left font-medium">
                    Researcher
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Views</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No articles found.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{article.title}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.category === "Research"
                              ? "bg-blue-100 text-blue-800"
                              : article.category === "Innovation"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {article.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {article.owner && article.owner.username}
                        {article.contributors &&
                          article.contributors.length > 0 && (
                            <span className="text-xs text-gray-500 block">
                              +{article.contributors.length} contributors
                            </span>
                          )}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(article.publish_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-gray-400" />
                        {article.views ? article.views.count : 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/article/${article._id}`}
                              target="_blank"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/articles/edit/${article._id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteArticle(article._id)}
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
  );
}

export default withAdminAuth(AdminArticlesPage);
