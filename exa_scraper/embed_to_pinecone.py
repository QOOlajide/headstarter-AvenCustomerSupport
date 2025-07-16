import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec

# Load environment variables from .env
load_dotenv()

# Load keys and settings
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")  # e.g., 'us-east-1'
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

# Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# 🆕 Initialize Pinecone client with new class API
pc = Pinecone(api_key=PINECONE_API_KEY)

# 🧠 Check if index exists, create if it doesn’t
if PINECONE_INDEX_NAME not in pc.list_indexes().names():
    print(f"Index '{PINECONE_INDEX_NAME}' does not exist. Creating it now...")
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=1536,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=PINECONE_ENV)
    )
else:
    print(f"Index '{PINECONE_INDEX_NAME}' already exists.")

# 📦 Connect to the index
index = pc.Index(PINECONE_INDEX_NAME)

# Step 1: Load article content
with open("aven_articles.json", "r") as f:
    articles = json.load(f)

# Step 2: Chunk each article into 200-word chunks
def chunk_text(text, max_words=200):
    words = text.split()
    return [
        " ".join(words[i:i+max_words])
        for i in range(0, len(words), max_words)
    ]

# Step 3: Convert articles into individual chunks
chunks = []
for article in articles:
    content = article.get("content", "")
    content_chunks = chunk_text(content)

    for i, chunk in enumerate(content_chunks):
        chunks.append({
            "id": f"{article['url']}--{i}",
            "text": chunk,
            "metadata": {
                "source": article["url"],
                "text": chunk  # ✅ Correct: this is the actual chunk text
            }
        })


print(f"✅ Prepared {len(chunks)} chunks for embedding.")

# Step 4: Embed and upload to Pinecone
batch_size = 5  # OpenAI recommends batching for efficiency

for i in range(0, len(chunks), batch_size):
    batch = chunks[i:i + batch_size]
    texts = [item["text"] for item in batch]

    # Generate embeddings from OpenAI
    response = openai_client.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )
    embeddings = [record.embedding for record in response.data]

    # Prepare vectors with ID, embedding, and metadata
    vectors = []
    for chunk, embedding in zip(batch, embeddings):
        vectors.append({
            "id": chunk["id"],
            "values": embedding,
            "metadata": chunk["metadata"]
        })
    print("Sample metadata:", vectors[0]["metadata"])
    # Upload to Pinecone
    index.upsert(vectors=vectors)
    print(f"✅ Uploaded batch {i // batch_size + 1} with {len(vectors)} vectors.")
