import re
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class HiveMindSearchEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            sublinear_tf=True
        )
        self.corpus_ids: List[int] = []
        self.corpus_texts: List[str] = []
        self.corpus_metadata: List[Dict[str, Any]] = []
        self.tfidf_matrix = None

    def index_resources(self, resources: List[Any]):
        """Index a list of SQLAlchemy Resource objects into the vector space."""
        if not resources:
            return

        self.corpus_ids = []
        self.corpus_texts = []
        self.corpus_metadata = []

        for r in resources:
            # Combine title, practice area, tags, jurisdiction, summary, and content for rich semantic indexing
            doc_text = f"{r.title} | {r.practice_area} | {r.jurisdiction} | {r.tags} | {r.summary} | {r.content}"
            self.corpus_ids.append(r.id)
            self.corpus_texts.append(doc_text)
            self.corpus_metadata.append({
                "id": r.id,
                "title": r.title,
                "practice_area": r.practice_area,
                "jurisdiction": r.jurisdiction,
                "summary": r.summary,
                "content": r.content,
                "tags": r.tags
            })

        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus_texts)

    def search(self, query: str, practice_area: str = None, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search the indexed legal resources and return ranked results with confidence scores & snippets."""
        if self.tfidf_matrix is None or len(self.corpus_ids) == 0:
            return []

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        results = []
        for idx, score in enumerate(similarities):
            meta = self.corpus_metadata[idx]

            # Optional filter by practice area
            if practice_area and practice_area.lower() not in meta["practice_area"].lower() and practice_area.lower() not in meta["tags"].lower():
                score *= 0.5  # Soft penalty if practice area doesn't match filter

            # Keyword presence bonus
            query_words = set(re.findall(r"\w+", query.lower()))
            content_words = set(re.findall(r"\w+", meta["content"].lower()))
            overlap = len(query_words.intersection(content_words))
            boosted_score = float(score) + (overlap * 0.04)

            # Generate an extraction snippet
            snippet = self._generate_snippet(meta["content"], query_words)

            results.append({
                "id": meta["id"],
                "score": round(min(boosted_score, 0.99), 3),
                "snippet": snippet,
                "relevance_reason": self._generate_relevance_reason(meta, query)
            })

        # Rank descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def _generate_snippet(self, text: str, query_words: set) -> str:
        """Find the sentence or paragraph with highest query term density."""
        sentences = re.split(r'(?<=[.!?]) +', text)
        if not sentences:
            return text[:200] + "..."

        best_sentence = sentences[0]
        max_overlap = -1

        for sentence in sentences:
            sentence_words = set(re.findall(r"\w+", sentence.lower()))
            overlap = len(query_words.intersection(sentence_words))
            if overlap > max_overlap:
                max_overlap = overlap
                best_sentence = sentence

        clean_snippet = best_sentence.strip()
        if len(clean_snippet) > 240:
            clean_snippet = clean_snippet[:240] + "..."
        return clean_snippet

    def _generate_relevance_reason(self, meta: Dict[str, Any], query: str) -> str:
        return f"Matches '{meta['practice_area']}' precedent under {meta['jurisdiction']} law with key clause guidance."

    def synthesize_answer(self, query: str, matched_resources: List[Any]) -> str:
        """Synthesizes an AI overview based on top retrieved legal precedents in the Hive Mind."""
        if not matched_resources:
            return f"No specific legal precedents found in the Hive Mind matching '{query}'. Consider requesting a memorandum from the network."

        top_item = matched_resources[0]
        practice_areas = list({r.practice_area for r in matched_resources[:3]})
        titles = [f"'{r.title}'" for r in matched_resources[:2]]

        return (
            f"**Hive Mind Synthesis**: Based on community-contributed precedents in {', '.join(practice_areas)}, "
            f"independent counsel recommend reviewing provisions in {', '.join(titles)}. "
            f"Key statutory standard: ensure strict compliance with {top_item.jurisdiction} procedural requirements and local court rules."
        )

# Global singleton
search_engine = HiveMindSearchEngine()
