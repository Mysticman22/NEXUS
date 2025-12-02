import os
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

# 1. Setup Local LLM (Phi-3 or Llama3)
# Make sure you ran 'ollama run phi3' in your terminal
llm = Ollama(model="phi3", request_timeout=120.0)

# 2. Setup Embedding Model (HuggingFace)
# Converts text to numbers locally (Privacy First)
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

# 3. Apply Settings Global
Settings.llm = llm
Settings.embed_model = embed_model

def load_documents_and_index():
    """
    Reads PDFs from server/data/documents and builds the search index.
    """
    data_path = "data/documents"
    
    # Check if folder exists
    if not os.path.exists(data_path):
        os.makedirs(data_path)
        print(f"📁 Created {data_path}. Drop your PDFs here.")
        return None

    # Load Docs
    documents = SimpleDirectoryReader(data_path).load_data()
    
    if not documents:
        print("⚠️ No documents found. AI will be empty.")
        return None

    # Create Index (Vector Database)
    index = VectorStoreIndex.from_documents(documents)
    print("✅ NEXUS AI: Documents Indexed Successfully")
    
    return index.as_query_engine()

# Initialize Engine on Startup
# query_engine = load_documents_and_index()