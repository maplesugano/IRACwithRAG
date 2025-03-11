import os
from langchain.text_splitter import CharacterTextSplitter
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai.embeddings import OpenAIEmbeddings
import re 

def clean_text(text):
    text_builder = []
    for line in text.split("\n"):
        line = line.lstrip()
        line = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', line)
        if line.strip() == "":
            continue
        if line.replace("-", "").strip() == "":
            text_builder.append(f"\n## {text_builder.pop()}")
            continue
        if line.startswith("#"):
            text_builder.append("")
        text_builder.append(line)
        
    return "\n".join(text_builder)

def load_text_files(directory):
    text_data = {}
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                text_data[filename] = file.read()
    return text_data

def text_splitter(text_data):
    text_splitter = CharacterTextSplitter(
        separator=".",
        chunk_size=1000,
        chunk_overlap=15
    )
    print(text_splitter)

    all_docs = []
    for filename, text in text_data.items():
        docs = text_splitter.split_text(text)
        print(f"{filename} split into: {len(docs)} chunks")
        all_docs.extend(docs)
    
    return all_docs

def semantic_chunker(text_data, settings):
    cleaned_text_data = {filename: clean_text(content) for filename, content in text_data.items()}

    embed_model = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
    semantic_chunker = SemanticChunker(embed_model, breakpoint_threshold_amount=95, breakpoint_threshold_type="percentile")
    naive_chunker = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)

    chunked_text_data = []

    for filename, content in cleaned_text_data.items():
        sentence_chunks = naive_chunker.split_text(content)
        
        # Step 2: Apply semantic chunking on these pre-chunks
        semantic_chunks = semantic_chunker.create_documents(sentence_chunks)
        
        # Store processed chunks
        chunked_text_data = [chunk.page_content for chunk in semantic_chunks]
    
    return chunked_text_data