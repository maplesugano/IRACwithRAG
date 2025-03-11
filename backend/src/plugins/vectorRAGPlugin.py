from semantic_kernel.functions import kernel_function
from langchain_community.vectorstores import Pinecone as PineconeStore
from langchain_community.embeddings import OpenAIEmbeddings
from pinecone import Pinecone

class VectorRAGPlugin:
    raw_vectorRAG_result = None

    def __init__(self, settings):
        self.settings = settings

        # Initialize Pinecone
        self.pc = Pinecone(
            api_key=settings.PINECONE_API_KEY,
            environment=settings.PINECONE_ENV
        )

        if settings.PINECONE_INDEX_NAME not in self.pc.list_indexes().names():
            raise Exception(f"Index {settings.PINECONE_INDEX_NAME} not found in Pinecone")

        self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)

        self.embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)

        self.docsearch = PineconeStore(
            index=self.index,
            embedding=self.embeddings,
            text_key="text"
        )

    @kernel_function(
            name="vector_search", 
            description="Retrieves a law-related document based on a query")
    async def vector_search(self, query: str):
        """
        Performs a vector similarity search and returns the best matching results.

        Args:
            query (str): The input query.

        Returns:
            dict: The response dictionary.
        """
        try:
            # Convert query into vector representation
            embedded_query_vector = self.embeddings.embed_query(query)

            # Perform the search in Pinecone
            pinecone_result = self.index.query(
                vector=embedded_query_vector,
                top_k=1,  # Ensure consistency with GraphRAG
                include_values=True,
                include_metadata=True
            )

            # Extract retrieved vectors
            retrieved_vectors = [
                {
                    "id": match.id,
                    "score": match.score,
                    "values": match.values,        # The actual vector
                    "metadata": match.metadata     # Any associated metadata
                }
                for match in pinecone_result.matches
            ]

            # Store raw RAG result for analysis
            self.raw_vectorRAG_result = {
                "retrieved_vectors": retrieved_vectors,
                "embedded_query_vector": embedded_query_vector,
            }

            return {
                "retrieved_vectors": retrieved_vectors,
            }

        except Exception as e:
            raise Exception(f"Error performing vector search: {str(e)}")
