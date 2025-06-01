import { type NextRequest, NextResponse } from "next/server"

// This is a server-side API route, but we'll use client-side IndexedDB instead
// This file remains as a placeholder for compatibility
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Progress data is now handled client-side with IndexedDB",
  })
}
