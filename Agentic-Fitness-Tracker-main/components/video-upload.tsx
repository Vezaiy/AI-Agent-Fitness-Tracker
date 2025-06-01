"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Video, ImageIcon, Link, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VideoUploadProps {
  onMediaUpload: (media: { file?: File; url?: string; type: "video" | "image" | "url" }, metadata: any) => void
  isAnalyzing: boolean
}

export function VideoUpload({ onMediaUpload, isAnalyzing }: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [urlInput, setUrlInput] = useState("")
  const [activeTab, setActiveTab] = useState("video")
  const [metadata, setMetadata] = useState({
    exerciseType: "",
    fitnessLevel: "",
    goals: "",
    specificConcerns: "",
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = () => {
    if (activeTab === "url" && urlInput) {
      onMediaUpload({ url: urlInput, type: "url" }, metadata)
    } else if (selectedFile) {
      const type = selectedFile.type.startsWith("video/") ? "video" : "image"
      onMediaUpload({ file: selectedFile, type }, metadata)
    }
  }

  const canSubmit = () => {
    if (activeTab === "url") {
      return urlInput && metadata.exerciseType && metadata.fitnessLevel
    }
    return selectedFile && metadata.exerciseType && metadata.fitnessLevel
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Media for Analysis</CardTitle>
          <CardDescription>Choose how you want to submit your exercise for free AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="mt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" id="video-upload" />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700">
                    {selectedFile && selectedFile.type.startsWith("video/")
                      ? selectedFile.name
                      : "Click to upload video"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Supports MP4, MOV, AVI formats</p>
                </label>
              </div>
              {selectedFile && selectedFile.type.startsWith("video/") && (
                <video src={URL.createObjectURL(selectedFile)} controls className="w-full rounded-lg mt-4" />
              )}
            </TabsContent>

            <TabsContent value="image" className="mt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700">
                    {selectedFile && selectedFile.type.startsWith("image/")
                      ? selectedFile.name
                      : "Click to upload image"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, WebP formats</p>
                </label>
              </div>
              {selectedFile && selectedFile.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full rounded-lg mt-4"
                />
              )}
            </TabsContent>

            <TabsContent value="url" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url-input">Video/Image URL</Label>
                  <Input
                    id="url-input"
                    placeholder="https://example.com/exercise-video.mp4"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Paste a direct link to a video or image file, or a YouTube/social media link
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Details</CardTitle>
          <CardDescription>Help our AI provide better analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="exercise-type">Exercise Type</Label>
            <Select onValueChange={(value) => setMetadata({ ...metadata, exerciseType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="squat">Squat</SelectItem>
                <SelectItem value="deadlift">Deadlift</SelectItem>
                <SelectItem value="pushup">Push-up</SelectItem>
                <SelectItem value="pullup">Pull-up</SelectItem>
                <SelectItem value="plank">Plank</SelectItem>
                <SelectItem value="lunge">Lunge</SelectItem>
                <SelectItem value="bench-press">Bench Press</SelectItem>
                <SelectItem value="overhead-press">Overhead Press</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fitness-level">Fitness Level</Label>
            <Select onValueChange={(value) => setMetadata({ ...metadata, fitnessLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="goals">Fitness Goals</Label>
            <Textarea
              placeholder="e.g., Weight loss, muscle building, strength training..."
              value={metadata.goals}
              onChange={(e) => setMetadata({ ...metadata, goals: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="concerns">Specific Concerns</Label>
            <Textarea
              placeholder="Any specific areas you want feedback on or previous injuries..."
              value={metadata.specificConcerns}
              onChange={(e) => setMetadata({ ...metadata, specificConcerns: e.target.value })}
            />
          </div>

          <Button onClick={handleSubmit} disabled={!canSubmit() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI Analyzing...
              </>
            ) : (
              "Get AI Analysis"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
