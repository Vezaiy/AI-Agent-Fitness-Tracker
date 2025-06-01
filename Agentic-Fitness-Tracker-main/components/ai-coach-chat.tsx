"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User, Zap, Target, AlertCircle } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  category?: "form" | "nutrition" | "programming" | "injury" | "general"
}

interface AiCoachChatProps {
  userProfile?: {
    fitnessLevel: string
    goals: string
    recentAnalyses: any[]
  }
}

export function AiCoachChat({ userProfile }: AiCoachChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "👋 Hi! I'm your AI Fitness Coach. I can help you with form corrections, workout programming, nutrition advice, and answer any fitness questions. What would you like to know?",
      timestamp: new Date(),
      category: "general",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    { text: "How can I improve my squat depth?", category: "form" },
    { text: "What should I eat before workouts?", category: "nutrition" },
    { text: "How often should I train?", category: "programming" },
    { text: "My knee hurts during lunges", category: "injury" },
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Form-related responses
    if (lowerMessage.includes("squat") && (lowerMessage.includes("depth") || lowerMessage.includes("low"))) {
      return `🎯 **Squat Depth Improvement:**

**Mobility Work:**
• Hip flexor stretches (3x30s daily)
• Ankle dorsiflexion exercises
• 90/90 hip stretches

**Strength Focus:**
• Goblet squats with pause at bottom
• Box squats to build confidence
• Bulgarian split squats for unilateral strength

**Form Cues:**
• "Sit back into a chair"
• Keep chest proud, weight in heels
• Aim for hip crease below knee level

**Progression:** Start with bodyweight, focus on depth before adding load. Practice 3x/week with 2-3 sets of 8-12 reps.`
    }

    if (lowerMessage.includes("knee") && lowerMessage.includes("hurt")) {
      return `⚠️ **Knee Pain During Exercise:**

**Immediate Actions:**
• Stop the painful movement immediately
• Apply ice if there's swelling
• Avoid activities that cause pain

**Common Causes:**
• Poor tracking (knees caving in)
• Excessive forward knee travel
• Tight hip flexors or weak glutes
• Inadequate warm-up

**Modifications:**
• Reduce range of motion
• Focus on glute activation exercises
• Try wall sits or isometric holds
• Consider physical therapy consultation

**⚠️ Important:** If pain persists, consult a healthcare professional before continuing exercise.`
    }

    if (lowerMessage.includes("nutrition") || lowerMessage.includes("eat")) {
      return `🍎 **Nutrition Guidance:**

**Pre-Workout (1-2 hours before):**
• Complex carbs: oatmeal, banana, whole grain toast
• Light protein: Greek yogurt, small protein shake
• Hydration: 16-20oz water

**Post-Workout (within 30 minutes):**
• Protein: 20-30g (whey, chicken, eggs)
• Carbs: 30-60g (fruit, rice, sweet potato)
• Hydration: Replace lost fluids

**Daily Targets:**
• Protein: 0.8-1.2g per lb body weight
• Carbs: 2-3g per lb (active individuals)
• Fats: 0.3-0.4g per lb body weight
• Water: Half your body weight in ounces

**Timing:** Eat every 3-4 hours, prioritize whole foods, and adjust portions based on your goals.`
    }

    if (lowerMessage.includes("train") || lowerMessage.includes("frequency") || lowerMessage.includes("often")) {
      return `📅 **Training Frequency Recommendations:**

**Beginner (0-6 months):**
• 3x/week full body
• 48-72 hours rest between sessions
• Focus on movement quality

**Intermediate (6-24 months):**
• 4-5x/week upper/lower or push/pull/legs
• 24-48 hours rest per muscle group
• Progressive overload emphasis

**Advanced (2+ years):**
• 5-6x/week specialized programming
• 24-48 hours rest per muscle group
• Periodized training blocks

**Recovery Indicators:**
• Sleep quality (7-9 hours)
• Energy levels throughout day
• Performance maintenance/improvement
• Absence of persistent soreness

**Listen to your body** - more isn't always better!`
    }

    if (lowerMessage.includes("push") && lowerMessage.includes("up")) {
      return `💪 **Push-up Form & Progression:**

**Perfect Form Checklist:**
• Straight line from head to heels
• Hands slightly wider than shoulders
• Lower chest to floor level
• Push through palms, not fingertips

**Common Mistakes:**
• Hip sagging (weak core)
• Pike position (compensation)
• Partial range of motion
• Head position errors

**Progression Path:**
1. Wall push-ups (2 weeks)
2. Incline push-ups (2-4 weeks)
3. Knee push-ups (2-4 weeks)
4. Full push-ups (ongoing)
5. Advanced variations

**Programming:** Start with 3 sets of max reps (good form), rest 60-90s between sets, train every other day.`
    }

    // General motivational response
    const generalResponses = [
      `💪 **Great question!** Based on your fitness journey, here's my advice:

**Key Principles:**
• Consistency beats perfection
• Progressive overload drives results
• Recovery is when growth happens
• Form quality over quantity always

**Your Next Steps:**
• Focus on movement patterns first
• Track your progress weekly
• Listen to your body's signals
• Celebrate small victories

**Remember:** Fitness is a marathon, not a sprint. Every workout, every healthy choice, and every question you ask is progress toward your goals!

What specific aspect would you like me to elaborate on?`,

      `🎯 **Excellent question!** Let me help you with that:

**Fundamental Approach:**
• Start where you are, not where you think you should be
• Master basics before advancing
• Consistency trumps intensity
• Quality movement patterns are everything

**Practical Tips:**
• Film yourself exercising for feedback
• Focus on 2-3 exercises per session
• Warm up properly (5-10 minutes)
• Cool down and stretch after workouts

**Mindset Matters:**
• Progress isn't always linear
• Some days will be harder than others
• Adaptation takes time (4-6 weeks typically)
• Your effort today pays dividends tomorrow

What other aspects of your fitness journey can I help clarify?`,
    ]

    return generalResponses[Math.floor(Math.random() * generalResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(
      () => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: generateAIResponse(inputValue),
          timestamp: new Date(),
          category: "general",
        }

        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      },
      1500 + Math.random() * 1000,
    )
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "form":
        return <Target className="w-4 h-4" />
      case "nutrition":
        return <Zap className="w-4 h-4" />
      case "injury":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Fitness Coach
        </CardTitle>
        <CardDescription>Get instant answers about form, nutrition, programming, and more</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Quick Questions */}
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuestion(q.text)}
              className="text-xs"
            >
              {getCategoryIcon(q.category)}
              <span className="ml-1">{q.text}</span>
            </Button>
          ))}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" ? "bg-blue-600" : "bg-green-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about form, nutrition, programming..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isTyping}
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
