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
    def __init__(self, api_key: str = None, session_id: str = "", system_message: str = ""):
        # Check keys in order of precedence: explicit -> GROQ_API_KEY -> ANTHROPIC_API_KEY -> EMERGENT_LLM_KEY
        groq_key = os.environ.get("GROQ_API_KEY", "")
        anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "")
        emergent_key = os.environ.get("EMERGENT_LLM_KEY", "")

        resolved_key = api_key if api_key is not None else (groq_key or anthropic_key or emergent_key or "")
        
        # Clean dummy placeholders
        if resolved_key and any(p in resolved_key.lower() for p in ["your-", "your_", "placeholder", "xxx"]):
            resolved_key = ""

        self.api_key = resolved_key.strip()
        self.session_id = session_id
        self.system_message = system_message
        
        # Default provider & model
        if self.api_key.startswith("gsk_") or (groq_key and not any(p in groq_key.lower() for p in ["your-", "your_", "placeholder"])):
            self.provider = "groq"
            self.model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
        else:
            self.provider = "anthropic"
            self.model = "claude-3-5-sonnet-20241022"

    def with_model(self, provider: str, model: str):
        if provider:
            self.provider = provider.lower()
        if model:
            self.model = model
        return self

    async def _stream_mock(self, message: UserMessage):
        """Smart fallback generator when no API key is provided."""
        logger.info("Using local Chemistry tutor mock generator.")
        mock_responses = {
            "atom": "An atom is the fundamental building block of all matter! It contains a central nucleus made of protons (positive) and neutrons (neutral), surrounded by electron shells with orbiting electrons (negative). Check out the **Atom Viewer** module in ChemiVerse to see animated electron orbitals in 3D!",
            "reaction": "A chemical reaction occurs when chemical bonds between atoms are formed, broken, or rearranged. Reactants transform into products with energy changes (exothermic releases heat, endothermic absorbs heat). Try the **Reaction Simulator** or **Virtual Lab** module!",
            "periodic": "The periodic table organizes all 118 known elements by increasing atomic number (number of protons) and electron configurations. Elements in the same group share similar chemical properties. Explore the **Periodic Galaxy** module to view 3D atomic profiles!",
            "molecule": "Molecules are formed when two or more atoms bond together through covalent, ionic, or metallic bonds. Explore real 3D ball-and-stick structures in the **Molecule Viewer** module!",
            "bond": "Chemical bonds hold atoms together. Ionic bonds involve electron transfer (e.g., NaCl), while covalent bonds involve electron sharing (e.g., H₂O).",
            "default": "Hello! I am **ChemiBot**, your AI chemistry tutor. I can explain atomic structures, balancing reactions, bonding types, stoichiometry, and periodic table trends. What chemistry topic would you like to explore?"
        }

        msg_lower = message.text.lower()
        response_text = mock_responses["default"]
        for key, val in mock_responses.items():
            if key in msg_lower:
                response_text = val
                break

        words = response_text.split(" ")
        for i, word in enumerate(words):
            yield TextDelta(content=word + (" " if i < len(words) - 1 else ""))
            await asyncio.sleep(0.025)
        yield StreamDone()

    async def _stream_groq(self, message: UserMessage):
        """Groq API streaming via OpenAI-compatible endpoint."""
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        model_name = self.model or os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
        data = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": self.system_message},
                {"role": "user", "content": message.text}
            ],
            "temperature": 0.6,
            "max_tokens": 1024,
            "stream": True,
        }

        logger.info(f"Streaming from Groq API with model: {model_name}")
        async with httpx.AsyncClient(timeout=45.0) as client:
            async with client.stream("POST", url, headers=headers, json=data) as response:
                if response.status_code != 200:
                    err_body = await response.aread()
                    logger.error(f"Groq API error {response.status_code}: {err_body.decode('utf-8')}")
                    raise Exception(f"Groq API error {response.status_code}")

                async for line in response.aiter_lines():
                    line = line.strip()
                    if not line:
                        continue
                    if line.startswith("data:"):
                        data_str = line[5:].strip()
                        if data_str == "[DONE]":
                            yield StreamDone()
                            return
                        try:
                            chunk = json.loads(data_str)
                            choices = chunk.get("choices", [])
                            if choices:
                                delta = choices[0].get("delta", {})
                                content = delta.get("content", "")
                                if content:
                                    yield TextDelta(content=content)
                        except Exception:
                            pass
        yield StreamDone()

    async def _stream_anthropic(self, message: UserMessage):
        """Anthropic API SSE streaming."""
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        data = {
            "model": self.model if "claude" in self.model else "claude-3-5-sonnet-20241022",
            "max_tokens": 1024,
            "system": self.system_message,
            "messages": [
                {"role": "user", "content": message.text}
            ],
            "stream": True
        }

        logger.info(f"Streaming from Anthropic API with model: {data['model']}")
        async with httpx.AsyncClient(timeout=45.0) as client:
            async with client.stream("POST", url, headers=headers, json=data) as response:
                if response.status_code != 200:
                    err_body = await response.aread()
                    logger.error(f"Anthropic API error {response.status_code}: {err_body.decode('utf-8')}")
                    raise Exception(f"Anthropic API error {response.status_code}")

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
                            return
        yield StreamDone()

    async def stream_message(self, message: UserMessage):
        has_valid_key = bool(self.api_key and not self.api_key.startswith("your-") and len(self.api_key) > 8)

        if not has_valid_key:
            async for chunk in self._stream_mock(message):
                yield chunk
            return

        try:
            if self.provider == "groq" or self.api_key.startswith("gsk_"):
                async for chunk in self._stream_groq(message):
                    yield chunk
            else:
                async for chunk in self._stream_anthropic(message):
                    yield chunk
        except Exception as e:
            logger.exception("Error during LLM streaming, falling back to mock generator.")
            async for chunk in self._stream_mock(message):
                yield chunk
