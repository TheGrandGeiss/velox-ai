// app/api/schedule/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API_KEY });

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    // Call genai
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Structure my tasks from this and respond with a JSON array of objects with each task, It should have values that will satisfy everything fullcalendar needs to create an event, group into categories with things related to health green, book red, etc, the timestamps should be isostring start and end with a date that i can pass to fullcalendar/react add a lil description to the tasks, and if i say i want it done tomorrow, check what today is and sent the time for tomorrow. Return only the JSON, no other text or markdown. Here are my tasks: ${content}`,
    });

    // Safe extraction with proper type checking
    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error('No candidates returned from Gemini API');
    }

    const firstCandidate = response.candidates[0];

    if (
      !firstCandidate.content ||
      !firstCandidate.content.parts ||
      firstCandidate.content.parts.length === 0
    ) {
      throw new Error('No content parts found in candidate response');
    }

    const firstPart = firstCandidate.content.parts[0];

    if (!firstPart.text) {
      throw new Error('No text content found in response part');
    }

    const responseText = firstPart.text;

    // Clean the response - remove markdown code blocks and trim
    let cleanJsonString = responseText.trim();

    // Remove markdown code blocks if present
    if (cleanJsonString.startsWith('```json')) {
      cleanJsonString = cleanJsonString
        .replace(/```json\n?/, '')
        .replace(/\n?```/, '');
    } else if (cleanJsonString.startsWith('```')) {
      cleanJsonString = cleanJsonString
        .replace(/```\n?/, '')
        .replace(/\n?```/, '');
    }

    // Parse the JSON string to get the array of objects
    const tasksArray = JSON.parse(cleanJsonString);

    // Validate that we got an array
    if (!Array.isArray(tasksArray)) {
      throw new Error('Expected an array from Gemini response');
    }

    // Return just the cleaned array
    return NextResponse.json(tasksArray);
  } catch (error) {
    console.error('Error:', error);

    // Provide more specific error messages
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON returned from AI' },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
