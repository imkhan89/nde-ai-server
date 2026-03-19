import pandas as pd
import re

# ==============================
# CONFIG
# ==============================

MAKES = ["honda","toyota","suzuki","daihatsu","nissan","mitsubishi","kia","hyundai"]

MODELS = {
    "honda": ["civic","city","brv","hrv"],
    "toyota": ["corolla","yaris","vitz","revo"],
    "suzuki": ["alto","cultus","wagon r"],
    "daihatsu": ["mira","move","hijet"],
    "nissan": [],
    "mitsubishi": [],
    "kia": [],
    "hyundai": []
}

STOPWORDS = [
    "genuine","original","high quality","premium",
    "best","set","kit","assy","assembly"
]

PART_MAP = {
    "air filter": ["air filter","engine air filter"],
    "oil filter": ["oil filter"],
    "brake pad": ["brake pad","brake pads","brake pad set"],
    "radiator": ["radiator"],
    "shock absorber": ["shock absorber","shock","absorber"]
}

# ==============================
# PARSER FUNCTIONS
# ==============================

def extract_years(title):
    title = str(title)

    range_match = re.search(r'(20\d{2})\s*-\s*(20\d{2})', title)
    if range_match:
        return int(range_match.group(1)), int(range_match.group(2))

    single_match = re.search(r'(20\d{2})', title)
    if single_match:
        y = int(single_match.group(1))
        return y, y

    return 0, 9999


def extract_make(title):
    words = title.lower().split()
    for m in MAKES:
        if m in words:
            return m
    return "unknown"


def extract_model(title, make):
    t = title.lower()
    if make in MODELS:
        for model in MODELS[make]:
            if model in t:
                return model
    return "unknown"


def extract_part(title, make):
    t = title.lower()
    if make in t:
        return t.split(make)[0].strip()
    return t


def clean_part(part):
    p = part.lower()
    for word in STOPWORDS:
        p = p.replace(word, "")
    return p.strip()


def normalize_part(part):
    for standard, variants in PART_MAP.items():
        for v in variants:
            if v in part:
                return standard
    return part


def build_url(handle):
    return f"https://www.ndestore.com/products/{handle}"


# ==============================
# BUILD DATABASE
# ==============================

def build_database(input_csv, output_csv):
    df = pd.read_csv(input_csv)

    parsed = []

    for _, row in df.iterrows():
        title = row.get("Title", "")
        handle = row.get("Handle", "")

        year_start, year_end = extract_years(title)
        make = extract_make(title)
        model = extract_model(title, make)

        part = extract_part(title, make)
        part = clean_part(part)
        part = normalize_part(part)

        url = build_url(handle)

        parsed.append({
            "part": part,
            "make": make,
            "model": model,
            "year_start": year_start,
            "year_end": year_end,
            "url": url,
            "title": title
        })

    final_df = pd.DataFrame(parsed)

    # Remove bad rows
    final_df = final_df[
        (final_df["make"] != "unknown") &
        (final_df["model"] != "unknown")
    ]

    final_df.to_csv(output_csv, index=False)

    print("✅ Database built:", output_csv)


# ==============================
# MATCHING ENGINE
# ==============================

def search_part(db_csv, part, make, model, year):
    df = pd.read_csv(db_csv)

    part = normalize_part(clean_part(part.lower()))

    results = df[
        (df["make"] == make.lower()) &
        (df["model"] == model.lower()) &
        (df["part"] == part)
    ]

    results = results[
        (results["year_start"] <= year) &
        (results["year_end"] >= year)
    ]

    # Ranking
    results["range_size"] = results["year_end"] - results["year_start"]
    results = results.sort_values(by="range_size")

    return results.head(3)


# ==============================
# TEST
# ==============================

if __name__ == "__main__":

    # Build database (run once)
    # build_database("products_cleaned.csv", "fitment_database.csv")

    # Test query
    results = search_part(
        "fitment_database.csv",
        part="Air Filter",
        make="honda",
        model="civic",
        year=2018
    )

    print(results[["title", "url"]])
