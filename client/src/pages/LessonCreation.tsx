import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Plus, Send, Vote, Star, BookOpen, Users, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { User, Category, LessonProposal, ProposalVote } from "@shared/schema";

export default function LessonCreation() {
  const { user } = useAuth() as { user: User | null };
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [proposalForm, setProposalForm] = useState({
    title: "",
    description: "",
    content: "",
    categoryId: "",
    difficulty: "",
    estimatedDuration: "",
    programmingLanguage: "",
    answerGuide: "",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: proposals = [] } = useQuery({
    queryKey: ["/api/proposals"],
  });

  const createProposalMutation = useMutation({
    mutationFn: async (proposalData: any) => {
      return await apiRequest("/api/proposals", {
        method: "POST",
        body: JSON.stringify(proposalData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lesson proposal created successfully!",
      });
      setProposalForm({
        title: "",
        description: "",
        content: "",
        categoryId: "",
        difficulty: "",
        estimatedDuration: "",
        programmingLanguage: "",
        answerGuide: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitProposalMutation = useMutation({
    mutationFn: async (proposalId: string) => {
      return await apiRequest(`/api/proposals/${proposalId}/submit`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Proposal submitted for review!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const approveProposalMutation = useMutation({
    mutationFn: async (proposalId: string) => {
      return await apiRequest(`/api/proposals/${proposalId}/approve`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Proposal approved and lesson created!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to approve proposal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proposalForm.title || !proposalForm.categoryId || !proposalForm.difficulty) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createProposalMutation.mutate({
      ...proposalForm,
      estimatedDuration: proposalForm.estimatedDuration ? parseInt(proposalForm.estimatedDuration) : null,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      submitted: "default", 
      approved: "default",
      rejected: "destructive",
    } as const;

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

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "text-green-600",
      medium: "text-yellow-600",
      hard: "text-red-600",
    };
    return colors[difficulty as keyof typeof colors] || "text-gray-600";
  };

  if (!user) {
    return <div>Please log in to create lessons.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="lesson-creation-page">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lesson Creation Studio</h1>
          <p className="text-gray-600 dark:text-gray-400">Collaborate with your school community to create amazing lessons</p>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" data-testid="tab-create">
            <Plus className="h-4 w-4 mr-2" />
            Create Proposal
          </TabsTrigger>
          <TabsTrigger value="proposals" data-testid="tab-proposals">
            <Vote className="h-4 w-4 mr-2" />
            Review Proposals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Lesson Proposal</CardTitle>
              <CardDescription>
                Start by creating a draft proposal. Once ready, submit it for community review and voting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lesson Title *</Label>
                    <Input
                      id="title"
                      data-testid="input-title"
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter lesson title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={proposalForm.categoryId}
                      onValueChange={(value) => setProposalForm(prev => ({ ...prev, categoryId: value }))}
                    >
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.name.toLowerCase()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                    <Select
                      value={proposalForm.difficulty}
                      onValueChange={(value) => setProposalForm(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger data-testid="select-difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                    <Input
                      id="duration"
                      data-testid="input-duration"
                      type="number"
                      value={proposalForm.estimatedDuration}
                      onChange={(e) => setProposalForm(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    data-testid="textarea-description"
                    value={proposalForm.description}
                    onChange={(e) => setProposalForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what students will learn..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Lesson Content</Label>
                  <Textarea
                    id="content"
                    data-testid="textarea-content"
                    value={proposalForm.content}
                    onChange={(e) => setProposalForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter the full lesson content, including explanations, examples, and activities..."
                    rows={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programming">Programming Language (if applicable)</Label>
                  <Select
                    value={proposalForm.programmingLanguage}
                    onValueChange={(value) => setProposalForm(prev => ({ ...prev, programmingLanguage: value }))}
                  >
                    <SelectTrigger data-testid="select-programming">
                      <SelectValue placeholder="Select programming language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(user.role === 'teacher' || user.role === 'admin') && (
                  <div className="space-y-2">
                    <Label htmlFor="answerGuide">Answer Guide (Teacher Only)</Label>
                    <Textarea
                      id="answerGuide"
                      data-testid="textarea-answer-guide"
                      value={proposalForm.answerGuide}
                      onChange={(e) => setProposalForm(prev => ({ ...prev, answerGuide: e.target.value }))}
                      placeholder="Solution guide for teachers..."
                      rows={4}
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={createProposalMutation.isPending}
                  data-testid="button-create-proposal"
                  className="w-full md:w-auto"
                >
                  {createProposalMutation.isPending ? "Creating..." : "Create Proposal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          <div className="grid gap-6">
            {proposals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Proposals Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Be the first to create a lesson proposal for your school community!
                  </p>
                </CardContent>
              </Card>
            ) : (
              proposals.map((proposal: LessonProposal) => (
                <Card key={proposal.id} data-testid={`card-proposal-${proposal.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{proposal.title}</CardTitle>
                          {getStatusBadge(proposal.status)}
                        </div>
                        <CardDescription className="text-base">{proposal.description}</CardDescription>
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
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proposal.status === 'draft' && proposal.authorId === user?.id && (
                        <Button
                          size="sm"
                          onClick={() => submitProposalMutation.mutate(proposal.id)}
                          disabled={submitProposalMutation.isPending}
                          data-testid={`button-submit-${proposal.id}`}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Submit for Review
                        </Button>
                      )}
                      
                      {proposal.status === 'submitted' && (user.role === 'admin' || user.role === 'teacher') && (
                        <Button
                          size="sm"
                          onClick={() => approveProposalMutation.mutate(proposal.id)}
                          disabled={approveProposalMutation.isPending}
                          data-testid={`button-approve-${proposal.id}`}
                        >
                          <Vote className="h-4 w-4 mr-2" />
                          Approve Proposal
                        </Button>
                      )}
                      
                      <Link href={`/proposals/${proposal.id}`}>
                        <Button variant="outline" size="sm" data-testid={`button-view-${proposal.id}`}>
                          View Details
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created {new Date(proposal.createdAt).toLocaleDateString()}
                      {proposal.submittedAt && (
                        <> • Submitted {new Date(proposal.submittedAt).toLocaleDateString()}</>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}