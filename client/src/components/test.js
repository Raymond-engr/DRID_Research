// app/(dashboard)/admin/invitations/page.js
"use client";

import { useState, useEffect } from "react";
import { withAdminAuth } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail, Check, AlertCircle, Clock, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await authApi.getInvitations();
        setInvitations(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching invitations:", error);
        setError(error.message || "Failed to load invitations");
        setIsLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      await authApi.inviteResearcher(email);
      setSuccess(`Invitation sent to ${email}`);

      // Refresh the invitation list
      const response = await authApi.getInvitations();
      setInvitations(response.data);

      setEmail("");
      setTimeout(() => setShowInviteDialog(false), 1500);
    } catch (error) {
      setError(error.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendInvitation = async (id) => {
    try {
      await authApi.resendInvitation(id);

      // Refresh invitations list
      const response = await authApi.getInvitations();
      setInvitations(response.data);

      setSuccess("Invitation resent successfully");
    } catch (error) {
      console.error("Error resending invitation:", error);
      setError(error.message || "Failed to resend invitation");
    }
  };

  const deleteInvitation = async (id) => {
    if (confirm("Are you sure you want to delete this invitation?")) {
      try {
        await authApi.deleteInvitation(id);
        setInvitations(
          invitations.filter((invitation) => invitation.id !== id)
        );
        setSuccess("Invitation deleted successfully");
      } catch (error) {
        console.error("Error deleting invitation:", error);
        setError(error.message || "Failed to delete invitation");
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "accepted":
        return <Check className="h-4 w-4 mr-1" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "rejected":
        return <X className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

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
          Researcher Invitations
        </h1>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Invite Researcher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite Researcher</DialogTitle>
              <DialogDescription>
                Send an invitation email to a new researcher to join the
                platform.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendInvite} className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="researcher@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invitations List */}
      <Card>
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Created</th>
                  <th className="px-4 py-3 text-left font-medium">Expires</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No invitations found.
                    </td>
                  </tr>
                ) : (
                  invitations.map((invitation) => (
                    <tr
                      key={invitation.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {invitation.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            invitation.status
                          )}`}
                        >
                          {getStatusIcon(invitation.status)}
                          {invitation.status.charAt(0).toUpperCase() +
                            invitation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{invitation.created}</td>
                      <td className="px-4 py-3">{invitation.expires}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {(invitation.status === "expired" ||
                            invitation.status === "rejected") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resendInvitation(invitation.id)}
                            >
                              <Mail className="h-4 w-4" />
                              <span className="ml-1">Resend</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteInvitation(invitation.id)}
                          >
                            <X className="h-4 w-4" />
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

      {success && !showInviteDialog && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default withAdminAuth(AdminInvitationsPage);
