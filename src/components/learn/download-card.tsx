import * as React from "react"
import { Download, File, Box } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface DownloadCardProps {
  title: string
  description: string
  fileSize?: string
  fileType?: string
  version?: string
}

export function DownloadCard({
  title,
  description,
  fileSize,
  fileType,
  version,
}: DownloadCardProps) {
  const Icon = fileType === "model" ? Box : File

  return (
    <Card className="hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {version && (
            <div className="bg-secondary/50 px-2 py-1 rounded-md">v{version}</div>
          )}
          {fileSize && (
            <div className="bg-secondary/50 px-2 py-1 rounded-md">{fileSize}</div>
          )}
          {fileType && (
            <div className="bg-secondary/50 px-2 py-1 rounded-md uppercase">
              {fileType}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2" variant="outline">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}
