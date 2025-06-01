"use client"

// Client-side database using IndexedDB
export interface AnalysisEntry {
  id?: number
  exercise_type: string
  fitness_level: string
  goals?: string
  specific_concerns?: string
  form_score: number
  analysis: string
  recommendations?: string[]
  key_points?: string[]
  improvements?: string[]
  media_type: string
  created_at?: string
}

class IndexedDBDatabase {
  private dbName = "fitness_coach_db"
  private dbVersion = 1
  private db: IDBDatabase | null = null
  private dbReady: Promise<IDBDatabase>

  constructor() {
    this.dbReady = this.initDB()
  }

  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        reject("IndexedDB not available")
        return
      }

      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = (event) => {
        console.error("IndexedDB error:", event)
        reject("Failed to open database")
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object store for analysis history
        if (!db.objectStoreNames.contains("analysis_history")) {
          const store = db.createObjectStore("analysis_history", {
            keyPath: "id",
            autoIncrement: true,
          })

          // Create indexes
          store.createIndex("exercise_type", "exercise_type", { unique: false })
          store.createIndex("created_at", "created_at", { unique: false })
          store.createIndex("fitness_level", "fitness_level", { unique: false })
        }
      }
    })
  }

  async insertAnalysis(entry: AnalysisEntry): Promise<number> {
    try {
      const db = await this.dbReady

      return new Promise((resolve, reject) => {
        // Add created_at timestamp if not provided
        const entryWithTimestamp = {
          ...entry,
          created_at: entry.created_at || new Date().toISOString(),
        }

        const transaction = db.transaction(["analysis_history"], "readwrite")
        const store = transaction.objectStore("analysis_history")
        const request = store.add(entryWithTimestamp)

        request.onsuccess = () => {
          resolve(request.result as number)
        }

        request.onerror = (event) => {
          console.error("Error adding entry:", event)
          reject("Failed to add entry")
        }
      })
    } catch (error) {
      console.error("Failed to insert analysis:", error)
      return Date.now() // Fallback ID if database fails
    }
  }

  async getAllAnalyses(): Promise<AnalysisEntry[]> {
    try {
      const db = await this.dbReady

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["analysis_history"], "readonly")
        const store = transaction.objectStore("analysis_history")
        const index = store.index("created_at")
        const request = index.openCursor(null, "prev") // Sort by created_at descending

        const results: AnalysisEntry[] = []

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            results.push(cursor.value)
            cursor.continue()
          } else {
            resolve(results)
          }
        }

        request.onerror = (event) => {
          console.error("Error getting entries:", event)
          reject("Failed to get entries")
        }
      })
    } catch (error) {
      console.error("Failed to get analyses:", error)
      return [] // Return empty array if database fails
    }
  }

  async getAnalyses(limit = 10, offset = 0): Promise<AnalysisEntry[]> {
    try {
      const allAnalyses = await this.getAllAnalyses()
      return allAnalyses.slice(offset, offset + limit)
    } catch (error) {
      console.error("Failed to get analyses with pagination:", error)
      return [] // Return empty array if database fails
    }
  }

  async getAnalysesByExercise(exerciseType: string): Promise<AnalysisEntry[]> {
    try {
      const db = await this.dbReady

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["analysis_history"], "readonly")
        const store = transaction.objectStore("analysis_history")
        const index = store.index("exercise_type")
        const request = index.getAll(exerciseType)

        request.onsuccess = () => {
          const results = request.result as AnalysisEntry[]
          // Sort by created_at descending
          results.sort((a, b) => {
            return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime()
          })
          resolve(results)
        }

        request.onerror = (event) => {
          console.error("Error getting entries by exercise:", event)
          reject("Failed to get entries")
        }
      })
    } catch (error) {
      console.error("Failed to get analyses by exercise:", error)
      return [] // Return empty array if database fails
    }
  }

  async getStats() {
    try {
      const allAnalyses = await this.getAllAnalyses()

      // Calculate total analyses
      const totalAnalyses = allAnalyses.length

      // Calculate average score
      const totalScore = allAnalyses.reduce((sum, entry) => sum + entry.form_score, 0)
      const averageScore = totalAnalyses > 0 ? Math.round(totalScore / totalAnalyses) : 0

      // Calculate recent analyses (last 7 days)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const recentAnalyses = allAnalyses.filter((entry) => new Date(entry.created_at || "") >= oneWeekAgo)
      const currentStreak = recentAnalyses.length

      // Calculate improvement rate (last 30 days vs before)
      const oneMonthAgo = new Date()
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)

      const recentEntries = allAnalyses.filter((entry) => new Date(entry.created_at || "") >= oneMonthAgo)
      const olderEntries = allAnalyses.filter((entry) => new Date(entry.created_at || "") < oneMonthAgo)

      let improvementRate = 0
      if (recentEntries.length > 0 && olderEntries.length > 0) {
        const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.form_score, 0) / recentEntries.length
        const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.form_score, 0) / olderEntries.length
        improvementRate = Math.round(recentAvg - olderAvg)
      }

      return {
        totalAnalyses,
        averageScore,
        currentStreak,
        improvementRate,
      }
    } catch (error) {
      console.error("Failed to get stats:", error)
      return {
        totalAnalyses: 0,
        averageScore: 0,
        currentStreak: 0,
        improvementRate: 0,
      }
    }
  }

  async getExerciseDistribution() {
    try {
      const allAnalyses = await this.getAllAnalyses()

      // Group by exercise_type
      const exerciseMap = new Map<string, { count: number; totalScore: number }>()

      allAnalyses.forEach((entry) => {
        const exerciseType = entry.exercise_type
        if (!exerciseMap.has(exerciseType)) {
          exerciseMap.set(exerciseType, { count: 0, totalScore: 0 })
        }

        const current = exerciseMap.get(exerciseType)!
        current.count++
        current.totalScore += entry.form_score
      })

      // Convert to array and calculate average scores
      const distribution = Array.from(exerciseMap.entries()).map(([exercise_type, data]) => ({
        exercise_type,
        count: data.count,
        avg_score: Math.round(data.totalScore / data.count),
      }))

      // Sort by count descending
      return distribution.sort((a, b) => b.count - a.count)
    } catch (error) {
      console.error("Failed to get exercise distribution:", error)
      return [] // Return empty array if database fails
    }
  }
}

// Create singleton instance
export const fitnessDb = new IndexedDBDatabase()
