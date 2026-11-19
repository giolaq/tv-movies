export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: number;
  genre: string;
  rating: string;
  description: string;
  poster: string;
}
export const movies: Movie[] = [
  {
    "id": "1",
    "title": "The Quiet Earth",
    "year": 2024,
    "runtime": 112,
    "genre": "Horizons",
    "rating": "8.7",
    "description": "A cartographer follows a forgotten signal into the last wilderness.",
    "poster": "https://picsum.photos/seed/frame-forest/480/700"
  },
  {
    "id": "2",
    "title": "Beyond the Blue",
    "year": 2023,
    "runtime": 118,
    "genre": "Horizons",
    "rating": "8.4",
    "description": "Two strangers cross an ocean with only the stars to guide them.",
    "poster": "https://picsum.photos/seed/frame-ocean/480/700"
  },
  {
    "id": "3",
    "title": "A Thousand Miles",
    "year": 2025,
    "runtime": 126,
    "genre": "Horizons",
    "rating": "9.1",
    "description": "A journey through the mountains becomes a journey back home.",
    "poster": "https://picsum.photos/seed/frame-mountain/480/700"
  },
  {
    "id": "4",
    "title": "Solaris Drift",
    "year": 2024,
    "runtime": 134,
    "genre": "Horizons",
    "rating": "8.2",
    "description": "At the edge of the solar system, a crew discovers an impossible garden.",
    "poster": "https://picsum.photos/seed/frame-space/480/700"
  },
  {
    "id": "5",
    "title": "Wild North",
    "year": 2022,
    "runtime": 103,
    "genre": "Horizons",
    "rating": "8.6",
    "description": "A photographer finds unexpected friendship beneath the northern lights.",
    "poster": "https://picsum.photos/seed/frame-north/480/700"
  },
  {
    "id": "6",
    "title": "After Midnight",
    "year": 2025,
    "runtime": 109,
    "genre": "After hours",
    "rating": "8.8",
    "description": "A late-night radio host receives a call from her future self.",
    "poster": "https://picsum.photos/seed/frame-night/480/700"
  },
  {
    "id": "7",
    "title": "Neon District",
    "year": 2024,
    "runtime": 117,
    "genre": "After hours",
    "rating": "8.1",
    "description": "One missing painting draws a detective into a city of secrets.",
    "poster": "https://picsum.photos/seed/frame-neon/480/700"
  },
  {
    "id": "8",
    "title": "Last Train Home",
    "year": 2023,
    "runtime": 98,
    "genre": "After hours",
    "rating": "8.5",
    "description": "Five passengers. One destination. Nothing left to lose.",
    "poster": "https://picsum.photos/seed/frame-train/480/700"
  },
  {
    "id": "9",
    "title": "The Glass Room",
    "year": 2022,
    "runtime": 121,
    "genre": "After hours",
    "rating": "7.9",
    "description": "An architect discovers the house she designed hides a second life.",
    "poster": "https://picsum.photos/seed/frame-glass/480/700"
  },
  {
    "id": "10",
    "title": "Velvet Sky",
    "year": 2025,
    "runtime": 106,
    "genre": "After hours",
    "rating": "8.3",
    "description": "A jazz musician risks everything for one final performance.",
    "poster": "https://picsum.photos/seed/frame-jazz/480/700"
  },
  {
    "id": "11",
    "title": "Sunday Morning",
    "year": 2024,
    "runtime": 114,
    "genre": "Human stories",
    "rating": "8.9",
    "description": "Three generations reunite to save the family's neighborhood bakery.",
    "poster": "https://picsum.photos/seed/frame-sunday/480/700"
  },
  {
    "id": "12",
    "title": "Little Wonders",
    "year": 2023,
    "runtime": 97,
    "genre": "Human stories",
    "rating": "8.6",
    "description": "A young inventor and her grandfather build something extraordinary.",
    "poster": "https://picsum.photos/seed/frame-wonder/480/700"
  },
  {
    "id": "13",
    "title": "Letters to June",
    "year": 2025,
    "runtime": 108,
    "genre": "Human stories",
    "rating": "8.4",
    "description": "A box of unsent letters changes the course of a quiet summer.",
    "poster": "https://picsum.photos/seed/frame-letters/480/700"
  },
  {
    "id": "14",
    "title": "The Long Way",
    "year": 2022,
    "runtime": 123,
    "genre": "Human stories",
    "rating": "8.2",
    "description": "An unlikely pair walk across the country, one conversation at a time.",
    "poster": "https://picsum.photos/seed/frame-road/480/700"
  },
  {
    "id": "15",
    "title": "Paper Planes",
    "year": 2024,
    "runtime": 101,
    "genre": "Human stories",
    "rating": "8.7",
    "description": "Two childhood friends rediscover the promise they made years ago.",
    "poster": "https://picsum.photos/seed/frame-paper/480/700"
  },
  {
    "id": "16",
    "title": "Hidden Kingdom",
    "year": 2025,
    "runtime": 92,
    "genre": "Into the wild",
    "rating": "9.0",
    "description": "An intimate portrait of life beneath an ancient forest canopy.",
    "poster": "https://picsum.photos/seed/frame-jungle/480/700"
  },
  {
    "id": "17",
    "title": "Tides of Time",
    "year": 2024,
    "runtime": 96,
    "genre": "Into the wild",
    "rating": "8.5",
    "description": "Follow the ocean's great migration across four seasons.",
    "poster": "https://picsum.photos/seed/frame-tides/480/700"
  },
  {
    "id": "18",
    "title": "Desert Bloom",
    "year": 2023,
    "runtime": 88,
    "genre": "Into the wild",
    "rating": "8.8",
    "description": "In the driest place on Earth, a remarkable world awakens.",
    "poster": "https://picsum.photos/seed/frame-desert/480/700"
  },
  {
    "id": "19",
    "title": "Above It All",
    "year": 2022,
    "runtime": 94,
    "genre": "Into the wild",
    "rating": "8.3",
    "description": "A bird's-eye view of the landscapes that connect us.",
    "poster": "https://picsum.photos/seed/frame-above/480/700"
  },
  {
    "id": "20",
    "title": "River of Light",
    "year": 2025,
    "runtime": 102,
    "genre": "Into the wild",
    "rating": "8.6",
    "description": "A river's thousand-mile journey from glacier to open sea.",
    "poster": "https://picsum.photos/seed/frame-river/480/700"
  }
];
