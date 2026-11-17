"""Telegram notification service."""
from __future__ import annotations

import logging
import requests

from app.config import get_settings

logger = logging.getLogger(__name__)


def send_telegram_message(text: str) -> bool:
    """Отправляет текстовое сообщение в Telegram через Bot API."""
    settings = get_settings()
    token = settings.telegram_bot_token
    chat_id = settings.telegram_chat_id

    if not token or not chat_id:
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }

    try:
        resp = requests.post(url, json=payload, timeout=10)
        if resp.status_code == 200:
            logger.info("Telegram notification sent successfully")
            return True
        else:
            logger.warning("Telegram API error %d: %s", resp.status_code, resp.text)
            return False
    except Exception as exc:
        logger.error("Failed to send telegram notification: %s", exc)
        return False
