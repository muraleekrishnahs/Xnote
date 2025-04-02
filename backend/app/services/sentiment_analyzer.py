from textblob import TextBlob
import nltk
import os


class SentimentAnalyzer:
    """Service for analyzing sentiment of text content."""
    
    @staticmethod
    def analyze(text: str) -> str:
        """
        Analyze the sentiment of the given text.
        
        Args:
            text: The text to analyze
            
        Returns:
            str: 'positive', 'neutral', or 'negative'
        """
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        
        if polarity > 0.1:
            return "positive"
        elif polarity < -0.1:
            return "negative"
        else:
            return "neutral" 