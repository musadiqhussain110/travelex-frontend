import hotelHero2 from "../assets/Hotels/Hotel6.jpg"
import hotelHero3 from "../assets/Hotels/Hotel5.jpg"
import hotelHero4 from "../assets/Hotels/makkahHotel4.jpg"

export const hotels = [
  {
    id: "marriott-hotel",
    name: "Marriott Hotel",
    location: "Islamabad",
    price: "from PKR 56,235 / night",
    startingPrice: 56235,
    image: hotelHero2,
    stars: 3,
    type: "City Hotel",
    shortDescription:
      "A comfortable hotel option suitable for business travel, family stay, and city-based trips with TravelEx booking guidance.",
    overview:
      "This hotel option is suitable for travelers who need a comfortable stay, reliable booking guidance, and support before final confirmation.",
    highlights: [
      "Suitable for city stay",
      "Business and family travel support",
      "Room options available",
      "Direct booking flow available",
    ],
    facilities: ["WiFi", "Breakfast", "Laundry", "Room Service"],
    roomOptions: ["Standard Room", "Deluxe Room", "Family Room"],
    suitableFor: ["Business travel", "Family stay", "City stay"],
    note:
      "Final hotel price may vary based on travel dates, room category, number of guests, meal plan, availability, and supplier policy.",
  },
  {
    id: "family-stay-hotel",
    name: "Family Stay Hotel",
    location: "Makkah / Madinah options",
    price: "from PKR 42,000 / night",
    startingPrice: 42000,
    image: hotelHero4,
    stars: 4,
    type: "Family Stay",
    shortDescription:
      "A family-friendly hotel option for Umrah travelers who need room sharing, flexible stay, and hotel guidance near Haram areas.",
    overview:
      "This option is designed for families and Umrah travelers who need hotel support in Makkah and Madinah.",
    highlights: [
      "Family-friendly stay options",
      "Makkah and Madinah guidance",
      "Room sharing support",
      "Near Haram options on request",
    ],
    facilities: ["Family Rooms", "Near Haram Options", "Flexible Stay"],
    roomOptions: ["Quad Room", "Triple Room", "Double Room", "Family Room"],
    suitableFor: ["Families", "Umrah travelers", "Group stay"],
    note:
      "Hotel distance, room type, and price depend on selected dates, availability, and preferred hotel category.",
  },
  {
    id: "budget-hotel-options",
    name: "Budget Hotel Options",
    location: "Dubai / Turkey / Baku",
    price: "from PKR 28,500 / night",
    startingPrice: 28500,
    image: hotelHero3,
    stars: 5,
    type: "International Stay",
    shortDescription:
      "International hotel options for travelers looking for budget-friendly stays in popular destinations with TravelEx assistance.",
    overview:
      "This hotel option is suitable for international travelers looking for stay support in destinations such as Dubai, Turkey, Baku, and other travel locations.",
    highlights: [
      "International hotel support",
      "Budget-based hotel guidance",
      "Custom stay recommendations",
      "Direct booking flow available",
    ],
    facilities: ["Breakfast Options", "Consultant Support", "Flexible Budget"],
    roomOptions: ["Budget Room", "Standard Room", "Deluxe Room"],
    suitableFor: ["International tours", "Budget trips", "Family travel"],
    note:
      "Final price depends on destination, travel season, room type, hotel category, number of guests, and supplier availability.",
  },
]