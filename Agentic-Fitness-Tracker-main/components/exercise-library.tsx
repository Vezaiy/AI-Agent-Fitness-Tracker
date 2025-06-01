"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, Target, Zap, Users } from "lucide-react"

interface Exercise {
  id: string
  name: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  muscleGroups: string[]
  equipment: string[]
  description: string
  instructions: string[]
  tips: string[]
  commonMistakes: string[]
  variations: string[]
  sets: string
  reps: string
  rest: string
}

const exerciseDatabase: Exercise[] = [
  {
    id: "squat",
    name: "Bodyweight Squat",
    category: "Lower Body",
    difficulty: "beginner",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    equipment: ["None"],
    description: "A fundamental lower body movement that builds strength and mobility in the hips, knees, and ankles.",
    instructions: [
      "Stand with feet shoulder-width apart, toes slightly turned out",
      "Initiate movement by pushing hips back and bending knees",
      "Lower until hip crease is below knee level",
      "Drive through heels to return to starting position",
      "Keep chest proud and core engaged throughout",
    ],
    tips: [
      "Think 'sit back into a chair' to initiate the movement",
      "Keep knees tracking over toes",
      "Maintain neutral spine throughout the movement",
      "Focus on controlled descent and powerful ascent",
    ],
    commonMistakes: [
      "Knees caving inward",
      "Forward knee drift past toes",
      "Excessive forward lean",
      "Incomplete depth",
      "Rising onto toes",
    ],
    variations: ["Goblet Squat", "Jump Squat", "Single-Leg Squat", "Sumo Squat", "Wall Squat"],
    sets: "3-4",
    reps: "10-15",
    rest: "60-90s",
  },
  {
    id: "pushup",
    name: "Push-up",
    category: "Upper Body",
    difficulty: "intermediate",
    muscleGroups: ["Chest", "Shoulders", "Triceps", "Core"],
    equipment: ["None"],
    description: "A classic upper body exercise that builds pushing strength and core stability.",
    instructions: [
      "Start in plank position with hands slightly wider than shoulders",
      "Lower chest toward floor while maintaining straight line",
      "Push through palms to return to starting position",
      "Keep core engaged and hips level throughout",
    ],
    tips: [
      "Maintain rigid plank position from head to heels",
      "Lower chest to floor level for full range of motion",
      "Keep elbows at 45-degree angle to torso",
      "Breathe in on descent, out on ascent",
    ],
    commonMistakes: [
      "Hip sagging or piking",
      "Partial range of motion",
      "Flared elbows",
      "Head position errors",
      "Pushing through fingertips",
    ],
    variations: ["Incline Push-up", "Knee Push-up", "Diamond Push-up", "Wide-Grip Push-up", "Single-Arm Push-up"],
    sets: "3-4",
    reps: "8-12",
    rest: "60-90s",
  },
  {
    id: "deadlift",
    name: "Romanian Deadlift",
    category: "Full Body",
    difficulty: "intermediate",
    muscleGroups: ["Hamstrings", "Glutes", "Erector Spinae", "Lats"],
    equipment: ["Dumbbells", "Barbell"],
    description: "A hip-hinge movement that targets the posterior chain and teaches proper lifting mechanics.",
    instructions: [
      "Stand with feet hip-width apart, holding weight in front of thighs",
      "Initiate by pushing hips back while maintaining neutral spine",
      "Lower weight by hinging at hips, slight knee bend",
      "Feel stretch in hamstrings, then drive hips forward to return",
      "Keep weight close to body throughout movement",
    ],
    tips: [
      "Lead with hips, not knees",
      "Maintain neutral spine throughout",
      "Keep shoulders back and chest proud",
      "Feel the stretch in your hamstrings",
    ],
    commonMistakes: [
      "Rounded back",
      "Weight drifting away from body",
      "Knee-dominant movement",
      "Hyperextension at top",
      "Looking up excessively",
    ],
    variations: ["Single-Leg RDL", "Stiff-Leg Deadlift", "Sumo Deadlift", "Trap Bar Deadlift", "Deficit Deadlift"],
    sets: "3-4",
    reps: "8-10",
    rest: "90-120s",
  },
  {
    id: "plank",
    name: "Plank Hold",
    category: "Core",
    difficulty: "beginner",
    muscleGroups: ["Core", "Shoulders", "Glutes"],
    equipment: ["None"],
    description: "An isometric core exercise that builds stability and endurance throughout the entire core.",
    instructions: [
      "Start in forearm plank position with elbows under shoulders",
      "Maintain straight line from head to heels",
      "Engage core and squeeze glutes",
      "Breathe normally while holding position",
      "Hold for prescribed time",
    ],
    tips: [
      "Focus on quality over duration",
      "Keep hips level - no sagging or piking",
      "Distribute weight evenly on forearms",
      "Maintain normal breathing pattern",
    ],
    commonMistakes: ["Hip sagging", "Pike position", "Holding breath", "Shoulder elevation", "Looking up or down"],
    variations: ["Side Plank", "Plank Up-Downs", "Plank with Leg Lift", "Mountain Climbers", "Plank Jacks"],
    sets: "3-4",
    reps: "30-60s",
    rest: "60s",
  },
  {
    id: "lunge",
    name: "Forward Lunge",
    category: "Lower Body",
    difficulty: "intermediate",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    equipment: ["None"],
    description: "A unilateral lower body exercise that improves balance, coordination, and single-leg strength.",
    instructions: [
      "Stand tall with feet hip-width apart",
      "Step forward with one leg, lowering hips",
      "Lower until both knees are at 90-degree angles",
      "Push through front heel to return to starting position",
      "Alternate legs or complete all reps on one side",
    ],
    tips: [
      "Keep torso upright throughout movement",
      "Step far enough forward for proper angles",
      "Control the descent, power the ascent",
      "Keep front knee tracking over ankle",
    ],
    commonMistakes: [
      "Step too short",
      "Knee tracking over toes",
      "Excessive forward lean",
      "Pushing off back toe",
      "Uneven weight distribution",
    ],
    variations: ["Reverse Lunge", "Lateral Lunge", "Walking Lunge", "Jump Lunge", "Curtsy Lunge"],
    sets: "3-4",
    reps: "10-12 each leg",
    rest: "60-90s",
  },
  {
    id: "pullup",
    name: "Pull-up",
    category: "Upper Body",
    difficulty: "advanced",
    muscleGroups: ["Lats", "Rhomboids", "Biceps", "Core"],
    equipment: ["Pull-up Bar"],
    description: "A challenging upper body pulling exercise that builds back strength and grip endurance.",
    instructions: [
      "Hang from bar with hands slightly wider than shoulders",
      "Engage lats and pull chest toward bar",
      "Lead with chest, not chin",
      "Lower with control to full arm extension",
      "Maintain core engagement throughout",
    ],
    tips: [
      "Think 'pull chest to bar' not 'chin over bar'",
      "Engage lats before pulling",
      "Control the negative portion",
      "Keep shoulders down and back",
    ],
    commonMistakes: [
      "Kipping or swinging",
      "Partial range of motion",
      "Chin-only pull-ups",
      "Shoulder elevation",
      "Lack of core engagement",
    ],
    variations: ["Assisted Pull-up", "Chin-up", "Wide-Grip Pull-up", "Commando Pull-up", "Weighted Pull-up"],
    sets: "3-4",
    reps: "5-8",
    rest: "90-120s",
  },
]

export function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const categories = ["all", ...Array.from(new Set(exerciseDatabase.map((ex) => ex.category)))]
  const difficulties = ["all", "beginner", "intermediate", "advanced"]

  const filteredExercises = exerciseDatabase.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscleGroups.some((muscle) => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (selectedExercise) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedExercise(null)}>
            ← Back to Library
          </Button>
          <h2 className="text-2xl font-bold">{selectedExercise.name}</h2>
          <Badge className={getDifficultyColor(selectedExercise.difficulty)}>{selectedExercise.difficulty}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{selectedExercise.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Target Muscles</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedExercise.muscleGroups.map((muscle, index) => (
                        <Badge key={index} variant="outline">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Equipment</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedExercise.equipment.map((item, index) => (
                        <Badge key={index} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="font-bold text-lg">{selectedExercise.sets}</div>
                    <div className="text-sm text-gray-600">Sets</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{selectedExercise.reps}</div>
                    <div className="text-sm text-gray-600">Reps</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{selectedExercise.rest}</div>
                    <div className="text-sm text-gray-600">Rest</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step-by-Step Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="tips">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tips">Tips</TabsTrigger>
                <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
                <TabsTrigger value="variations">Variations</TabsTrigger>
              </TabsList>

              <TabsContent value="tips">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedExercise.tips.map((tip, index) => (
                        <li key={index} className="flex gap-3">
                          <Zap className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mistakes">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-600" />
                      Common Mistakes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedExercise.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <div className="w-2 h-2 bg-red-600 rounded-full" />
                          </div>
                          <span className="text-gray-700">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variations">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-blue-600" />
                      Exercise Variations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {selectedExercise.variations.map((variation, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="font-medium text-blue-900">{variation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Exercise Library</h2>
        <p className="text-gray-600">Comprehensive exercise database with detailed instructions and form cues</p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty === "all" ? "All Levels" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-600 flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {filteredExercises.length} exercises found
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <CardDescription>{exercise.category}</CardDescription>
                </div>
                <Badge className={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.description}</p>

              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500">Target Muscles:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exercise.muscleGroups.slice(0, 3).map((muscle, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                    {exercise.muscleGroups.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{exercise.muscleGroups.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{exercise.sets} sets</span>
                  <span>{exercise.reps} reps</span>
                  <span>{exercise.rest} rest</span>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline" onClick={() => setSelectedExercise(exercise)}>
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No exercises found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
              setSelectedDifficulty("all")
            }}
            className="mt-2"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
