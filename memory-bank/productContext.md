# Product Context: Zinkoachless

## Problem Statement
In competitive League of Legends analysis, single-patch data often suffers from insufficient sample sizes for non-standard items, keystones, or summoner spells. Commercial platforms such as Coachless restrict multi-patch filtering and aggregation behind premium subscription paywalls. Furthermore, when items are played infrequently in a single patch, standard analytics platforms gray out or discard the data as statistical noise.

---

## Solution
Zinkoachless interceptively extracts data from Coachless REST endpoints across patch ranges (e.g. 16.1 to 16.16+), caches raw JSON files locally, and computes a sample-weighted average Win Probability Added ($\text{WPA}_{\text{weighted}}$):

$$\text{WPA}_{\text{weighted}} = \frac{\sum (\text{WPA}_i \times \text{Sample}_i)}{\sum \text{Sample}_i}$$

By consolidating purchase and pick counts across 10+ patches, low-frequency build paths gain statistical significance.

---

## User Experience Goals
- **Instant Client-Side Filtering:** Sliders or dropdowns for selecting *From Patch* and *To Patch* range recalculate weighted WPAs in real-time in the browser without backend roundtrips.
- **Visual Richness:** Clean modern dark UI featuring high-resolution item and rune icons sourced dynamically from Riot Games Data Dragon CDN.
- **Sorting & Interactive Exploration:** Sort by WPA impact or sample count (buys/picks) across 8 distinct categories (Keystones, Spells, Starters, Boots, 1st Item, 2nd Item, 3rd Item, 4th+ Items).
- **Offline Autonomy:** Web application functions completely offline using pre-compiled `docs/data.js` bundles.
