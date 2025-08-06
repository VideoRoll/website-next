import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface FeedbackData {
  dissatisfiedFeatures: string[];
  desiredFeatures: string[];
  otherFeatures?: string;
  reason?: number; // Optional field for the reason
  version?: string; // Optional field for the version
}

export async function POST(request: NextRequest) {
  try {
    const feedbackData: FeedbackData = await request.json();

    // Validate the data
    if (
      (!feedbackData.dissatisfiedFeatures ||
        feedbackData.dissatisfiedFeatures.length === 0) &&
      (!feedbackData.desiredFeatures ||
        feedbackData.desiredFeatures.length === 0)
    ) {
      return NextResponse.json(
        { error: "At least one field must be selected" },
        { status: 400 }
      );
    }

    let ip = '';
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      ip = forwarded.split(",")[0].trim(); // 支持多个代理链
    }

    // Create Supabase client
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("RATE_FEEDBACK")
      .insert([
        {
          unsatisfied: feedbackData.dissatisfiedFeatures.join(","),
          wanted: `${feedbackData.desiredFeatures.join(",")}${
            feedbackData.otherFeatures ?? ""
          }`,
          reason: Number(feedbackData.reason),
          version: String(feedbackData.version) || null,
          ip
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save feedback to database" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
