# TripWise

TripWise is an initial launch web app for researching and planning trips. A traveler enters a destination, travel dates, budget, landing airport, stay style, and interests. The app generates a day-by-day plan with weather notes, base-stay strategy, stay options, attractions, activities, and review-style research signals.

This launch build uses realistic mock research so it can ship before production API keys are configured.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Future Integrations

- Places and maps: Google Maps Platform Places API.
- Weather: OpenWeather or Open-Meteo.
- Accommodations: Booking.com Demand API, Expedia Rapid, Amadeus, or another approved provider.
- AI synthesis: server-side itinerary generation with citations.

Do not scrape Airbnb or map reviews. Use approved APIs and show sources/refresh timestamps.
