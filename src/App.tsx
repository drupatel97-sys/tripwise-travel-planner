import { useState } from "react";
import {
  BedDouble,
  CalendarDays,
  Check,
  CloudSun,
  Compass,
  Hotel,
  Map,
  MapPin,
  Plane,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";
import {
  buildTripPlan,
  defaultForm,
  interestOptions,
  type BaseStrategy,
  type Pace,
  type TripForm,
} from "./lib/trip";

const paceOptions: Pace[] = ["relaxed", "balanced", "packed"];
const baseOptions: Array<{ value: BaseStrategy; label: string; help: string }> = [
  {
    value: "single",
    label: "One base",
    help: "Sleep in one area and make day trips from there.",
  },
  {
    value: "multi",
    label: "Multiple bases",
    help: "Move stays to reduce travel time across a wider route.",
  },
];

function App() {
  const [form, setForm] = useState<TripForm>(defaultForm);
  const [savedCount, setSavedCount] = useState(() => {
    const stored = window.localStorage.getItem("tripwise.savedCount");
    return stored ? Number(stored) : 0;
  });
  const [plan, setPlan] = useState(() => buildTripPlan(defaultForm));

  function updateForm<K extends keyof TripForm>(key: K, value: TripForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleInterest(interest: string) {
    setForm((current) => {
      const interests = current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest];
      return { ...current, interests };
    });
  }

  function saveTrip() {
    const next = savedCount + 1;
    setSavedCount(next);
    window.localStorage.setItem("tripwise.savedCount", String(next));
  }

  function generatePlan() {
    setPlan(buildTripPlan(form));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#planner" aria-label="TripWise planner">
          <span className="brand-mark">
            <Compass size={22} strokeWidth={2.4} />
          </span>
          <span>TripWise</span>
        </a>
        <nav className="topnav" aria-label="Primary navigation">
          <a href="#planner">Planner</a>
          <a href="#research">Research</a>
          <a href="#itinerary">Itinerary</a>
        </nav>
        <button className="ghost-button" type="button" onClick={saveTrip}>
          <Check size={17} />
          Saved {savedCount}
        </button>
      </header>

      <section className="workspace" id="planner">
        <aside className="planner-panel" aria-label="Trip planning questions">
          <div className="panel-heading">
            <div>
              <h1>Plan a researched trip</h1>
              <p>
                Enter a destination and travel details. TripWise drafts a practical route,
                stay strategy, and review-aware itinerary.
              </p>
            </div>
            <Sparkles className="heading-icon" size={26} />
          </div>

          <label className="field wide">
            <span>
              <Search size={16} />
              Destination optional
            </span>
            <input
              value={form.destination}
              onChange={(event) => updateForm("destination", event.target.value)}
              placeholder="City, town, region, or country"
            />
          </label>

          <div className="field-grid">
            <label className="field">
              <span>
                <CalendarDays size={16} />
                Start date optional
              </span>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => updateForm("startDate", event.target.value)}
              />
            </label>
            <label className="field">
              <span>
                <SlidersHorizontal size={16} />
                Days optional
              </span>
              <input
                type="number"
                min={1}
                max={21}
                value={form.days}
                onChange={(event) => updateForm("days", event.target.value)}
              />
            </label>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>
                <Plane size={16} />
                Landing airport optional
              </span>
              <input
                value={form.airport}
                onChange={(event) => updateForm("airport", event.target.value)}
                placeholder="JFK, LIS, NRT"
              />
            </label>
            <label className="field">
              <span>
                <Wallet size={16} />
                Budget range optional
              </span>
              <input
                value={form.budget}
                onChange={(event) => updateForm("budget", event.target.value)}
                placeholder="$1,500 - $2,500"
              />
            </label>
          </div>

          <label className="field wide">
            <span>
              <BedDouble size={16} />
              Stay preference optional
            </span>
            <input
              value={form.stayPreference}
              onChange={(event) => updateForm("stayPreference", event.target.value)}
              placeholder="Hotel, apartment, homestay, hostel..."
            />
          </label>

          <div className="segmented-control" aria-label="Base stay strategy">
            {baseOptions.map((option) => (
              <button
                className={form.baseStrategy === option.value ? "selected" : ""}
                key={option.value}
                type="button"
                onClick={() => updateForm("baseStrategy", option.value)}
              >
                <span>{option.label}</span>
                <small>{option.help}</small>
              </button>
            ))}
          </div>

          <div className="preference-row">
            <label className="field compact">
              <span>Travelers optional</span>
              <input
                type="number"
                min={1}
                max={12}
                value={form.travelers}
                onChange={(event) => updateForm("travelers", event.target.value)}
              />
            </label>
            <div className="pace-picker" aria-label="Trip pace">
              {paceOptions.map((pace) => (
                <button
                  className={form.pace === pace ? "selected" : ""}
                  key={pace}
                  type="button"
                  onClick={() => updateForm("pace", pace)}
                >
                  {pace}
                </button>
              ))}
            </div>
          </div>

          <div className="interest-list" aria-label="Activity interests">
            {interestOptions.map((interest) => (
              <button
                className={form.interests.includes(interest) ? "selected" : ""}
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>

          <button className="primary-button" type="button" onClick={generatePlan}>
            <RefreshCw size={18} />
            Generate research plan
          </button>
        </aside>

        <section className="results-panel" aria-label="Generated travel research">
          <div className="hero-visual">
            <div className="map-card" aria-hidden="true">
              <span className="route route-a" />
              <span className="route route-b" />
              <span className="pin pin-a" />
              <span className="pin pin-b" />
              <span className="pin pin-c" />
              <div className="map-label">
                <Map size={16} />
                {form.destination || "Destination"}
              </div>
            </div>
            <div className="photo-strip" aria-hidden="true">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=420&q=80"
              />
              <img
                alt=""
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=420&q=80"
              />
              <img
                alt=""
                src="https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=420&q=80"
              />
            </div>
          </div>

          <div className="result-header">
            <div>
              <p className="timestamp">Draft updated {plan.generatedAt}</p>
              <h2>{plan.title}</h2>
              <p>{plan.summary}</p>
            </div>
            <div className="weather-pill">
              <CloudSun size={19} />
              Weather-aware
            </div>
          </div>

          <section className="strategy-band" id="research">
            <MapPin size={20} />
            <p>{plan.strategy}</p>
          </section>

          <div className="research-grid">
            <section className="research-block">
              <div className="block-title">
                <Hotel size={19} />
                <h3>Stay shortlist</h3>
              </div>
              <div className="stay-list">
                {plan.stays.map((stay) => (
                  <article className="stay-row" key={stay.name}>
                    <div>
                      <h4>{stay.name}</h4>
                      <p>{stay.area} · {stay.type}</p>
                      <small>{stay.reason}</small>
                    </div>
                    <strong>{stay.nightly}</strong>
                    <span>
                      <Star size={14} fill="currentColor" />
                      {stay.rating}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className="research-block">
              <div className="block-title">
                <Star size={19} />
                <h3>Nearby highlights</h3>
              </div>
              <div className="attraction-list">
                {plan.attractions.map((attraction) => (
                  <article className="attraction-row" key={attraction.name}>
                    <div>
                      <h4>{attraction.name}</h4>
                      <p>{attraction.reviewSignal}</p>
                    </div>
                    <span>{attraction.category}</span>
                    <small>{attraction.distance} · {attraction.rating}</small>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="itinerary" id="itinerary">
            <div className="block-title">
              <CalendarDays size={19} />
              <h3>Day-by-day draft</h3>
            </div>
            <div className="day-list">
              {plan.days.map((day) => (
                <article className="day-card" key={day.day}>
                  <div className="day-number">Day {day.day}</div>
                  <div className="day-content">
                    <h4>{day.focus}</h4>
                    <p>{day.weather}</p>
                    <ul>
                      {day.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="day-meta">
                    <span>{day.base}</span>
                    <strong>{day.estimate}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

export default App;
