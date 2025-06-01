"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Award, Brain, Loader2 } from "lucide-react"
import { fitnessDb } from "@/lib/database"

interface ProgressData {
  stats: {
    totalAnalyses: number
    averageScore: number
    currentStreak: number
    improvementRate: number
  }
  recentAnalyses: Array<{
    id: number
    exercise_type: string
    form_score: number
    created_at: string
    fitness_level: string
    media_type: string
  }>
  exerciseDistribution: Array<{
    exercise_type: string
    count: number
    avg_score: number
  }>
}

export function ProgressTracker() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProgressData()
  }, [])

  const fetchProgressData = async () => {
    try {
      setLoading(true)

      // Check if IndexedDB is available
      if (!window.indexedDB) {
        throw new Error("Your browser doesn't support IndexedDB")
      }

      // Get stats from IndexedDB
      const stats = await fitnessDb.getStats()

      // Get recent analyses
      const recentAnalyses = await fitnessDb.getAnalyses(10)

      // Get exercise distribution
      const exerciseDistribution = await fitnessDb.getExerciseDistribution()

      setProgressData({
        stats,
        recentAnalyses,
        exerciseDistribution,
      })
    } catch (err) {
      console.error("Progress fetch error:", err)
      setError("Failed to load progress data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading your progress...</span>
      </div>
    )
  }

  if (error || !progressData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">{error || "No progress data available yet."}</p>
        <p className="text-sm text-gray-500 mt-2">Complete some exercise analyses to see your progress!</p>
      </div>
    )
  }

  const { stats, recentAnalyses, exerciseDistribution } = progressData

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Analyses</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalAnalyses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Average Score</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{stats.averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Recent Activity</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{stats.currentStreak}</div>
            <div className="text-xs text-gray-500">analyses this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Improvement</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {stats.improvementRate > 0 ? "+" : ""}
              {stats.improvementRate}%
            </div>
            <div className="text-xs text-gray-500">vs last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Distribution */}
      {exerciseDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exercise Breakdown</CardTitle>
            <CardDescription>Your most practiced exercises and average scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exerciseDistribution.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{exercise.count}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">{exercise.exercise_type}</h3>
                      <p className="text-sm text-gray-500">{exercise.count} analyses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{Math.round(exercise.avg_score)}%</div>
                    <div className="text-xs text-gray-500">avg score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Analysis History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis History</CardTitle>
          <CardDescription>Your latest exercise form analyses</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAnalyses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No analyses yet. Upload your first exercise video!</p>
          ) : (
            <div className="space-y-4">
              {recentAnalyses.map((session, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">{session.form_score}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 capitalize">{session.exercise_type}</h3>
                      <Badge variant="outline">{formatDate(session.created_at)}</Badge>
                      <Badge
                        className={
                          session.media_type === "video"
                            ? "bg-purple-100 text-purple-800"
                            : session.media_type === "image"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {session.media_type}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {session.fitness_level}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600">Analysis #{session.id}</div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${session.form_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
