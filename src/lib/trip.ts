export type BaseStrategy = "single" | "multi";
export type Pace = "relaxed" | "balanced" | "packed";

export type TripForm = {
  destination: string;
  startDate: string;
  days: string;
  airport: string;
  budget: string;
  travelers: string;
  baseStrategy: BaseStrategy;
  pace: Pace;
  stayPreference: string;
  interests: string[];
};

export type Stay = {
  name: string;
  area: string;
  type: string;
  nightly: string;
  rating: number;
  reason: string;
  url: string;
};

export type Attraction = {
  name: string;
  category: string;
  rating: number;
  reviewSignal: string;
  distance: string;
  mapUrl: string;
};

export type DayPlan = {
  day: number;
  base: string;
  weather: string;
  focus: string;
  items: string[];
  estimate: string;
  mapUrl: string;
};

export type TripPlan = {
  title: string;
  summary: string;
  strategy: string;
  generatedAt: string;
  stays: Stay[];
  attractions: Attraction[];
  days: DayPlan[];
};

const interestLabels: Record<string, string> = {
  food: "food markets and local restaurants",
  history: "historic districts and landmark sites",
  nature: "parks, overlooks, and outdoor breaks",
  museums: "museums and galleries",
  beaches: "waterfront time and beaches",
  nightlife: "evening neighborhoods",
  shopping: "local shopping streets",
  adventure: "guided outdoor activities",
};

const baseAreas = [
  "Central District",
  "Old Town",
  "Riverside",
  "Museum Quarter",
  "Garden Quarter",
  "Market District",
  "Harborfront",
];
const weatherNotes = [
  "Mild morning, warmer afternoon, light jacket after sunset",
  "Clear early, scattered clouds later, comfortable walking weather",
  "Warm midday, plan indoor breaks around lunch",
  "Cooler day with a chance of showers, keep flexible museum options",
  "Bright and dry, ideal for viewpoints and open-air neighborhoods",
  "Humid afternoon, start early and reserve evening dining",
  "Breezy and pleasant, good day for longer walks",
];

const paceNotes: Record<Pace, string> = {
  relaxed: "Keep one anchor activity and leave open time for cafes, rests, or slower transit.",
  balanced: "Plan two main stops with a flexible slot for a guided experience or neighborhood walk.",
  packed: "Add an early start and a late-afternoon bonus stop if transit and weather stay easy.",
};

const paceEstimates: Record<Pace, string> = {
  relaxed: "$70 - $140 per person",
  balanced: "$95 - $180 per person",
  packed: "$130 - $240 per person",
};

const interestStops: Record<string, string[]> = {
  food: ["Local Food Market", "Neighborhood Restaurant Row"],
  history: ["Historic Center Walk", "Landmark Site"],
  nature: ["City Viewpoint Trail", "Riverside Park"],
  museums: ["Museum Quarter", "Top Rated Gallery"],
  beaches: ["Waterfront Promenade", "Nearest Beach Area"],
  nightlife: ["Evening District", "Live Music Street"],
  shopping: ["Central Shopping Mall", "Local Shopping Street"],
  adventure: ["Guided Outdoor Activity Base", "Scenic Adventure Stop"],
};

function areaSpecificStop(stop: string, area: string) {
  const normalizedStop = stop.toLowerCase();
  const normalizedArea = area.toLowerCase();

  if (normalizedStop.includes(normalizedArea)) {
    return stop;
  }

  if (normalizedStop.includes("central shopping mall")) {
    return `${area} shopping mall`;
  }

  if (normalizedStop.includes("local shopping street")) {
    return `${area} shopping street`;
  }

  if (normalizedStop.includes("local food market")) {
    return `${area} food market`;
  }

  if (normalizedStop.includes("neighborhood restaurant row")) {
    return `${area} restaurant row`;
  }

  return `${area} ${stop}`;
}

export const defaultForm: TripForm = {
  destination: "Lisbon, Portugal",
  startDate: "2026-06-12",
  days: "5",
  airport: "LIS",
  budget: "$1,500 - $2,500",
  travelers: "2",
  baseStrategy: "single",
  pace: "balanced",
  stayPreference: "Boutique hotel or apartment",
  interests: ["food", "history", "nature"],
};

export const interestOptions = [
  "food",
  "history",
  "nature",
  "museums",
  "beaches",
  "nightlife",
  "shopping",
  "adventure",
];

function optionalText(value: string, fallback: string) {
  return value.trim() || fallback;
}

function optionalNumber(value: string, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(Math.max(Math.round(parsed), min), max);
}

function hotelSearchUrl(stayName: string, destination: string) {
  const query =
    destination === "your destination" ? `${stayName} hotel` : `${stayName} ${destination}`;
  return `https://www.google.com/travel/hotels?q=${encodeURIComponent(query)}`;
}

function mapSearchUrl(placeName: string, destination: string) {
  const query =
    destination === "your destination" ? placeName : `${placeName} ${destination}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapDirectionsUrl(stops: string[], destination: string) {
  const seen = new Set<string>();
  const places = stops.flatMap((stop) => {
    const place =
      destination === "your destination" || stop.includes(destination)
        ? stop
        : `${stop} ${destination}`;
    const normalizedPlace = place.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

    if (!normalizedPlace || seen.has(normalizedPlace)) {
      return [];
    }

    seen.add(normalizedPlace);
    return [place];
  });
  const [origin, ...remainingStops] = places;
  const routeDestination = remainingStops.pop() ?? origin;
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination: routeDestination,
    travelmode: "walking",
  });

  if (remainingStops.length > 0) {
    params.set("waypoints", remainingStops.join("|"));
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function buildTripPlan(form: TripForm): TripPlan {
  const destination = optionalText(form.destination, "your destination");
  const dayCount = optionalNumber(form.days, 3, 1, 21);
  const travelers = optionalNumber(form.travelers, 1, 1, 12);
  const airport = optionalText(form.airport, "the arrival point");
  const budget = optionalText(form.budget, "flexible");
  const stayPreference = optionalText(form.stayPreference, "any suitable stay");
  const selectedInterests = form.interests.length > 0 ? form.interests : ["food", "history"];
  const dailyPaceNote = paceNotes[form.pace];
  const bases =
    form.baseStrategy === "single"
      ? [`${destination} central base`]
      : selectedInterests.slice(0, 3).map((interest, index) => {
          const area = baseAreas[index % baseAreas.length];
          return `${area} for ${interestLabels[interest]?.split(" ")[0] ?? "local"} access`;
        });

  const days = Array.from({ length: dayCount }, (_, index) => {
    const interest = selectedInterests[index % selectedInterests.length];
    const base = bases[index % bases.length];
    const focus = interestLabels[interest] ?? "local highlights";
    const area = baseAreas[index % baseAreas.length];
    const stopTemplates = interestStops[interest] ?? ["highlight", "viewpoint"];
    const primaryStops = stopTemplates.map((stop) => areaSpecificStop(stop, area));
    const hasShoppingMall = interest === "shopping";
    const routeArea = `${area} ${destination}`;
    const mallStop = "Central Shopping Mall";
    const hasMallStop = primaryStops.some((stop) => stop.toLowerCase().includes("shopping mall"));
    const morningCafe = `${area} cafe`;
    const dayStops = [
      routeArea,
      ...primaryStops,
      ...(hasShoppingMall && !hasMallStop ? [mallStop] : []),
    ];

    return {
      day: index + 1,
      base,
      weather: weatherNotes[index % weatherNotes.length],
      focus,
      items: [
        `9:00 AM Start at ${morningCafe}; include a 15 min snack/coffee break if you stop there.`,
        `10:00 AM Visit ${primaryStops.join(" and ")} for ${focus}.`,
        `12:00 PM Lunch near ${area}; reserve 1 hour for restaurant time.`,
        dailyPaceNote,
        hasShoppingMall
          ? "3:00 PM Shopping mall stop; reserve 1 hour for shopping time."
          : "3:00 PM Flexible open slot; avoid adding another coffee stop unless it is a different place.",
        `6:30 PM Dinner near ${base}; reserve 1 hour for restaurant time.`,
      ],
      estimate: budget.includes("$") ? paceEstimates[form.pace] : `${form.pace} daily spend`,
      mapUrl: mapDirectionsUrl(dayStops, destination),
    };
  });

  const strategy =
    form.baseStrategy === "single"
      ? `Use one base near transit from ${airport} to reduce packing time and make day trips simpler.`
      : `Split the stay across ${Math.min(3, bases.length)} bases so each cluster of activities has less daily travel time.`;

  return {
    title: `${dayCount}-day ${destination} research plan`,
    summary: `${travelers} traveler${travelers === 1 ? "" : "s"} · ${form.pace} pace · ${stayPreference} · budget ${budget}`,
    strategy,
    generatedAt: new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date()),
    stays: [
      {
        name: `${destination} Garden House`,
        area: "Central District",
        type: stayPreference,
        nightly: "$155 - $220",
        rating: 4.7,
        reason: "Best fit for transit, restaurants, and first-time orientation.",
        url: hotelSearchUrl(`${destination} Garden House`, destination),
      },
      {
        name: "Harbor View Rooms",
        area: "Riverside",
        type: "Apartment stay",
        nightly: "$130 - $190",
        rating: 4.6,
        reason: "Good for scenic evenings and relaxed mornings near the water.",
        url: hotelSearchUrl("Harbor View Rooms", destination),
      },
      {
        name: "Old Town Base Hotel",
        area: "Old Town",
        type: "Boutique hotel",
        nightly: "$180 - $260",
        rating: 4.8,
        reason: "Strong review signals for walkability, service, and breakfast.",
        url: hotelSearchUrl("Old Town Base Hotel", destination),
      },
    ],
    attractions: [
      {
        name: "Historic Center Walk",
        category: "Landmark area",
        rating: 4.8,
        reviewSignal: "Visitors praise the views, architecture, and easy self-guided route.",
        distance: "12 min from central base",
        mapUrl: mapSearchUrl("Historic Center Walk", destination),
      },
      {
        name: "Local Food Market",
        category: "Food",
        rating: 4.6,
        reviewSignal: "Reviews mention variety, quick lunches, and good rainy-day backup.",
        distance: "8 min by transit",
        mapUrl: mapSearchUrl("Local Food Market", destination),
      },
      {
        name: "City Viewpoint Trail",
        category: "Nature",
        rating: 4.7,
        reviewSignal: "Best rated around sunset, with notes about comfortable shoes.",
        distance: "18 min ride",
        mapUrl: mapSearchUrl("City Viewpoint Trail", destination),
      },
      {
        name: "Museum Quarter",
        category: "Culture",
        rating: 4.5,
        reviewSignal: "Reliable option for hot or rainy afternoons.",
        distance: "15 min from Old Town",
        mapUrl: mapSearchUrl("Museum Quarter", destination),
      },
    ],
    days,
  };
}
