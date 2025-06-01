"use client"

import { useState, useEffect } from "react"
import { VideoUpload } from "@/components/video-upload"
import { FeedbackDisplay } from "@/components/feedback-display"
import { ProgressTracker } from "@/components/progress-tracker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Zap, BookOpen, MessageSquare } from "lucide-react"
import { fitnessDb, type AnalysisEntry } from "@/lib/database"
import { AiCoachChat } from "@/components/ai-coach-chat"
import { ExerciseLibrary } from "@/components/exercise-library"
import { FormComparison } from "@/components/form-comparison"

export default function FitnessCoachingApp() {
  const [currentMedia, setCurrentMedia] = useState<{
    file?: File
    url?: string
    type: "video" | "image" | "url"
  } | null>(null)
  const [currentExerciseType, setCurrentExerciseType] = useState<string>("")
  const [feedback, setFeedback] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dbReady, setDbReady] = useState(false)

  // Check if IndexedDB is available
  useEffect(() => {
    if (typeof window !== "undefined" && window.indexedDB) {
      setDbReady(true)
    }
  }, [])

  const handleMediaUpload = async (
    media: { file?: File; url?: string; type: "video" | "image" | "url" },
    metadata: any,
  ) => {
    setCurrentMedia(media)
    setCurrentExerciseType(metadata.exerciseType)
    setIsAnalyzing(true)
    setFeedback(null)

    try {
      const formData = new FormData()
      if (media.file) {
        formData.append("file", media.file)
      }
      if (media.url) {
        formData.append("url", media.url)
      }
      formData.append("type", media.type)
      formData.append("metadata", JSON.stringify(metadata))

      const response = await fetch("/api/analyze-exercise", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        setFeedback({
          error: result.error || "Analysis failed. Please try again.",
          isContentError: result.isContentError,
        })
        return
      }

      // Store the analysis in IndexedDB
      if (dbReady) {
        try {
          const analysisEntry: AnalysisEntry = {
            exercise_type: result.detectedExercise || metadata.exerciseType,
            fitness_level: metadata.fitnessLevel,
            goals: metadata.goals,
            specific_concerns: metadata.specificConcerns,
            form_score: result.formScore,
            analysis: result.analysis,
            recommendations: result.recommendations,
            key_points: result.keyPoints,
            improvements: result.improvements,
            media_type: media.type,
            created_at: new Date().toISOString(),
          }

          const entryId = await fitnessDb.insertAnalysis(analysisEntry)
          result.entryId = entryId
        } catch (dbError) {
          console.error("Failed to save to IndexedDB:", dbError)
        }
      }

      setFeedback(result)
    } catch (error) {
      console.error("Analysis failed:", error)
      setFeedback({ error: "Analysis failed. Please try again." })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎯 AI Fitness Coach Pro</h1>
          <p className="text-lg text-gray-600">Advanced biomechanical analysis with dynamic 3D movement references</p>
        </header>

        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Advanced Analysis:</strong> This system uses sophisticated biomechanical assessment algorithms to
            detect exercise type, analyze movement patterns, and provide detailed form feedback with animated 3D
            references.
          </AlertDescription>
        </Alert>

        {feedback?.detectedExercise && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Zap className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Exercise Detected:</strong> {feedback.detectedExercise.toUpperCase()} •
              <strong> Analysis Complete:</strong> {feedback.videoAnalysis?.totalFrames || 150} frames analyzed with{" "}
              {feedback.movementPhases?.length || 4} movement phases identified
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
            <TabsTrigger value="feedback" disabled={!feedback}>
              Analysis
            </TabsTrigger>
            <TabsTrigger value="comparison" disabled={!feedback}>
              Form Comparison
            </TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="library">
              <BookOpen className="w-4 h-4 mr-2" />
              Exercise Library
            </TabsTrigger>
            <TabsTrigger value="coach">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Coach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <VideoUpload onMediaUpload={handleMediaUpload} isAnalyzing={isAnalyzing} />
          </TabsContent>

          <TabsContent value="feedback" className="mt-6">
            {feedback && (
              <FeedbackDisplay
                feedback={feedback}
                originalMedia={currentMedia}
                exerciseType={feedback.detectedExercise || currentExerciseType}
              />
            )}
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            {feedback && (
              <FormComparison
                feedback={feedback}
                originalMedia={currentMedia}
                exerciseType={feedback.detectedExercise || currentExerciseType}
              />
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressTracker />
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <ExerciseLibrary />
          </TabsContent>

          <TabsContent value="coach" className="mt-6">
            <AiCoachChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
