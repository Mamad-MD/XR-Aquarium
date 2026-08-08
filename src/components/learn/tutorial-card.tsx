import * as React from "react"
import { PlayCircle, Download } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface TutorialCardProps {
  title: string
  description: string
  duration?: string
  difficulty?: string
  thumbnailUrl?: string
}

export function TutorialCard({
  title,
  description,
  duration,
  difficulty,
  thumbnailUrl,
}: TutorialCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-shadow">
      <div className="aspect-video w-full bg-secondary/50 relative group">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/40">
            <PlayCircle className="w-12 h-12 text-primary/50 group-hover:text-primary transition-colors" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex gap-4">
          {duration && <span>{duration}</span>}
          {difficulty && <span className="text-primary">{difficulty}</span>}
        </div>
        <Button variant="ghost" size="sm" className="h-8">
          Watch
        </Button>
      </CardFooter>
    </Card>
  )
}
