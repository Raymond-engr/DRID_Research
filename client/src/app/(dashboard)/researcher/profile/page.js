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
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

function ResearcherProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await researcherDashboardApi.getProfile();
        if (response?.data?.profile) {
          setProfile(response.data.profile);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // More helpful error messages
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

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>
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
                          <span className="text-sm">{profile.department}</span>
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
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default withResearcherAuth(ResearcherProfilePage);
