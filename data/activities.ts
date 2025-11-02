import { Activity } from '../types';

// Use the same lightweight 1x1 GIF data URL for all mock images so the build doesn't require external assets.
const PLACEHOLDER_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

// Mock activity data - easy to edit!
export const activities: Activity[] = [
  {
    id: "1",
    title: "Annual Basketball Tournament",
    date: "13/3/26",
    time: "1:30 PM",
    location: "Basketball court",
    image: PLACEHOLDER_DATA_URL,
    status: "registered"
  },
  {
    id: "2",
    title: "Football Tournament",
    date: "12/3/26",
    time: "1:30 PM",
    location: "MFU Outdoor stadium",
    image: PLACEHOLDER_DATA_URL,
    status: "open"
  },
  {
    id: "3",
    title: "Archery activity",
    date: "12/3/26",
    time: "1:30 PM",
    location: "Some ajarn's house",
    image: PLACEHOLDER_DATA_URL,
    status: "registered"
  },
  {
    id: "4",
    title: "Archery activity first tournament",
    date: "10/3/26",
    time: "1:30 PM",
    location: "Some ajarn's house",
    image: PLACEHOLDER_DATA_URL,
    status: "completed"
  }
];
