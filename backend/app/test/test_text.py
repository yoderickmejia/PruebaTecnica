from app.services.text import clean_text, analyze_text


def test_clean_text_removes_html():
    result = clean_text("<b>Hello</b> <i>World</i>")
    assert "<b>" not in result
    assert "<i>" not in result
    assert "hello" in result
    assert "world" in result


def test_clean_text_lowercase():
    result = clean_text("Hello World")
    assert result == "hello world"


def test_clean_text_removes_special_chars():
    result = clean_text("Hello, World! 123")
    assert "," not in result
    assert "!" not in result


def test_analyze_text_word_count():
    result = analyze_text("one two three four five")
    assert result["word_count"] == 5


def test_analyze_text_top_words_order():
    result = analyze_text("python python python java java ruby")
    assert result["top_words"][0] == "python"
    assert result["top_words"][1] == "java"


def test_analyze_text_filters_stopwords():
    result = analyze_text("the the the python")
    assert "the" not in result["top_words"]
    assert "python" in result["top_words"]


def test_analyze_text_summary_short_text():
    text = "Short text here"
    result = analyze_text(text)
    assert result["summary"] == text


def test_analyze_text_summary_long_text():
    text = " ".join(["word"] * 100)
    result = analyze_text(text)
    assert result["summary"].endswith("...")


def test_analyze_text_empty():
    result = analyze_text("")
    assert result["word_count"] == 0
    assert result["top_words"] == []
