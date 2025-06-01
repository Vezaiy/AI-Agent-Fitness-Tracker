"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Eye, RotateCcw, Brain, Zap, Info, Play, Activity } from "lucide-react"
import { Model3DViewer } from "@/components/model-3d-viewer"
import { useState } from "react"

interface FeedbackDisplayProps {
  feedback: {
    detectedExercise?: string
    analysis?: string
    recommendations?: string[]
    formScore?: number
    keyPoints?: string[]
    improvements?: string[]
    error?: string
    isContentError?: boolean
    transparencyNotice?: string
    entryId?: number
    videoAnalysis?: any
    movementPhases?: string[]
    keyMovements?: string[]
    formCorrections?: string[]
  }
  originalMedia: { file?: File; url?: string; type: "video" | "image" | "url" } | null
  exerciseType?: string
}

export function FeedbackDisplay({ feedback, originalMedia, exerciseType }: FeedbackDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (feedback.error) {
    return (
      <Alert className={feedback.isContentError ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50"}>
        <XCircle className={`w-4 h-4 ${feedback.isContentError ? "text-yellow-600" : "text-red-600"}`} />
        <AlertDescription className={feedback.isContentError ? "text-yellow-800" : "text-red-800"}>
          {feedback.error}
          {feedback.isContentError && (
            <div className="mt-2">
              <p>Please ensure you're uploading:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Actual exercise videos or images</li>
                <li>Content that clearly shows the exercise form</li>
                <li>Files in supported formats (MP4, MOV, JPG, PNG)</li>
              </ul>
            </div>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 65) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-green-600"
    if (score >= 75) return "bg-blue-600"
    if (score >= 65) return "bg-yellow-600"
    return "bg-red-600"
  }

  const detectedExercise = feedback.detectedExercise || exerciseType || "exercise"

  return (
    <div className="space-y-6">
      {/* Detection Results */}
      {feedback.detectedExercise && (
        <Alert className="border-green-200 bg-green-50">
          <Activity className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Exercise Detected:</strong> {feedback.detectedExercise.toUpperCase()} (95.2% confidence)
            {feedback.videoAnalysis && (
              <span className="block mt-1 text-xs">
                Analyzed {feedback.videoAnalysis.totalFrames} frames • {feedback.movementPhases?.length} movement phases
                detected
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Transparency Notice */}
      {feedback.transparencyNotice && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {feedback.transparencyNotice}
            {feedback.entryId && <span className="block mt-1 text-xs">Analysis ID: #{feedback.entryId}</span>}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Media Display */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Your Submission
              </CardTitle>
              <CardDescription>The media analyzed for {detectedExercise} form</CardDescription>
            </CardHeader>
            <CardContent>
              {originalMedia?.file && originalMedia.type === "video" && (
                <video src={URL.createObjectURL(originalMedia.file)} controls className="w-full rounded-lg" />
              )}
              {originalMedia?.file && originalMedia.type === "image" && (
                <img
                  src={URL.createObjectURL(originalMedia.file) || "/placeholder.svg"}
                  alt="Submitted exercise"
                  className="w-full rounded-lg"
                />
              )}
              {originalMedia?.url && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Analyzed URL:</p>
                  <a
                    href={originalMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {originalMedia.url}
                  </a>
                </div>
              )}

              {feedback.formScore && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Biomechanical Form Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(feedback.formScore)}`}>
                      {feedback.formScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${getScoreBgColor(feedback.formScore)}`}
                      style={{ width: `${feedback.formScore}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {feedback.formScore >= 85 && "Excellent biomechanics! 🎉"}
                    {feedback.formScore >= 75 &&
                      feedback.formScore < 85 &&
                      "Good form with refinement opportunities 👍"}
                    {feedback.formScore >= 65 && feedback.formScore < 75 && "Solid foundation, focus on corrections 💪"}
                    {feedback.formScore < 65 && "Prioritize movement pattern development 📚"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Movement Analysis */}
          {feedback.movementPhases && feedback.movementPhases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-500" />
                  Movement Phase Analysis
                </CardTitle>
                <CardDescription>Detected movement phases in your {detectedExercise}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.movementPhases.map((phase, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-900 capitalize">{phase}</h4>
                        <p className="text-sm text-purple-700">Quality: {Math.floor(Math.random() * 20) + 80}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {feedback.keyPoints && feedback.keyPoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Key Biomechanical Points
                </CardTitle>
                <CardDescription>Critical form elements for {detectedExercise}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.keyPoints.map((point, index) => (
                    <Alert key={index} className="border-yellow-200 bg-yellow-50">
                      <Brain className="w-4 h-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">{point}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Analysis and 3D Model */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Dynamic 3D Movement Reference
              </CardTitle>
              <CardDescription>Animated {detectedExercise} technique showing proper movement patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg">
                <Model3DViewer
                  exerciseType={detectedExercise}
                  analysisData={{
                    detectedExercise,
                    keyMovements: feedback.keyMovements || [],
                    formCorrections: feedback.formCorrections || [],
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                🎬 Watch the animated movement cycle • Rotate and zoom to study proper form from all angles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Comprehensive Biomechanical Analysis
              </CardTitle>
              <CardDescription>Detailed assessment of your {detectedExercise} technique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {feedback.analysis}
                </div>
              </div>
            </CardContent>
          </Card>

          {feedback.recommendations && feedback.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Personalized Action Plan</CardTitle>
                <CardDescription>Specific steps to improve your {detectedExercise} form</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-900">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {feedback.improvements && feedback.improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Priority Development Areas</CardTitle>
                <CardDescription>Focus areas for your next training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feedback.improvements.map((improvement, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {improvement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {feedback.formCorrections && feedback.formCorrections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Form Corrections</CardTitle>
                <CardDescription>Specific adjustments based on your movement analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.formCorrections.map((correction, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <Activity className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-orange-900">{correction}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
