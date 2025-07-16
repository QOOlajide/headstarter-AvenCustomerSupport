import os
from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone

# --- Load environment variables ---
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

# --- Initialize clients ---
openai_client = OpenAI(api_key=OPENAI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)


# --- Main function to handle user queries ---
def ask_aven_ai(query):
    # 1. Convert the question into an embedding vector
    embedding_response = openai_client.embeddings.create(
        input=[query],
        model="text-embedding-3-small"
    )
    query_embedding = embedding_response.data[0].embedding

    # 2. Search Pinecone for similar documents
    search_result = index.query(vector=query_embedding, top_k=5, include_metadata=True)

    # 3. Extract context snippets
    contexts = [match['metadata']['text'] for match in search_result.matches]
    context = "\n\n".join(contexts)

    # 4. Build prompt
    prompt = (
        f"You are Aven’s official support assistant. "
        f"You must only answer using the provided documentation snippets. "
        f"If the answer isn’t clear in the context, say: 'I'm not sure based on the current information.' "
        f"Be clear and concise.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {query}"
    )

    # 5. Generate a response using OpenAI
    chat_response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    return chat_response.choices[0].message.content.strip()

# --- CLI for local testing ---
if __name__ == "__main__":
    print("\n💬 Ask the Aven AI Support Agent (type 'exit' to quit):")
    while True:
        user_question = input("\nYou: ")
        if user_question.lower() in {"exit", "quit"}:
            break
        answer = ask_aven_ai(user_question)
        print(f"\n🧠 Aven AI: {answer}")
