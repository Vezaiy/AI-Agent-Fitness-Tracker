"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import type * as THREE from "three"

interface Model3DViewerProps {
  exerciseType?: string
  analysisData?: {
    detectedExercise: string
    keyMovements: string[]
    formCorrections: string[]
  }
}

function AnimatedSquatModel({ analysisData }: { analysisData?: any }) {
  const groupRef = useRef<THREE.Group>(null)
  const [phase, setPhase] = useState(0) // 0 = standing, 1 = descending, 2 = bottom, 3 = ascending

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    const cycleTime = 4 // 4 seconds per cycle
    const normalizedTime = (time % cycleTime) / cycleTime

    // Calculate squat position based on time
    let squatDepth = 0
    let kneeAngle = 0
    let hipAngle = 0

    if (normalizedTime < 0.3) {
      // Descending phase
      const progress = normalizedTime / 0.3
      squatDepth = progress * 0.4
      kneeAngle = progress * 0.8
      hipAngle = progress * 0.3
    } else if (normalizedTime < 0.5) {
      // Bottom hold
      squatDepth = 0.4
      kneeAngle = 0.8
      hipAngle = 0.3
    } else if (normalizedTime < 0.8) {
      // Ascending phase
      const progress = (normalizedTime - 0.5) / 0.3
      squatDepth = 0.4 * (1 - progress)
      kneeAngle = 0.8 * (1 - progress)
      hipAngle = 0.3 * (1 - progress)
    } else {
      // Standing phase
      squatDepth = 0
      kneeAngle = 0
      hipAngle = 0
    }

    // Apply transformations to body parts
    groupRef.current.position.y = -squatDepth
  })

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.2]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.25, 1.3, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0.25, 1.3, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Animated Thighs */}
      <mesh position={[-0.1, 0.6, 0]} rotation={[phase * 0.5, 0, 0]}>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.1, 0.6, 0]} rotation={[phase * 0.5, 0, 0]}>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Animated Shins */}
      <mesh position={[-0.1, 0.2, phase * 0.2]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.1, 0.2, phase * 0.2]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.1, 0.05, phase * 0.3]}>
        <boxGeometry args={[0.12, 0.05, 0.2]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.1, 0.05, phase * 0.3]}>
        <boxGeometry args={[0.12, 0.05, 0.2]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      <Text position={[0, 2.2, 0]} fontSize={0.1} color="#4a90e2" anchorX="center" anchorY="middle">
        Proper Squat Movement
      </Text>

      {/* Movement indicators */}
      <Text position={[0.5, 1.5, 0]} fontSize={0.06} color="#27ae60" anchorX="left" anchorY="middle">
        ✓ Controlled descent
      </Text>
      <Text position={[0.5, 1.3, 0]} fontSize={0.06} color="#27ae60" anchorX="left" anchorY="middle">
        ✓ Knees track toes
      </Text>
      <Text position={[0.5, 1.1, 0]} fontSize={0.06} color="#27ae60" anchorX="left" anchorY="middle">
        ✓ Hip hinge pattern
      </Text>
    </group>
  )
}

function AnimatedPushupModel({ analysisData }: { analysisData?: any }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    const cycleTime = 3
    const normalizedTime = (time % cycleTime) / cycleTime

    // Calculate push-up position
    let armExtension = 0
    let bodyHeight = 0

    if (normalizedTime < 0.4) {
      // Descending
      const progress = normalizedTime / 0.4
      armExtension = progress * 0.3
      bodyHeight = -progress * 0.2
    } else if (normalizedTime < 0.6) {
      // Bottom hold
      armExtension = 0.3
      bodyHeight = -0.2
    } else {
      // Ascending
      const progress = (normalizedTime - 0.6) / 0.4
      armExtension = 0.3 * (1 - progress)
      bodyHeight = -0.2 * (1 - progress)
    }

    groupRef.current.position.y = bodyHeight
  })

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
      {/* Head */}
      <mesh position={[0, 0.15, 1.7]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0, 1.2]}>
        <boxGeometry args={[0.2, 0.6, 0.3]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      {/* Animated Arms */}
      <mesh position={[0, -0.4, 1.3]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0, 0.4, 1.3]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Legs */}
      <mesh position={[0, 0, 0.6]}>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      <Text position={[0, 0, 2.2]} fontSize={0.1} color="#4a90e2" anchorX="center" anchorY="middle">
        Proper Push-up Movement
      </Text>
    </group>
  )
}

function AnimatedDeadliftModel({ analysisData }: { analysisData?: any }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    const cycleTime = 4
    const normalizedTime = (time % cycleTime) / cycleTime

    let bendAngle = 0
    let barHeight = 0

    if (normalizedTime < 0.3) {
      // Descending
      const progress = normalizedTime / 0.3
      bendAngle = progress * 0.4
      barHeight = -progress * 0.3
    } else if (normalizedTime < 0.5) {
      // Bottom hold
      bendAngle = 0.4
      barHeight = -0.3
    } else if (normalizedTime < 0.8) {
      // Ascending
      const progress = (normalizedTime - 0.5) / 0.3
      bendAngle = 0.4 * (1 - progress)
      barHeight = -0.3 * (1 - progress)
    }

    // Apply hip hinge movement
    const torso = groupRef.current.children.find((child) => child.userData.name === "torso")
    if (torso) {
      torso.rotation.x = bendAngle
    }
  })

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Animated Torso */}
      <mesh position={[0, 1.2, 0.1]} userData={{ name: "torso" }}>
        <boxGeometry args={[0.3, 0.6, 0.2]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.2, 1.0, 0.2]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0.2, 1.0, 0.2]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Animated Barbell */}
      <mesh position={[0, 0.7, 0.3]}>
        <boxGeometry args={[1.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      <Text position={[0, 2.2, 0]} fontSize={0.1} color="#4a90e2" anchorX="center" anchorY="middle">
        Proper Deadlift Movement
      </Text>
    </group>
  )
}

function AnimatedPlankModel({ analysisData }: { analysisData?: any }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    // Subtle breathing animation
    const breathingOffset = Math.sin(time * 2) * 0.02

    groupRef.current.position.y = breathingOffset
  })

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
      {/* Static plank position with breathing animation */}
      <mesh position={[0, 0.15, 1.7]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      <mesh position={[0, 0, 1.2]}>
        <boxGeometry args={[0.2, 0.6, 0.3]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      <Text position={[0, 0, 2.2]} fontSize={0.1} color="#4a90e2" anchorX="center" anchorY="middle">
        Proper Plank Hold
      </Text>
    </group>
  )
}

function AnimatedLungeModel({ analysisData }: { analysisData?: any }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    const cycleTime = 4
    const normalizedTime = (time % cycleTime) / cycleTime

    let lungeDepth = 0
    let legPosition = 0

    if (normalizedTime < 0.3) {
      // Stepping forward and descending
      const progress = normalizedTime / 0.3
      lungeDepth = progress * 0.3
      legPosition = progress * 0.4
    } else if (normalizedTime < 0.5) {
      // Bottom hold
      lungeDepth = 0.3
      legPosition = 0.4
    } else if (normalizedTime < 0.8) {
      // Ascending and stepping back
      const progress = (normalizedTime - 0.5) / 0.3
      lungeDepth = 0.3 * (1 - progress)
      legPosition = 0.4 * (1 - progress)
    }

    groupRef.current.position.y = -lungeDepth
  })

  return (
    <group ref={groupRef}>
      {/* Animated lunge movement */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.2]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      <Text position={[0, 2.2, 0]} fontSize={0.1} color="#4a90e2" anchorX="center" anchorY="middle">
        Proper Lunge Movement
      </Text>
    </group>
  )
}

function ExerciseModel({ exerciseType, analysisData }: { exerciseType: string; analysisData?: any }) {
  const normalizedType = exerciseType?.toLowerCase().replace(/[^a-z]/g, "") || "squat"

  switch (normalizedType) {
    case "pushup":
    case "push-up":
      return <AnimatedPushupModel analysisData={analysisData} />
    case "deadlift":
      return <AnimatedDeadliftModel analysisData={analysisData} />
    case "plank":
      return <AnimatedPlankModel analysisData={analysisData} />
    case "lunge":
      return <AnimatedLungeModel analysisData={analysisData} />
    case "squat":
    default:
      return <AnimatedSquatModel analysisData={analysisData} />
  }
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
  )
}

export function Model3DViewer({ exerciseType = "squat", analysisData }: Model3DViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
        <Suspense fallback={<LoadingFallback />}>
          <Environment preset="studio" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <ExerciseModel exerciseType={exerciseType} analysisData={analysisData} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  )
}
