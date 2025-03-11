import os
from pydantic_settings import BaseSettings
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
from semantic_kernel.connectors.ai.open_ai.prompt_execution_settings.open_ai_prompt_execution_settings import (
    OpenAIChatPromptExecutionSettings
)
from typing import Optional

class Settings(BaseSettings):
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    OPENAI_ORG_ID: Optional[str] = os.getenv("OPENAI_ORG_ID", None)
    SERVICE_ID: str  ="sk-test"

    PINECONE_API_KEY: Optional[str] = os.getenv("PINECONE_API_KEY", None)
    PINECONE_INDEX_NAME: str = "irac"
    PINECONE_ENV: str = "aws"   

    GRAPHRAG_LLM_MODEL: str = "gpt-4o-mini"
    GRAPHRAG_LLM_API_BASE: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

def setup(settings: Settings):
    """
    Initialize the ChatOpenAI and OpenAIEmbedding instances based on the settings.

    Args:
        settings: The settings object containing configuration details.

    Returns:
        A tuple of (llm, text_embedder).
    """
    
    chat_completion = OpenAIChatCompletion(
        ai_model_id=settings.GRAPHRAG_LLM_MODEL,
        service_id=settings.SERVICE_ID,
        api_key=settings.OPENAI_API_KEY,
        org_id=settings.OPENAI_ORG_ID
    )

    execution_settings = OpenAIChatPromptExecutionSettings()
    execution_settings.function_choice_behavior = FunctionChoiceBehavior.Auto()

    return chat_completion, execution_settings


def load_settings() -> Settings:
    """
    Load settings from a YAML file and override with environment variables.

    Args:
        yaml_file (str): Path to the YAML configuration file.        

    Returns:
        Settings: Pydantic Settings object with merged configurations.
    """
    return Settings()
