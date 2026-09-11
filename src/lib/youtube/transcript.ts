"use server"
import { fetchTranscript } from "youtube-transcript-plus";

export async function getYouTubeTranscript(videoId: string) {
    const transcript = await fetchTranscript(videoId);
    return transcript;
}