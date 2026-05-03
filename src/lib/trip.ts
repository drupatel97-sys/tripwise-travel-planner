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
};

export type Attraction = {
  name: string;
  category: string;
  rating: number;
  reviewSignal: string;
  distance: string;
};

export type DayPlan = {
  day: number;
  base: string;
  weather: string;
  focus: string;
  items: string[];
  estimate: string;
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

const baseAreas = ["Central District", "Old Town", "Riverside", "Museum Quarter"];
const weatherNotes = [
  "Mild morning, warmer afternoon, light jacket after sunset",
  "Clear early, scattered clouds later, comfortable walking weather",
  "Warm midday, plan indoor breaks around lunch",
  "Cooler day with a chance of showers, keep flexible museum options",
  "Bright and dry, ideal for viewpoints and open-air neighborhoods",
  "Humid afternoon, start early and reserve evening dining",
  "Breezy and pleasant, good day for longer walks",
];

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

export function buildTripPlan(form: TripForm): TripPlan {
  const destination = optionalText(form.destination, "your destination");
  const dayCount = optionalNumber(form.days, 3, 1, 21);
  const travelers = optionalNumber(form.travelers, 1, 1, 12);
  const airport = optionalText(form.airport, "the arrival point");
  const budget = optionalText(form.budget, "flexible");
  const stayPreference = optionalText(form.stayPreference, "any suitable stay");
  const selectedInterests = form.interests.length > 0 ? form.interests : ["food", "history"];
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

    return {
      day: index + 1,
      base,
      weather: weatherNotes[index % weatherNotes.length],
      focus,
      items: [
        `Start near ${baseAreas[index % baseAreas.length]} with a highly rated cafe`,
        `Visit 2-3 ${focus}`,
        `Hold a flexible slot for a guided experience or neighborhood walk`,
        `Dinner near transit back to ${base}`,
      ],
      estimate: budget.includes("$") ? "$95 - $180 per person" : "moderate daily spend",
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
      },
      {
        name: "Harbor View Rooms",
        area: "Riverside",
        type: "Apartment stay",
        nightly: "$130 - $190",
        rating: 4.6,
        reason: "Good for scenic evenings and relaxed mornings near the water.",
      },
      {
        name: "Old Town Base Hotel",
        area: "Old Town",
        type: "Boutique hotel",
        nightly: "$180 - $260",
        rating: 4.8,
        reason: "Strong review signals for walkability, service, and breakfast.",
      },
    ],
    attractions: [
      {
        name: "Historic Center Walk",
        category: "Landmark area",
        rating: 4.8,
        reviewSignal: "Visitors praise the views, architecture, and easy self-guided route.",
        distance: "12 min from central base",
      },
      {
        name: "Local Food Market",
        category: "Food",
        rating: 4.6,
        reviewSignal: "Reviews mention variety, quick lunches, and good rainy-day backup.",
        distance: "8 min by transit",
      },
      {
        name: "City Viewpoint Trail",
        category: "Nature",
        rating: 4.7,
        reviewSignal: "Best rated around sunset, with notes about comfortable shoes.",
        distance: "18 min ride",
      },
      {
        name: "Museum Quarter",
        category: "Culture",
        rating: 4.5,
        reviewSignal: "Reliable option for hot or rainy afternoons.",
        distance: "15 min from Old Town",
      },
    ],
    days,
  };
}
