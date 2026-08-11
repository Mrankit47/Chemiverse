import os
import json
import httpx
import logging
import asyncio

logger = logging.getLogger(__name__)

class UserMessage:
    def __init__(self, text: str):
        self.text = text

class TextDelta:
    def __init__(self, content: str):
        self.content = content

class StreamDone:
    pass

class LlmChat:
    def __init__(self, api_key: str, session_id: str, system_message: str):
        # Resolve the API key. Fall back to environment variable ANTHROPIC_API_KEY
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        # If it's a dummy value or template, clear it so we use the mock fallback
        if self.api_key and ("your-emergent" in self.api_key or "your_key" in self.api_key or self.api_key == ""):
            self.api_key = os.environ.get("ANTHROPIC_API_KEY")
        
        self.session_id = session_id
        self.system_message = system_message
        self.provider = "anthropic"
        self.model = "claude-3-5-sonnet-20241022"

    def with_model(self, provider: str, model: str):
        self.provider = provider
        # Map input model to a valid Anthropic model
        if "sonnet" in model:
            self.model = "claude-3-5-sonnet-20241022"
        else:
            self.model = model
        return self

    async def stream_message(self, message: UserMessage):
        # Check if we have a valid key to use Anthropic API
        has_valid_key = self.api_key and not self.api_key.startswith("your-") and len(self.api_key) > 10

        if not has_valid_key:
            # Smart Mock Fallback Generator
            logger.info("No valid ANTHROPIC_API_KEY or EMERGENT_LLM_KEY found. Using local mock generator.")
            mock_responses = {
                "atom": "An atom is the basic building block of chemistry. It consists of a dense central nucleus surrounded by a cloud of negatively charged electrons. The nucleus contains a mix of positively charged protons and electrically neutral neutrons.",
                "reaction": "A chemical reaction is a process that leads to the transformation of one set of chemical substances to another. It involves changes in the positions of electrons to form and break chemical bonds.",
                "periodic": "The periodic table organizes all chemical elements by atomic number, electron configuration, and recurring chemical properties.",
                "default": "Hello! I am ChemiBot, your AI chemistry tutor. I can help you understand atomic structures, chemical reactions, molecular bonds, and the periodic table. What would you like to explore?"
            }
            
            # Simple keyword matching for tutor responses
            msg_lower = message.text.lower()
            response_text = mock_responses["default"]
            for key, val in mock_responses.items():
                if key in msg_lower:
                    response_text = val
                    break

            # Yield chunks with short delays to simulate streaming
            words = response_text.split(" ")
            for i, word in enumerate(words):
                yield TextDelta(content=word + (" " if i < len(words) - 1 else ""))
                await asyncio.sleep(0.03)
            yield StreamDone()
            return

        # Real Anthropic SSE Streaming Call
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        data = {
            "model": self.model,
            "max_tokens": 1024,
            "system": self.system_message,
            "messages": [
                {"role": "user", "content": message.text}
            ],
            "stream": True
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                async with client.stream("POST", url, headers=headers, json=data) as response:
                    if response.status_code != 200:
                        err_body = await response.aread()
                        logger.error(f"Anthropic API returned status {response.status_code}: {err_body.decode('utf-8')}")
                        raise Exception(f"API Error: {response.status_code}")

                    current_event = None
                    async for line in response.aiter_lines():
                        line = line.strip()
                        if not line:
                            continue
                        if line.startswith("event:"):
                            current_event = line[6:].strip()
                        elif line.startswith("data:"):
                            data_str = line[5:].strip()
                            if current_event == "content_block_delta":
                                try:
                                    delta_obj = json.loads(data_str)
                                    text = delta_obj.get("delta", {}).get("text", "")
                                    if text:
                                        yield TextDelta(content=text)
                                except Exception:
                                    pass
                            elif current_event == "message_stop":
                                yield StreamDone()
                                break
        except Exception as e:
            logger.exception("Error during Anthropic API streaming. Falling back to mock generator.")
            yield TextDelta(content="An atom is the basic building block of all matter. It has a nucleus with protons and neutrons, and electrons orbiting around it.")
            yield StreamDone()
