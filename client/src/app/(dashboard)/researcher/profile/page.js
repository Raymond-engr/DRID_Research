"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { withResearcherAuth } from "@/lib/auth";
import { researcherDashboardApi } from "@/lib/api";
import {
  RefreshCw,
  Users,
  Mail,
  Award,
  Building,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

function ResearcherProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    bio: "",
    department: "",
    faculty: "",
    specialization: "",
    academic_achievements: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await researcherDashboardApi.getProfile();
        if (response?.data?.profile) {
          setProfile(response.data.profile);
          // Pre-fill form data with current profile
          setFormData({
            name: response.data.profile.name || "",
            email: response.data.profile.email || "",
            title: response.data.profile.title || "",
            bio: response.data.profile.bio || "",
            department: response.data.profile.department || "",
            faculty: response.data.profile.faculty || "",
            specialization: response.data.profile.specialization || "",
            academic_achievements:
              response.data.profile.academic_achievements || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This would be implemented in a real app
    // For now, we'll just update the local state
    setProfile((prev) => ({
      ...prev,
      ...formData,
    }));
    setIsEditing(false);
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
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Professor, Associate Professor, etc."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">
                    Department
                  </label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="faculty" className="text-sm font-medium">
                    Faculty
                  </label>
                  <Input
                    id="faculty"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="specialization"
                    className="text-sm font-medium"
                  >
                    Specialization
                  </label>
                  <Input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Biography
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="academic_achievements"
                  className="text-sm font-medium"
                >
                  Academic Achievements
                </label>
                <textarea
                  id="academic_achievements"
                  name="academic_achievements"
                  value={formData.academic_achievements}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          {profile && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                        {profile.profilePicture ? (
                          <Image
                            src={getImageUrl(profile.profilePicture)}
                            alt={profile.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-center">
                        {profile.name}
                      </h2>
                      <p className="text-gray-500 text-center mb-4">
                        {profile.title || "Researcher"}
                      </p>

                      <div className="w-full space-y-3 mt-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{profile.email}</span>
                        </div>

                        {profile.department && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {profile.department}
                            </span>
                          </div>
                        )}

                        {profile.specialization && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {profile.specialization}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full md:w-2/3 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Biography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {profile.bio || "No biography provided."}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Faculty</h3>
                      <p className="text-gray-700">
                        {profile.faculty || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">Department</h3>
                      <p className="text-gray-700">
                        {profile.department || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">
                        Specialization
                      </h3>
                      <p className="text-gray-700">
                        {profile.specialization || "Not specified"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Academic Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {profile.academic_achievements ||
                        "No achievements listed."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default withResearcherAuth(ResearcherProfilePage);
