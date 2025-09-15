import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Vote, MessageSquare, CheckCircle, XCircle, AlertCircle, Users, Star, Clock, BookOpen } from "lucide-react";
import { Link } from "wouter";
import type { User, LessonProposal, ProposalVote } from "@shared/schema";

interface ProposalDetailsProps {
  params: { id: string };
}

export default function ProposalDetails({ params }: ProposalDetailsProps) {
  const { id } = params;
  const { user } = useAuth() as { user: User | null };
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [voteForm, setVoteForm] = useState({
    vote: "",
    comment: "",
  });

  const { data: proposal, isLoading } = useQuery({
    queryKey: ["/api/proposals", id],
    enabled: !!id,
  });

  const { data: votes = [] } = useQuery({
    queryKey: ["/api/proposals", id, "votes"],
    enabled: !!id,
  });

  const voteMutation = useMutation({
    mutationFn: async (voteData: any) => {
      return await apiRequest(`/api/proposals/${id}/vote`, {
        method: "POST",
        body: JSON.stringify(voteData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your vote has been recorded!",
      });
      setVoteForm({ vote: "", comment: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/proposals", id, "votes"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (voteType: string) => {
    if (!voteForm.comment.trim()) {
      toast({
        title: "Error",
        description: "Please provide a comment with your vote.",
        variant: "destructive",
      });
      return;
    }

    voteMutation.mutate({
      vote: voteType,
      comment: voteForm.comment,
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      submitted: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getVoteIcon = (voteType: string) => {
    switch (voteType) {
      case "approve":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "reject":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "request_changes":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Vote className="h-4 w-4" />;
    }
  };

  const getVoteCounts = () => {
    const counts = votes.reduce((acc: any, vote: ProposalVote) => {
      acc[vote.vote] = (acc[vote.vote] || 0) + 1;
      return acc;
    }, {});

    return {
      approve: counts.approve || 0,
      reject: counts.reject || 0,
      request_changes: counts.request_changes || 0,
      total: votes.length,
    };
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "text-green-600",
      medium: "text-yellow-600", 
      hard: "text-red-600",
    };
    return colors[difficulty as keyof typeof colors] || "text-gray-600";
  };

  const getUserInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading proposal...</div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Proposal Not Found</h2>
          <Link href="/lesson-creation">
            <Button>Back to Proposals</Button>
          </Link>
        </div>
      </div>
    );
  }

  const voteCounts = getVoteCounts();
  const userVote = votes.find((vote: ProposalVote) => vote.voterId === user?.id);
  const canVote = user && proposal.status === 'submitted' && proposal.authorId !== user.id;

  return (
    <div className="container mx-auto px-4 py-8" data-testid="proposal-details-page">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/lesson-creation">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Proposals
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-2xl" data-testid="text-title">{proposal.title}</CardTitle>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <CardDescription className="text-base" data-testid="text-description">
                    {proposal.description}
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="capitalize">{proposal.categoryId}</span>
                </div>
                <div className={`flex items-center gap-1 ${getDifficultyColor(proposal.difficulty)}`}>
                  <Star className="h-4 w-4" />
                  <span className="capitalize font-medium">{proposal.difficulty}</span>
                </div>
                {proposal.estimatedDuration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{proposal.estimatedDuration} min</span>
                  </div>
                )}
                {proposal.programmingLanguage && (
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      {proposal.programmingLanguage}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Lesson Content</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300" data-testid="text-content">
                      {proposal.content || "No content provided yet."}
                    </div>
                  </div>
                </div>

                {proposal.answerGuide && (user?.role === 'teacher' || user?.role === 'admin') && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Answer Guide (Teacher Only)</h3>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300" data-testid="text-answer-guide">
                        {proposal.answerGuide}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Created {new Date(proposal.createdAt).toLocaleDateString()}
                  {proposal.submittedAt && (
                    <> • Submitted {new Date(proposal.submittedAt).toLocaleDateString()}</>
                  )}
                  {proposal.approvedAt && (
                    <> • Approved {new Date(proposal.approvedAt).toLocaleDateString()}</>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voting Section */}
          {canVote && (
            <Card>
              <CardHeader>
                <CardTitle>Cast Your Vote</CardTitle>
                <CardDescription>
                  Review the proposal and provide your feedback to help improve the lesson.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts, suggestions, or concerns about this lesson proposal..."
                    value={voteForm.comment}
                    onChange={(e) => setVoteForm(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    data-testid="textarea-vote-comment"
                  />
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleVote("approve")}
                      disabled={voteMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                      data-testid="button-approve-vote"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    
                    <Button
                      onClick={() => handleVote("request_changes")}
                      disabled={voteMutation.isPending}
                      variant="outline"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                      data-testid="button-request-changes"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Request Changes
                    </Button>
                    
                    <Button
                      onClick={() => handleVote("reject")}
                      disabled={voteMutation.isPending}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                      data-testid="button-reject-vote"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {userVote && (
            <Card>
              <CardHeader>
                <CardTitle>Your Vote</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  {getVoteIcon(userVote.vote)}
                  <div>
                    <div className="font-medium capitalize">{userVote.vote.replace('_', ' ')}</div>
                    <div className="text-gray-600 dark:text-gray-400 mt-1" data-testid="text-user-vote-comment">
                      {userVote.comment}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(userVote.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Vote Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Approve</span>
                  </div>
                  <Badge variant="secondary" data-testid="badge-approve-count">{voteCounts.approve}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span>Request Changes</span>
                  </div>
                  <Badge variant="secondary" data-testid="badge-changes-count">{voteCounts.request_changes}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Reject</span>
                  </div>
                  <Badge variant="secondary" data-testid="badge-reject-count">{voteCounts.reject}</Badge>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total Votes</span>
                    <Badge data-testid="badge-total-votes">{voteCounts.total}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Comments */}
          {votes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {votes.slice(0, 5).map((vote: ProposalVote) => (
                    <div key={vote.id} className="flex items-start gap-3" data-testid={`comment-${vote.id}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getUserInitials(vote.voter?.firstName, vote.voter?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getVoteIcon(vote.vote)}
                          <span className="text-sm font-medium capitalize">
                            {vote.vote.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {vote.comment}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(vote.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {votes.length > 5 && (
                    <div className="text-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        +{votes.length - 5} more comments
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}