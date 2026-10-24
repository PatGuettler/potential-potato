import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-3">
          <i className="fas fa-compass text-4xl text-muted-foreground" />
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-sm text-muted-foreground">This page doesn't exist, or your account doesn't have access to it.</p>
          <Link href="/"><Button>Back to dashboard</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
