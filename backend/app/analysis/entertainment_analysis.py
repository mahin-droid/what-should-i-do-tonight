import random

def get_genre_trends():
    months = ["Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"]
    genres = {
        "Action": [72, 75, 78, 80, 82, 85],
        "Comedy": [65, 70, 78, 75, 68, 72],
        "Romance": [55, 58, 62, 70, 65, 60],
        "Thriller": [68, 72, 70, 73, 76, 78],
        "Sci-Fi": [50, 55, 58, 62, 68, 72],
        "Drama": [75, 73, 76, 72, 74, 77],
    }
    for genre in genres:
        genres[genre] = [v + random.randint(-3, 3) for v in genres[genre]]
    data = []
    for i, month in enumerate(months):
        entry = {"month": month}
        for genre, values in genres.items():
            entry[genre] = values[i]
        data.append(entry)
    return data

def get_platform_comparison():
    platforms = {
        "Netflix": {"avg_rating": 7.2, "total_titles": 850, "originals": 120, "user_score": 4.1},
        "Prime Video": {"avg_rating": 6.8, "total_titles": 1200, "originals": 80, "user_score": 3.9},
        "Hotstar": {"avg_rating": 7.0, "total_titles": 600, "originals": 60, "user_score": 4.0},
        "Jio Cinema": {"avg_rating": 6.5, "total_titles": 400, "originals": 30, "user_score": 3.7},
        "Zee5": {"avg_rating": 6.3, "total_titles": 500, "originals": 45, "user_score": 3.6},
    }
    return platforms

def get_rating_distribution():
    distribution = []
    for rating in range(1, 11):
        if rating in (7, 8):
            count = random.randint(80, 120)
        elif rating in (6, 9):
            count = random.randint(40, 70)
        else:
            count = random.randint(10, 35)
        distribution.append({"rating": rating, "count": count})
    return distribution
