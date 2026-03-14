import re
from collections import Counter

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
    "has", "have", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "it", "its", "this", "that", "these", "those", "i", "you",
    "he", "she", "we", "they", "what", "which", "who", "whom", "as",
    "if", "when", "where", "why", "how", "all", "both", "each", "few",
    "more", "most", "other", "some", "such", "no", "not", "only", "own",
    "same", "so", "than", "too", "very", "just", "about", "also"
}

def clean_text(text: str) -> str:
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower().strip()
    return text

def analyze_text(text: str) -> dict:
    cleaned = clean_text(text)
    words = cleaned.split()
    
    filtered_words = [w for w in words if w not in STOPWORDS and len(w) > 2]
    
    word_count = len(words)
    top_words = [word for word, _ in Counter(filtered_words).most_common(10)]
    summary = ' '.join(words[:50]) + '...' if len(words) > 50 else text

    return {
        "word_count": word_count,
        "top_words": top_words,
        "summary": summary
    }