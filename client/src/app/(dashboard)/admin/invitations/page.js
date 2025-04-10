// app/(dashboard)/admin/invitations/page.js
'use client';

import { useState, useEffect } from 'react';
import { withAdminAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw,
  Mail,
  Check,
  AlertCircle,
  Clock,
  X
} from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        // In a real implementation, you would fetch this data from your API
        // For now, we'll use mock data
        
        const mockInvitations = [
          { id: 1, email: "researcher1@example.com", status: "pending", created: "2025-03-10", expires: "2025-04-10" },
          { id: 2, email: "researcher2@example.com", status: "accepted", created: "2025-03-05", expires: "2025-04-05" },
          { id: 3, email: "researcher3@example.com", status: "expired", created: "2025-02-01", expires: "2025-03-01" },
          { id: 4, email: "researcher4@example.com", status: "pending", created: "2025-03-15", expires: "2025-04-15" },
          { id: 5, email: "researcher5@example.com", status: "rejected", created: "2025-03-02", expires: "2025-04-02" }
        ];
        
        setInvitations(mockInvitations);
        setIsLoading(false);
        
        // In a real implementation, you would fetch this data from your API like:
        // const response = await authApi.getInvitations();
        // setInvitations(response.invitations);
        
      } catch (error) {
        console.error('Error fetching invitations:', error);
        setIsLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // In a real implementation, you would call your API
      // await authApi.inviteResearcher(email);
      
      // For now, we'll just simulate the response
      const newInvitation = {
        id: invitations.length + 1,
        email: email,
        status: "pending",
        created: new Date().toISOString().split('T')[0],
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      };
      
      setInvitations([newInvitation, ...invitations]);
      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
      setTimeout(() => setShowInviteDialog(false), 1500);
    } catch (error) {
      setError(error.message || 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendInvitation = async (id) => {
    try {
      // In a real implementation, you would call your API
      // await authApi.resendInvitation(id);
      
      // For now, we'll just update the local state
      const updatedInvitations = invitations.map(invitation => {
        if (invitation.id === id) {
          return {
            ...invitation,
            created: new Date().toISOString().split('T')[0],
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "pending"
          };
        }
        return invitation;
      });
      
      setInvitations(updatedInvitations);
      setSuccess('Invitation resent successfully');
    } catch (error) {
      console.error('Error resending invitation:', error);
      setError('Failed to resend invitation');
    }
  };

  const deleteInvitation = async (id) => {
    if (confirm('Are you sure you want to delete this invitation?')) {
      try {
        // In a real implementation, you would call your API
        // await authApi.deleteInvitation(id);
        
        // For now, we'll just update the local state
        setInvitations(invitations.filter(invitation => invitation.id !== id));
      } catch (error) {
        console.error('Error deleting invitation:', error);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'accepted':
        return <Check className="h-4 w-4 mr-1" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'rejected':
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
        <h1 className="text-2xl font-bold tracking-tight">Researcher Invitations</h1>
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
                Send an invitation email to a new researcher to join the platform.
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
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
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
                <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Invitation'}
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
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No invitations found.
                    </td>
                  </tr>
                ) : (
                  invitations.map((invitation) => (
                    <tr key={invitation.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{invitation.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invitation.status)}`}>
                          {getStatusIcon(invitation.status)}
                          {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{invitation.created}</td>
                      <td className="px-4 py-3">{invitation.expires}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {(invitation.status === 'expired' || invitation.status === 'rejected') && (
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
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default withAdminAuth(AdminInvitationsPage);