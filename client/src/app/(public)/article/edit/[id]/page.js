"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { withAdminAuth } from "@/lib/auth";
import { articlesApi, facultyApi, departmentApi, researchersApi } from "@/lib/api";
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
import { AlertCircle, ArrowLeft, Image as ImageIcon, Save, RefreshCw } from "lucide-react";
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
    category: "",
    faculty: "",
    department: "",
    contributors: [],
    cover_photo: null,
  });
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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch article data
        const articleData = await articlesApi.getArticle(id);
        setArticle(articleData);
        
        // Fetch related data
        const [researchersData, facultiesData, departmentsData] = await Promise.all([
          researchersApi.getResearchers(),
          facultyApi.getFaculties(),
          departmentApi.getDepartments()
        ]);
        
        setResearchers(researchersData);
        setFaculties(facultiesData);
        setDepartments(departmentsData);
        
        // Find the faculty and department codes based on IDs
        const facultyItem = facultiesData.find(f => f._id === articleData.faculty);
        const departmentItem = departmentsData.find(d => d._id === articleData.department);
        
        // Set form data
        setFormData({
          title: articleData.title || "",
          content: articleData.content || "",
          category: articleData.category || "Research",
          faculty: facultyItem?.code || "",
          department: departmentItem?.code || "",
          contributors: articleData.contributors ? 
            articleData.contributors.map(c => c._id) : 
            [],
          cover_photo: null
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
      reader.on