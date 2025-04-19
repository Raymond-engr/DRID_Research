"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { withAdminAuth } from "@/lib/auth";
import {
  articlesApi,
  facultyApi,
  departmentApi,
  researchersApi,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  Image as ImageIcon,
  Save,
  RefreshCw,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    category: "",
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
  const [wordCount, setWordCount] = useState(0);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);

  // Calculate word count when content changes
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).length;
    setWordCount(formData.content.trim() === "" ? 0 : words);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch article data
        const articleData = await articlesApi.getArticle(id);
        setArticle(articleData);

        // Fetch related data
        const [researchersData, facultiesData, departmentsData] =
          await Promise.all([
            researchersApi.getResearchers(),
            facultyApi.getFaculties(),
            departmentApi.getDepartments(),
          ]);

        // Ensure we're working with arrays
        const researchersArray = researchersData.data || [];
        const facultiesArray = facultiesData.data || [];
        const departmentsArray = Array.isArray(departmentsData)
          ? departmentsData
          : departmentsData.data || [];

        setResearchers(researchersArray);
        setFaculties(facultiesArray);
        setDepartments(departmentsArray);

        // Find the faculty and department codes based on IDs
        const facultyItem = facultiesArray.find(
          (f) => f._id === articleData.faculty
        );
        const departmentItem = departmentsArray.find(
          (d) => d._id === articleData.department
        );

        // Set form data
        setFormData({
          title: articleData.title || "",
          content: articleData.content || "",
          summary: articleData.summary || "",
          category: articleData.category || "Research",
          faculty: facultyItem?.code || "",
          department: departmentItem?.code || "",
          contributors: articleData.contributors
            ? articleData.contributors.map((c) => c._id)
            : [],
          cover_photo: null,
        });

        // Set cover photo preview if it exists
        if (articleData.cover_photo) {
          setCoverPhotoPreview(articleData.cover_photo);
        }
      } catch (error) {
        console.error("Error fetching article data:", error);
        setError("Failed to load article data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

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

  const handleContributorToggle = (contributorId) => {
    setFormData((prev) => {
      // Check if contributors already includes this value
      if (prev.contributors.includes(contributorId)) {
        return {
          ...prev,
          contributors: prev.contributors.filter((id) => id !== contributorId),
        };
      } else {
        return {
          ...prev,
          contributors: [...prev.contributors, contributorId],
        };
      }
    });
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
      !formData.summary ||
      !formData.faculty ||
      !formData.department
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate contributors (optional - remove if not needed)
    if (formData.contributors.length === 0) {
      setError("Please select at least one contributor");
      return;
    }

    setIsSaving(true);

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

      await articlesApi.updateArticle(id, articleFormData);

      // Redirect back to articles management page
      router.push("/admin/articles");
    } catch (error) {
      setError(error.message || "Failed to update article");
    } finally {
      setIsSaving(false);
    }
  };

  // Get filtered departments based on selected faculty
  const filteredDepartments = Array.isArray(departments)
    ? departments.filter(
        (dept) => !formData.faculty || dept.faculty === formData.faculty
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/admin/articles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Article</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="contributors">Contributors*</Label>
              <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                {researchers.map((researcher) => (
                  <div
                    key={researcher._id}
                    className="flex items-center space-x-2 py-1"
                  >
                    <input
                      type="checkbox"
                      id={`contributor-${researcher._id}`}
                      checked={formData.contributors.includes(researcher._id)}
                      onChange={() => handleContributorToggle(researcher._id)}
                    />
                    <label htmlFor={`contributor-${researcher._id}`}>
                      {researcher.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {Array.isArray(faculties) &&
                    faculties.map((faculty) => (
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
                        ? "Select department"
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
            <Label htmlFor="cover_photo">Cover Photo</Label>
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
                    src={getImageUrl(coverPhotoPreview)}
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
              className="min-h-[300px]"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/articles")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || wordCount > 1000 || summaryWordCount > 50}
              className="flex items-center"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAdminAuth(EditArticlePage);
