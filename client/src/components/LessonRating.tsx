import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star, MessageSquare, Users } from "lucide-react";
import type { User, LessonRating } from "@shared/schema";

interface LessonRatingProps {
  lessonId: string;
}

export function LessonRating({ lessonId }: LessonRatingProps) {
  const { user } = useAuth() as { user: User | null };
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const { data: ratings = [] } = useQuery({
    queryKey: ["/api/lessons", lessonId, "ratings"],
    enabled: !!lessonId,
  });

  const { data: userRating } = useQuery({
    queryKey: ["/api/lessons", lessonId, "ratings", "user"],
    queryFn: async () => {
      const allRatings = await apiRequest(`/api/lessons/${lessonId}/ratings`);
      return allRatings.find((r: LessonRating) => r.userId === user?.id);
    },
    enabled: !!lessonId && !!user,
  });

  const rateMutation = useMutation({
    mutationFn: async (ratingData: any) => {
      return await apiRequest(`/api/lessons/${lessonId}/rate`, {
        method: "POST",
        body: JSON.stringify(ratingData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your rating has been saved!",
      });
      setRating(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/lessons", lessonId, "ratings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] }); // Update lesson list with new ratings
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save rating. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitRating = () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a star rating.",
        variant: "destructive",
      });
      return;
    }

    rateMutation.mutate({
      rating,
      comment: comment.trim() || null,
    });
  };

  const getAverageRating = () => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum: number, r: LessonRating) => sum + r.rating, 0);
    return Math.round((total / ratings.length) * 10) / 10;
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((r: LessonRating) => {
      distribution[r.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const renderStars = (count: number, interactive = false, size = 5) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-${size} w-${size} cursor-pointer transition-colors ${
          index < count
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        } ${interactive ? "hover:fill-yellow-300 hover:text-yellow-300" : ""}`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
        onMouseEnter={interactive ? () => setHoveredRating(index + 1) : undefined}
        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
      />
    ));
  };

  const getUserInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();

  return (
    <div className="space-y-6" data-testid="lesson-rating-component">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Lesson Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold" data-testid="text-average-rating">
                {averageRating > 0 ? averageRating : "—"}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1" data-testid="text-rating-count">
                {ratings.length} {ratings.length === 1 ? "rating" : "ratings"}
              </div>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 mb-1">
                  <span className="text-sm w-6">{stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: ratings.length > 0 
                          ? `${(distribution[stars as keyof typeof distribution] / ratings.length) * 100}%` 
                          : "0%"
                      }}
                    />
                  </div>
                  <span className="text-sm w-8 text-right" data-testid={`count-${stars}-stars`}>
                    {distribution[stars as keyof typeof distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Rating Form */}
      {user && !userRating && (
        <Card>
          <CardHeader>
            <CardTitle>Rate This Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Your Rating:</span>
                  <div className="flex gap-1" data-testid="rating-stars">
                    {renderStars(hoveredRating || rating, true, 6)}
                  </div>
                </div>
              </div>

              <div>
                <Textarea
                  placeholder="Share your thoughts about this lesson (optional)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  data-testid="textarea-rating-comment"
                />
              </div>

              <Button
                onClick={handleSubmitRating}
                disabled={rateMutation.isPending || rating === 0}
                data-testid="button-submit-rating"
              >
                {rateMutation.isPending ? "Submitting..." : "Submit Rating"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User's Existing Rating */}
      {userRating && (
        <Card>
          <CardHeader>
            <CardTitle>Your Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div>
                <div className="flex gap-1 mb-2">
                  {renderStars(userRating.rating)}
                </div>
                {userRating.comment && (
                  <div className="text-gray-600 dark:text-gray-400" data-testid="text-user-rating-comment">
                    {userRating.comment}
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Rated on {new Date(userRating.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reviews */}
      {ratings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratings
                .filter((r: LessonRating) => r.comment) // Only show ratings with comments
                .slice(0, 5)
                .map((ratingItem: LessonRating) => (
                <div key={ratingItem.id} className="flex items-start gap-3" data-testid={`review-${ratingItem.id}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getUserInitials(ratingItem.user?.firstName, ratingItem.user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-1">
                        {renderStars(ratingItem.rating, false, 4)}
                      </div>
                      <span className="text-sm font-medium">
                        {ratingItem.user?.firstName || "Anonymous"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {ratingItem.comment}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(ratingItem.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {ratings.filter((r: LessonRating) => r.comment).length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}