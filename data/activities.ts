import { Activity } from '../types';
const placeholder = "/img/logo-mfu-v2.png";
const imgImage1 = placeholder;
const imgImage2 = placeholder;
const imgImage3 = placeholder;

// Mock activity data - easy to edit!
export const activities: Activity[] = [
  {
    id: "1",
    title: "Annual Basketball Tournament",
    date: "13/3/26",
    time: "1:30 PM",
    location: "Basketball court",
    image: imgImage1,
    status: "registered"
  },
  {
    id: "2",
    title: "Football Tournament",
    date: "12/3/26",
    time: "1:30 PM",
    location: "MFU Outdoor stadium",
    image: imgImage3,
    status: "open"
  },
  {
    id: "3",
    title: "Archery activity",
    date: "12/3/26",
    time: "1:30 PM",
    location: "Some ajarn's house",
    image: imgImage2,
    status: "registered"
  },
  {
    id: "4",
    title: "Archery activity first tournament",
    date: "10/3/26",
    time: "1:30 PM",
    location: "Some ajarn's house",
    image: imgImage2,
    status: "completed"
  }
];
