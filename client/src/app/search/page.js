"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { articlesApi, facultyApi, departmentApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { ArrowLeft, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/buttons";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialFaculty = searchParams.get("faculty") || "";
  const initialDepartment = searchParams.get("department") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(initialFaculty);
  const [selectedDepartment, setSelectedDepartment] = useState(initialDepartment);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Categories for research types
  const categories = ["Research", "Innovation", "Development"];

  useEffect(() => {
    // Load faculties and departments when component mounts
    const loadFilters = async () => {
      try {
        const facultiesData = await facultyApi.getFaculties();
        const departmentsData = await departmentApi.getDepartments();
        
        if (facultiesData && Array.isArray(facultiesData)) {
          setFaculties(facultiesData);
        }
        
        if (departmentsData && Array.isArray(departmentsData)) {
          setDepartments(departmentsData);
          setFilteredDepartments(departmentsData);
        }
      } catch (error) {
        console.error("Error loading filters:", error);
      }
    };
    
    loadFilters();
  }, []);

  // Filter departments based on selected faculty
  useEffect(() => {
    if (selectedFaculty && departments.length > 0) {
      const filtered = departments.filter(dept => dept.faculty === selectedFaculty);
      setFilteredDepartments(filtered);
      
      // If current selected department is not in the filtered list, reset it
      if (filtered.length > 0 && selectedDepartment) {
        const deptExists = filtered.some(dept => dept.code === selectedDepartment);
        if (!deptExists) {
          setSelectedDepartment("");
        }
      }
    } else {
      setFilteredDepartments(departments);
    }
  }, [selectedFaculty, departments, selectedDepartment]);

  // Search function
  const performSearch = async () => {
    if (query.length < 3 && !selectedCategory && !selectedFaculty && !selectedDepartment) {
      return;
    }

    setLoading(true);
    try {
      // Construct search params
      const searchParams = {};
      if (query && query.length >= 3) {
        searchParams.q = query;
      }
      if (selectedCategory) {
        searchParams.category = selectedCategory;
      }
      if (selectedFaculty) {
        searchParams.faculty = selectedFaculty;
      }
      if (selectedDepartment) {
        searchParams.department = selectedDepartment;
      }

      const articles = await articlesApi.getArticles(searchParams);
      setResults(Array.isArray(articles) ? articles : []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL with search params
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedFaculty) params.set("faculty", selectedFaculty);
    if (selectedDepartment) params.set("department", selectedDepartment);
    
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  // Handle search submission
  const handleSearch = (e) => {
    e?.preventDefault();
    performSearch();
    updateSearchParams();
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedFaculty("");
    setSelectedDepartment("");
    setIsFilterOpen(false);
  };

  // Perform search on initial load if there are search params
  useEffect(() => {
    if (initialQuery || initialCategory || initialFaculty || initialDepartment) {
      performSearch();
    }
  }, [initialQuery, initialCategory, initialFaculty, initialDepartment]);

  return (
    <>
      <Header isSearchPage={true} />
      <div className="min-h-screen bg-gray-50 pt-16 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => router.back()} 
              className="flex items-center text-fuchsia-900 hover:text-fuchsia-700"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-fuchsia-900">Search Results</h1>
          </div>

          {/* Search Form */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center bg-gray-100"
                  >
                    <Filter size={16} className="mr-2" />
                    Filters
                    {(selectedCategory || selectedFaculty || selectedDepartment) && 
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-fuchsia-700 text-white rounded-full text-xs">
                        {[selectedCategory, selectedFaculty, selectedDepartment].filter(Boolean).length}
                      </span>
                    }
                  </Button>
                  <Button type="submit" className="bg-fuchsia-900 hover:bg-fuchsia-800">
                    Search
                  </Button>
                </div>
              </div>

              {/* Filters */}
              {isFilterOpen && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-fuchsia-900">Filter Results</h3>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Clear Filters
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsFilterOpen(false)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Categories */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategory === category}
                              onCheckedChange={() => {
                                setSelectedCategory(
                                  selectedCategory === category ? "" : category
                                );
                              }}
                            />
                            <label
                              htmlFor={`category-${category}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Faculty */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Faculty
                      </label>
                      <select
                        value={selectedFaculty}
                        onChange={(e) => setSelectedFaculty(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
                      >
                        <option value="">All Faculties</option>
                        {faculties.map((faculty) => (
                          <option key={faculty._id} value={faculty.code}>
                            {faculty.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
                        disabled={filteredDepartments.length === 0}
                      >
                        <option value="">All Departments</option>
                        {filteredDepartments.map((department) => (
                          <option key={department._id} value={department.code}>
                            {department.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Search Results */}
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Found {results.length} {results.length === 1 ? "result" : "results"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((article) => (
                    <Link
                      href={`/articles/${article._id}`}
                      key={article._id}
                      className="bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:transform hover:scale-105"
                    >
                      <div className="relative">
                        <div className="absolute top-2 left-2 bg-fuchsia-900 text-white text-xs font-bold px-2 py-1 rounded uppercase z-10">
                          {article.category}
                        </div>
                        {article.cover_photo ? (
                          <Image
                            src={getImageUrl(article.cover_photo)}
                            alt={article.title}
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-fuchsia-900 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {article.summary}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{article.department?.title || "Unknown department"}</span>
                          <span>
                            {new Date(article.publish_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-md">
                {(query || selectedCategory || selectedFaculty || selectedDepartment) ? (
                  <>
                    <div className="text-fuchsia-900 text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any articles matching your search criteria.
                    </p>
                    <Button 
                      onClick={clearFilters} 
                      className="bg-fuchsia-900 hover:bg-fuchsia-800"
                    >
                      Clear filters and try again
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-fuchsia-900 text-5xl mb-4">🔎</div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Start searching</h3>
                    <p className="text-gray-600">
                      Enter at least 3 characters or select filters to find articles.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;