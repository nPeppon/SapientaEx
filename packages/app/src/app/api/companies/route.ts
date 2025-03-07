import { NextResponse } from "next/server";
import { db } from "@repo/database";

export async function GET() {
  try {
    const companies = await db.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const company = await db.company.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
} 