import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const BASE64_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN88B8AAsUB4ZtvXtIAAAAASUVORK5CYII=";

export async function GET() {
  try {
    const buffer = Buffer.from(BASE64_PLACEHOLDER.split(",")[1], "base64");
    
    // Restaurant placeholder
    await writeFile(
      path.join(process.cwd(), "public", "restaurant-placeholder.jpg"),
      buffer
    );

    // Menu placeholder
    await writeFile(
      path.join(process.cwd(), "public", "menu-placeholder.jpg"),
      buffer
    );

    return NextResponse.json({ message: "Placeholder images created" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create placeholder images" },
      { status: 500 }
    );
  }
} 