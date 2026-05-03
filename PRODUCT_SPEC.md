# Travel Planner App Product Spec

## Concept

A mobile app for iPhone and Android that helps a traveler enter a destination, answer trip-planning questions, and receive a researched itinerary with weather, stay options, nearby attractions, activities, ratings, reviews, budget fit, and day-by-day routing.

## Core User Flow

1. User enters a city, town, region, or country.
2. App asks trip details:
   - Travel dates.
   - Number of days.
   - Landing airport or starting point.
   - Ending airport or ending point.
   - Budget range.
   - Traveler count.
   - Travel style: relaxed, balanced, packed.
   - Stay style: one base location or multiple base stays.
   - Accommodation preferences: hotel, apartment, homestay, hostel, luxury, family-friendly.
   - Activity preferences: food, nature, nightlife, history, museums, beaches, shopping, adventure.
3. Backend researches:
   - Weather forecast or climate expectation.
   - Candidate base locations.
   - Hotels and apartments/homestays from approved travel APIs.
   - Tourist attractions and activities from map/place APIs.
   - Place ratings, limited reviews, opening hours, photos, and distance.
   - Transport time between airport, stays, and activities.
4. App presents:
   - Best base-stay strategy.
   - Recommended stays.
   - Day-by-day itinerary.
   - Map view.
   - Budget estimate.
   - Weather notes.
   - Sources/citations for researched items.
5. User can regenerate, change budget, save a trip, or export/share.

## API Reality Check

- Google Places can find nearby places and attractions. It requires field masks and billing-sensitive field selection.
- Booking.com Demand API supports accommodations, availability, details, and reviews, but requires affiliate authentication.
- Airbnb API access is partner/program based and not a normal public API. Do not scrape Airbnb. For MVP, use official accommodation APIs and optionally provide Airbnb search deep links.
- OpenWeather supports current weather, forecasts, and historical products. Forecast range depends on plan/API.
- For trips far in the future, use climate normals or historical averages rather than pretending exact weather is known.

## MVP Scope

The first version should avoid bookings/payments and focus on planning quality.

- Cross-platform mobile app using Expo React Native.
- Backend API using Node.js/TypeScript.
- Destination search with autocomplete.
- Trip questionnaire.
- Weather lookup.
- Places/attractions lookup.
- Hotel/accommodation lookup through one approved provider.
- Itinerary generator.
- Saved trips.
- Basic map display.

## Suggested Architecture

- Mobile app: Expo React Native + TypeScript.
- Backend: Node.js + TypeScript API.
- Database: PostgreSQL via Supabase.
- Auth: Supabase Auth or Clerk.
- Maps/places: Google Maps Platform Places API.
- Weather: OpenWeather or Open-Meteo.
- Stays: Booking.com Demand API, Expedia Rapid API, Amadeus, or another approved partner API.
- AI itinerary synthesis: server-side only, with strict source citations and no invented places.
- Jobs/cache: background worker for research tasks and cached place results to control API cost.

## Data Model

- `users`: app users.
- `trips`: destination, dates, traveler count, budget, airport/start/end points.
- `trip_preferences`: stay style, activity interests, pace, accommodation style.
- `places`: attractions, restaurants, activities, coordinates, ratings, review snippets, source ids.
- `accommodations`: hotels/apartments/homestays from approved APIs.
- `itinerary_days`: day number, base stay, weather summary, estimated spend.
- `itinerary_items`: place/activity, time window, transit estimate, notes.
- `research_sources`: API/source metadata and timestamps.

## Quality Rules

- Never fabricate ratings, prices, availability, opening hours, or reviews.
- Show source and refresh time for researched results.
- Cache external API data and respect provider terms.
- Let users manually edit the generated plan.
- Keep API keys on the backend, never in the mobile app.
- Start without payment processing; add booking links/affiliate flow later.

## Build Phases

1. Product prototype: questionnaire, mock itinerary, saved trips.
2. Live destination/weather/places integration.
3. Accommodation provider integration.
4. Route-aware day planner and budget estimator.
5. AI research synthesis with citations.
6. Sharing/export, offline saved trips, monetization.
