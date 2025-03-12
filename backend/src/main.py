import os
import uvicorn

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from semantic_kernel import Kernel
from semantic_kernel.contents.chat_history import ChatHistory
from plugins.vectorRAGPlugin import VectorRAGPlugin
from utils.settings import setup, load_settings

from langchain_community.embeddings import OpenAIEmbeddings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://irac-frontend-937fc1dc93c7.herokuapp.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings = load_settings()
chat_completion, execution_settings = setup(settings)
kernel = Kernel()

# Prepare OpenAI service using credentials stored in the `.env` file
kernel.add_service(chat_completion)

# Register the Math and String plugins
vector_rag_plugin = VectorRAGPlugin(settings) 

# Create a history of the conversation
history = ChatHistory()

with open("src/system_prompt.txt", "r") as f:
    system_prompt = f.read().strip()
history.add_system_message(system_prompt)

system_prompt_text = system_prompt

embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
kernel.add_plugin(
        vector_rag_plugin, 
        plugin_name="VectorRAG"
    )

@app.get("/ask")
async def ask(query: str = Query(..., description="Ask anything")):
    global history

    try:
        print(history.messages)
        history.add_message({"role": "user", "content": query})

        # Get the response from the AI
        response = await chat_completion.get_chat_message_content(
            chat_history=history,
            settings=execution_settings,
            kernel=kernel,
        )

        # Add the message from the agent to the chat history
        history.add_message(response)

        response_dict = {
            "llm_reply": response.content,
            "raw_json": vector_rag_plugin.raw_vectorRAG_result
        }

        vector_rag_plugin.raw_vectorRAG_result = None
        return JSONResponse(content=response_dict)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/refresh_history")
async def refresh_history():
    global history
    try:
        history = ChatHistory()
        vector_rag_plugin.raw_vectorRAG_result = None
        if system_prompt_text:
            history.add_system_message(system_prompt_text)
        return JSONResponse(content={"status": "Chat history has been refreshed"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status")
async def status():
    return JSONResponse(content={"status": "Server is up and running"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)