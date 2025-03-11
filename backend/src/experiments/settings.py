import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    OPENAI_ORG_ID: Optional[str] = os.getenv("OPENAI_ORG_ID", None)
    TEXT_DIR: Optional[str] = "./input"
    PINECONE_API_KEY: Optional[str] = os.getenv("PINECONE_API_KEY", None)

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

def load_settings() -> Settings:
    """
    Load settings from a YAML file and override with environment variables.

    Args:
        yaml_file (str): Path to the YAML configuration file.        

    Returns:
        Settings: Pydantic Settings object with merged configurations.
    """
    return Settings()
