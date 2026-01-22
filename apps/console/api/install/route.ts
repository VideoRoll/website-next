import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@website-next/auth/supabase/server";
import { getAuthConfig } from "@/lib/auth-init";

export async function POST(request: NextRequest) {
  try {
    const installData = await request.json();

    // Validate the data
    if (
      !installData.version
    ) {
      return NextResponse.json(
        { error: "No version" },
        { status: 400 }
      );
    }

    let ip = '';
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      ip = forwarded.split(",")[0].trim(); // 支持多个代理链
    }

    // Create Supabase client
    const config = getAuthConfig();
    const supabase = await createClient(config);

    const { data, error } = await supabase
      .from("INSTALL")
      .insert([
        {
          version: installData.version,
          ip
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save install info to database" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Install info saved successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing install info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
