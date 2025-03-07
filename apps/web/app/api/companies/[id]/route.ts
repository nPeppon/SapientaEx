import { NextResponse } from "next/server";
import { db } from "@repo/database";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description } = body;

    const company = await db.company.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.company.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    );
  }
} 