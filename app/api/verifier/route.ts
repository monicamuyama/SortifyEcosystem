import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Verifier API endpoints are available at /verifier/pending-deposits and /verifier/record-verification"
  })
}
