# Product Context: Zinkoachless

## Problem Statement
In competitive League of Legends analysis, single-patch data often suffers from insufficient sample sizes for non-standard items, keystones, or summoner spells. Commercial platforms such as Coachless restrict multi-patch filtering and aggregation behind premium subscription paywalls. Furthermore, when items are played infrequently in a single patch, standard analytics platforms gray out or discard the data as statistical noise.

---

## Solution
Zinkoachless interceptively extracts data from Coachless REST endpoints across patch ranges (16.1 to 16.16+), tracks DDragon item/rune change history, caches raw JSON files locally, and computes a **Recency-Weighted Win Probability Added ($\text{WPA}_{\text{recency}}$)** using time-decay exponential weighting ($\lambda = 0.75$):

$$\text{WPA}_{\text{recency}} = \frac{\sum_{i=1}^N \text{WPA}(P_i) \times \text{Sample}(P_i) \times 0.75^{(N - i)}}{\sum_{i=1}^N \text{Sample}(P_i) \times 0.75^{(N - i)}}$$

By consolidating purchase and pick counts across 10+ patches with exponential recency decay, low-frequency build paths gain statistical significance without being distorted by outdated meta patches.

---

## User Experience Goals
- **Instant Client-Side Filtering:** Dropdowns for selecting *From Patch* and *To Patch* range recalculate recency-weighted WPAs in real-time in the browser.
- **Smart Composite Ranking (`smart_rank`):** Default recommendation metric combining recency WPA and sample confidence to rank optimal builds.
- **Statistical Role Badging:** Instant visual guidance distinguishing `⭐ Meta` (Standard high-confidence), `🎯 Situacional / Hidden OP` (High-efficiency niche pick or secret OP choice), `📈 Emergente` (Rising momentum), and `⚡ Ajustado` (Latest patch change).
- **Dynamic Market Share Filter:** Toggle between `⭐ Populares & Solidez` ($0.5\%$ category sample cutoff) and `📚 Catálogo Completo` (100% un-filtered catalog).
- **LoL Item Set Exporter:** One-click clipboard copy generating ready-to-use in-game item sets for the League of Legends client.
- **Offline Autonomy:** Web application functions completely offline using pre-compiled `docs/data.js` bundles.
