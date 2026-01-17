// @ts-ignore
import { Innertube } from "youtubei.js";
// @ts-ignore
import axios from "axios";
function videoId(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|v\/|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
export const getTranscript = async (url) => {
    try {
        const videoID = videoId(url);
        if (!videoID)
            return null;
        // @ts-ignore
        const youtube = await Innertube.create();
        // @ts-ignore
        const info = await youtube.getInfo(videoID);
        // TRY AUTO / MANUAL TRANSCRIPT FIRST
        try {
            // @ts-ignore
            const transcriptData = await info.getTranscript();
            // @ts-ignore
            const cleanTranscript = transcriptData.transcript.content.body.initial_segments.map((segment) => ({
                text: segment.snippet.text,
                start: Number(segment.start_ms) / 1000,
                duration: (Number(segment.end_ms) - Number(segment.start_ms)) / 1000,
            }));
            return cleanTranscript;
        }
        catch {
            // fallback continues below
        }
        // FALLBACK: caption tracks
        // @ts-ignore
        const captionTracks = info.captions?.caption_tracks;
        if (!captionTracks || captionTracks.length === 0)
            return [];
        const bestTrack = captionTracks.find((t) => t.language_code === "en") ||
            captionTracks[0];
        if (!bestTrack)
            return [];
        // @ts-ignore
        const response = await axios.get(bestTrack.base_url);
        const xmlData = response.data;
        const matches = [
            ...xmlData.matchAll(/<text start="([\d.]+)" dur="([\d.]+)">([^<]+)<\/text>/g),
        ];
        const cleanTranscript = matches.map((match) => ({
            start: parseFloat(match[1]),
            duration: parseFloat(match[2]),
            text: match[3]
                .replace(/&amp;#39;/g, "'")
                .replace(/&amp;/g, "&"),
        }));
        return cleanTranscript;
    }
    catch (error) {
        console.error("Youtubei Error:", error);
        return null;
    }
};
//# sourceMappingURL=getTranscript.js.map