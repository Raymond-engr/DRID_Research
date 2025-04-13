// app/(dashboard)/admin/researchers/page.js
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { withAdminAuth } from "@/lib/auth";
import { researchersApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Search,
  User,
  Mail,
  Trash2,
  ExternalLink,
  CalendarClock,
  Building,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ResearchersPage() {
  const [researchers, setResearchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [researcherToDelete, setResearcherToDelete] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchResearchers();
  }, []);

  const fetchResearchers = async () => {
    try {
      setIsLoading(true);
      const response = await researchersApi.getResearchers();
      setResearchers(response.data);
    } catch (error) {
      console.error("Error fetching researchers:", error);
      setError("Failed to load researchers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (researcher) => {
    setResearcherToDelete(researcher);
    setDeleteDialogOpen(true);
  };

  const handleDeleteResearcher = async () => {
    try {
      await researchersApi.deleteResearcher(researcherToDelete.id);
      setResearchers(researchers.filter((r) => r.id !== researcherToDelete.id));
      setSuccess(
        `${researcherToDelete.name} has been removed from the platform`
      );
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting researcher:", error);
      setError(error.message || "Failed to delete researcher");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredResearchers = researchers.filter(
    (researcher) =>
      researcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      researcher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      researcher.faculty.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold tracking-tight">Researchers</h1>
        <Button onClick={() => (window.location.href = "/admin/invitations")}>
          <Mail className="mr-2 h-4 w-4" />
          Manage Invitations
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          className="pl-10"
          placeholder="Search researchers by name, email or faculty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Researchers List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Active Researchers ({filteredResearchers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredResearchers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchTerm
                ? "No researchers match your search."
                : "No researchers found."}
            </div>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResearchers.map((researcher) => (
                <Card key={researcher.id} className="overflow-hidden">
                  <div className="flex items-center justify-center bg-gray-100 h-40">
                    {researcher.profilePicture ? (
                      <div
                        className="h-40 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${researcher.profilePicture})`,
                        }}
                      ></div>
                    ) : (
                      <User className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">
                      {researcher.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {researcher.title}
                    </p>

                    <div className="flex items-center text-sm mb-1">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="truncate">{researcher.email}</span>
                    </div>

                    <div className="flex items-center text-sm mb-1">
                      <Building className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{researcher.faculty}</span>
                    </div>

                    <div className="flex items-center text-sm mb-3">
                      <CalendarClock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Joined {formatDate(researcher.createdAt)}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(researcher)}
                      >
                        <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                        <span className="text-red-500">Remove</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(`/researchers/${researcher.id}`, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span>View Profile</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {researcherToDelete?.name} from the
              platform and delete all associated data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteResearcher}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAdminAuth(ResearchersPage);
