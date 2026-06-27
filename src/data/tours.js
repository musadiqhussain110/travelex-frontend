import baku from "../assets/tours/baku.jpg"
import turkey from "../assets/tours/istanbul.jpg"
import malaysia from "../assets/tours/malaysia.jpg"
import customTour from "../assets/tours/dubai.jpg"

export const tours = [
  {
    id: "baku-azerbaijan-tour",
    title: "Baku Azerbaijan Tour",
    badge: "Azerbaijan",
    type: "Azerbaijan Tour",
    rating: "4.8",
    location: "Baku",
    price: "PKR 240,000",
    duration: "4 to 5 Days",
    image: baku,
    overview:
      "Explore Baku with a comfortable international tour plan including hotel guidance, transport support, sightseeing options, and customized travel assistance by TravelEx.",
    points: [
      "Baku city sightseeing",
      "Old City and modern Baku experience",
      "Family-friendly travel planning",
      "Hotel and transport guidance",
      "Customizable travel dates",
      "WhatsApp consultant support",
    ],
    inclusions: [
      "Hotel booking support",
      "Airport transfer guidance",
      "Tour planning support",
      "Visa guidance",
      "Transport arrangement support",
      "Travel consultant assistance",
    ],
    note:
      "Final tour price may vary according to travel dates, hotel category, airline fare, room sharing, and availability.",
  },
  {
    id: "istanbul-turkey-tour",
    title: "Istanbul Turkey Tour",
    badge: "Turkey",
    type: "Turkey Tour",
    rating: "4.9",
    location: "Istanbul",
    price: "PKR 326,500",
    duration: "5 to 7 Days",
    image: turkey,
    overview:
      "Plan your Istanbul tour with hotel options, sightseeing guidance, airport transfer support, and a flexible itinerary based on your travel style.",
    points: [
      "Istanbul city experience",
      "Historical places and cultural attractions",
      "Flexible family and couple planning",
      "Hotel and transport support",
      "Custom itinerary options",
      "WhatsApp planning support",
    ],
    inclusions: [
      "Hotel booking support",
      "Airport transfer guidance",
      "Sightseeing plan guidance",
      "Visa assistance guidance",
      "Transport arrangement support",
      "Travel consultant assistance",
    ],
    note:
      "Final package cost depends on airline fare, travel dates, hotel category, number of travelers, and selected activities.",
  },
  {
    id: "kuala-lumpur-malaysia-tour",
    title: "Kuala Lumpur Malaysia Tour",
    badge: "Malaysia",
    type: "Malaysia Tour",
    rating: "4.8",
    location: "Kuala Lumpur",
    price: "PKR 300,000",
    duration: "5 Days",
    image: malaysia,
    overview:
      "Discover Kuala Lumpur with a comfortable international tour plan including hotel guidance, city attractions, transfer support, and customized travel assistance.",
    points: [
      "Kuala Lumpur city tour options",
      "Family-friendly travel planning",
      "Hotel and transport support",
      "Flexible itinerary planning",
      "Budget-based customization",
      "WhatsApp consultant support",
    ],
    inclusions: [
      "Hotel booking support",
      "Airport transfer guidance",
      "City tour planning",
      "Visa guidance",
      "Transport arrangement support",
      "Travel consultant assistance",
    ],
    note:
      "Tour cost may change depending on travel dates, selected hotel, airline fare, room sharing, and availability.",
  },
  {
    id: "custom-international-tour",
    title: "Custom International Tour",
    badge: "Custom",
    type: "Customized Tour",
    rating: "5.0",
    location: "Worldwide",
    price: "Custom Quote",
    duration: "Flexible",
    image: customTour,
    overview:
      "Create your own international tour plan with TravelEx according to your destination, budget, travel dates, hotel preference, and number of travelers.",
    points: [
      "Destination of your choice",
      "Budget-based planning",
      "Flexible travel dates",
      "Hotel and transport customization",
      "Family and group planning",
      "WhatsApp consultant support",
    ],
    inclusions: [
      "Custom itinerary support",
      "Hotel booking guidance",
      "Transport planning support",
      "Visa guidance",
      "Tour activity planning",
      "Travel consultant assistance",
    ],
    note:
      "Share your destination, travel dates, travelers, hotel preference, and budget to receive a suitable customized tour quote.",
  },
]