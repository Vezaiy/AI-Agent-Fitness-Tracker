"use client"

import { useState } from "react"

interface Goal {
  id: string
  title: string
  description: string
  category: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: string
  status: "active" | "completed" | "paused"
  createdAt: string
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  value: number
  completed: boolean
  completedAt?: string
}

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "",
    targetValue: 0,
    unit: "",
    deadline: "",
  })

  const goalCategories = [
    "Strength",
    "Endurance",
    "Weight Loss",
    "Muscle Gain",
    "Flexibility",
    "Performance",
    "Habit Building"
  ]

  const goalTemplates = [
    {
      title: "Improve Push-up Strength",
      description: "Increase maximum consecutive push-ups",
      category: "Strength",
      targetValue: 50,
      unit: "push-ups",
      milestones: [
        { title: "First 10 push-ups", value: 10 },
        { title: "Reach 25 push-ups", value: 25 },
        { title: "Hit 40 push-ups", value: 40 }
      ]
    },
    {
      title: "Perfect Squat Form",
      description: "Achieve consistent 90+ form scores",
      category: "Performance",
      targetValue: 90,
      unit: "% form score",
      milestones: [
        { title: "Reach 75% average", value: 75 },
        { title: "Reach 85% average", value: 85 }
      ]
    },
    {
      title: "Weekly Exercise Consistency",
      description: "Complete workouts 4 times per week",
      category: "Habit Building",
      targetValue: 16,
      unit: "workouts/month",
      milestones: [
        { title: "First week complete", value: 4 },
        { title: "Two weeks consistent", value: 8 },
        { title: "Three weeks strong",\
