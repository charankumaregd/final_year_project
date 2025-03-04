import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle GET request - Fetch all test records
export async function GET() {
  try {
    const tests = await prisma.test.findMany();
    return NextResponse.json(tests, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Handle POST request - Create a new test record
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const newTest = await prisma.test.create({ data: { name } });
    return NextResponse.json(newTest, { status: 201 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
