import { Activity } from '../types';

// Import real image files from src (Option A) so webpack/Next bundles them and
// components can access a stable `image.src` URL. Files already present in `src/`.
import basketballImg from '../src/basketball_image.png';
import footballImg from '../src/Football_image.png';
import archeryImg from '../src/Archery_image.png';

// Use the same lightweight 1x1 GIF data URL for fallback when needed.
const PLACEHOLDER_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

// Mock activity data - easy to edit!
export const activities: Activity[] = [
  {
    id: "1",
    title: "Annual Basketball Tournament",
    date: "13/3/26",
    time: "1:30 PM",
    location: "Basketball court",
    // set to imported module (ActivityCard will use .src)
    image: basketballImg,
    status: "registered"
  },
  {
    id: "2",
    title: "Football Tournament",
    date: "12/3/26",
    time: "1:30 PM",
    location: "MFU Outdoor stadium",
    image: footballImg,
    status: "open"
  },
  {
    id: "3",
    title: "Archery activity",
    date: "12/3/26",
    time: "1:30 PM",
    location: "Some ajarn's house",
    image: archeryImg,
    status: "registered"
  },
  {
    id: "4",
    title: "Archery activity first tournament",
    date: "10/3/26",
    time: "1:30 PM",
    location: "Some ajarn's house",
    // reuse archery image as a sensible default for this mock
    image: archeryImg,
    status: "completed"
  }
];
