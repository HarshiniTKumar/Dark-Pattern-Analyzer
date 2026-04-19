# Dark Pattern Radar 🔍

A real-time dark pattern detection system that automatically identifies 
and highlights deceptive design patterns on e-commerce websites using 
NLP and a Chrome browser extension.

## What are Dark Patterns?

Dark patterns are deceptive text tactics used by e-commerce websites to 
manipulate users into making unintended purchases or giving up personal 
data. Examples include:
- **"Only 2 left in stock!"** — fake scarcity
- **"Hurry! Sale ends soon"** — false urgency  
- **"1,142 people viewing this"** — inflated social proof
- **"No thanks, I prefer paying full price"** — confirmshaming

## What This Project Does

This system automatically scans any shopping website you visit and 
highlights manipulative text in color-coded labels so users can make 
informed decisions while shopping online.

| Color | Pattern Type | Example |
|---|---|---|
| 🔴 Red | Urgency | "Flash sale! Limited time only" |
| 🟠 Orange | Scarcity | "Only 2 left in stock!" |
| 🔵 Blue | Social Proof | "1,142 people added to cart" |
| 🟣 Purple | Misdirection | "No thanks, I hate saving money" |

## Tech Stack

| Component | Technology |
|---|---|
| NLP Model | DistilBERT (fine-tuned) |
| Training | PyTorch + HuggingFace Transformers |
| Backend | Flask + Flask-CORS |
| Frontend | Chrome Extension (Manifest V3) |
| Dataset | Mathur et al. 2019 (yamanalab/ec-darkpattern) |

## Project Structure

## Project Structure

**`api/`**
- `app.py` — Flask REST API server that serves the DistilBERT model

**`extensions/`**
- `content.js` — Scans page text and highlights detected dark patterns
- `manifest.json` — Chrome extension configuration and permissions
- `popup.html` — Extension popup showing color legend

**`model/saved/`**
- `config.json` — Model configuration file
- `tokenizer.json` — Tokenizer data
- `tokenizer_config.json` — Tokenizer configuration
- `vocab.txt` — DistilBERT vocabulary file
- `model.safetensors` — Trained model weights ⚠️ download separately from Google Drive
  
## Setup Instructions

### Step 1 — Download the Trained Model
Download `model.safetensors` from Google Drive: https://drive.google.com/drive/folders/1Ei1wyCXZRYt-LrwzAMvuLgfSFOnZcjKO?usp=sharing
Place it at:
model/saved/model.safetensors
### Step 2 — Install Dependencies
```bash
pip install flask flask-cors transformers==4.44.0 torch==2.4.0
```

### Step 3 — Start the Flask API
```bash
cd api
python app.py
```
### Step 4 — Load the Chrome Extension
1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extensions/` folder

### Step 5 — Browse and Detect!
Visit any shopping website like Flipkart, Myntra, or MakeMyTrip.
Wait 3 seconds — dark patterns will be highlighted automatically!
