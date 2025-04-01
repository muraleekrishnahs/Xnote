import pytest
from ..services.sentiment_analyzer import SentimentAnalyzer

def test_positive_sentiment():
    text = "I love this application! It's amazing and works really well."
    result = SentimentAnalyzer.analyze(text)
    assert result == "positive"

def test_negative_sentiment():
    text = "This is terrible and frustrating. I hate using this."
    result = SentimentAnalyzer.analyze(text)
    assert result == "negative"

def test_neutral_sentiment():
    text = "This is a note. It contains information."
    result = SentimentAnalyzer.analyze(text)
    assert result == "neutral" 