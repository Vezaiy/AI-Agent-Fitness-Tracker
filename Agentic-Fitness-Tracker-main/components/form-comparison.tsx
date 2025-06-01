"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Model3DViewer } from "@/components/model-3d-viewer"
import { CheckCircle, XCircle, ArrowRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface FormComparisonProps {
  feedback: any
  originalMedia: { file?: File; url?: string; type: "video" | "image" | "url" } | null
  exerciseType?: string
}

export function FormComparison({ feedback, originalMedia, exerciseType }: FormComparisonProps) {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activePhase, setActivePhase] = useState(0)
  const [showAnnotations, setShowAnnotations] = useState(true)

  const detectedExercise = feedback.detectedExercise || exerciseType || "squat"
  const movementPhases = feedback.movementPhases || ["setup", "descent", "bottom position", "ascent", "finish"]

  const keyPoints = [
    {
      time: 1.2,
      correct: false,
      point: "Knees tracking too far forward",
      recommendation: "Keep knees aligned with toes",
    },
    {
      time: 2.5,
      correct: true,
      point: "Good depth achieved",
      recommendation: "Maintain this depth consistently",
    },
    {
      time: 3.8,
      correct: false,
      point: "Back rounding slightly",
      recommendation: "Maintain neutral spine throughout movement",
    },
    {
      time: 5.2,
      correct: true,
      point: "Strong drive through heels",
      recommendation: "Continue pushing through heels for optimal power",
    },
  ]

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement
    setCurrentTime(video.currentTime)

    // Update active phase based on video time
    const videoDuration = video.duration
    if (!videoDuration) return

    const phaseIndex = Math.floor((video.currentTime / videoDuration) * movementPhases.length)
    setActivePhase(Math.min(phaseIndex, movementPhases.length - 1))
  }

  const handleSliderChange = (value: number[]) => {
    const videoElement = document.getElementById("comparison-video") as HTMLVideoElement
    if (videoElement) {
      videoElement.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const getCurrentKeyPoint = () => {
    return keyPoints.find((point) => Math.abs(point.time - currentTime) < 0.5)
  }

  const currentPoint = getCurrentKeyPoint()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Form Comparison Analysis</h2>
        <p className="text-gray-600">
          Compare your {detectedExercise} form with the ideal movement pattern for maximum improvement
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Form</CardTitle>
            <CardDescription>Video analysis with key points highlighted at specific timestamps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {originalMedia?.file && originalMedia.type === "video" ? (
                <video
                  id="comparison-video"
                  src={URL.createObjectURL(originalMedia.file)}
                  className="w-full rounded-lg"
                  onTimeUpdate={handleTimeUpdate}
                  autoPlay={false}
                  controls={false}
                  loop
                />
              ) : (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No video available for comparison</p>
                </div>
              )}

              {showAnnotations && currentPoint && (
                <div
                  className={`absolute top-4 right-4 p-3 rounded-lg ${
                    currentPoint.correct ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {currentPoint.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`font-medium ${currentPoint.correct ? "text-green-800" : "text-red-800"}`}>
                        {currentPoint.point}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{currentPoint.recommendation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={handlePlayPause} className="flex items-center gap-1">
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {playing ? "Pause" : "Play"}
                </Button>

                <Button variant="outline" size="sm" onClick={() => setShowAnnotations(!showAnnotations)}>
                  {showAnnotations ? "Hide Annotations" : "Show Annotations"}
                </Button>
              </div>

              <div>
                <Slider
                  defaultValue={[0]}
                  max={10}
                  step={0.1}
                  value={[currentTime]}
                  onValueChange={handleSliderChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0:00</span>
                  <span>
                    {Math.floor(currentTime / 60)}:
                    {Math.floor(currentTime % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Movement Phase:</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="text-blue-700 font-medium capitalize">{movementPhases[activePhase]}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ideal Form Reference</CardTitle>
            <CardDescription>3D model demonstrating proper {detectedExercise} technique</CardDescription>
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

            <div className="mt-4 space-y-4">
              <Tabs defaultValue="phases">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="phases">Movement Phases</TabsTrigger>
                  <TabsTrigger value="cues">Form Cues</TabsTrigger>
                  <TabsTrigger value="corrections">Corrections</TabsTrigger>
                </TabsList>

                <TabsContent value="phases" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    {movementPhases.map((phase, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border flex items-center gap-3 ${
                          index === activePhase ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === activePhase ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p
                            className={`font-medium capitalize ${index === activePhase ? "text-blue-800" : "text-gray-800"}`}
                          >
                            {phase}
                          </p>
                          {index === activePhase && <p className="text-xs text-blue-600 mt-1">Current phase</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="cues" className="space-y-3 pt-4">
                  {(
                    feedback.keyMovements || [
                      "Keep chest up throughout movement",
                      "Drive through heels, not toes",
                      "Maintain neutral spine position",
                      "Knees track in line with toes",
                    ]
                  ).map((cue, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{cue}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="corrections" className="space-y-3 pt-4">
                  {(
                    feedback.formCorrections || [
                      "Avoid excessive forward knee travel",
                      "Prevent back rounding at bottom position",
                      "Maintain even weight distribution in feet",
                      "Keep shoulders pulled back and down",
                    ]
                  ).map((correction, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{correction}</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Form Differences</CardTitle>
          <CardDescription>Specific areas where your form differs from the ideal movement pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(
              feedback.formCorrections || [
                {
                  area: "Knee Position",
                  yourForm: "Knees tracking forward past toes",
                  idealForm: "Knees aligned with toes throughout movement",
                  impact: "Increased stress on knee joints, reduced glute activation",
                  correction: "Focus on sitting back into the movement, keeping weight in heels",
                },
                {
                  area: "Back Angle",
                  yourForm: "Slight rounding in lower back at bottom position",
                  idealForm: "Neutral spine maintained throughout movement",
                  impact: "Increased risk of lower back strain, inefficient power transfer",
                  correction: "Engage core before descent, maintain chest up position",
                },
                {
                  area: "Depth",
                  yourForm: "Inconsistent depth between repetitions",
                  idealForm: "Consistent depth with hip crease below knee level",
                  impact: "Uneven muscle development, incomplete range of motion",
                  correction: "Use box squat technique to develop consistent depth awareness",
                },
              ]
            ).map((difference, index) => (
              <div key={index} className="grid md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Area</p>
                  <p className="font-medium text-gray-900">{difference.area}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Your Form</p>
                  <p className="text-red-700">{difference.yourForm}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ideal Form</p>
                  <p className="text-green-700">{difference.idealForm}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Impact</p>
                  <p className="text-gray-700">{difference.impact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Correction</p>
                  <p className="text-blue-700">{difference.correction}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
