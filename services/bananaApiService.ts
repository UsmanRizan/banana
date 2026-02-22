
import { BananaPuzzle } from "../types";

const BANANA_API_URL = "https://marcconrad.com/uob/banana/api.php?out=json&base64=yes";

export async function fetchBananaPuzzles(count: number): Promise<BananaPuzzle[]> {
  const puzzles: BananaPuzzle[] = [];
  
  try {
    // Fetch multiple puzzles in parallel
    const requests = Array(count).fill(null).map(() => 
      fetch(BANANA_API_URL).then(res => res.json())
    );
    
    const results = await Promise.all(requests);
    
    return results.map(data => ({
      // The API returns base64 data in the 'question' field when base64=yes is used
      question: `data:image/png;base64,${data.question}`, 
      solution: data.solution  // Answer
    }));
  } catch (error) {
    console.error("Error fetching banana puzzles:", error);
    // Fallback if API fails
    return Array(count).fill(null).map((_, i) => ({
      question: "https://picsum.photos/400/300?text=Error+Loading+Puzzle",
      solution: 5
    }));
  }
}
