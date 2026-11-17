"""
JWT-зависимости для FastAPI Dependency Injection.
"""
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models import AdminUser, User

settings = get_settings()

# ── Argon2 hasher ────────────────────────────────────────────────────────────
_ph = PasswordHasher()

# ── OAuth2 схема — указывает Swagger где логиниться ───────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

ALGORITHM             = "HS256"
TOKEN_EXPIRE          = timedelta(hours=24)
CUSTOMER_TOKEN_EXPIRE = timedelta(days=30)


# ── Хелперы для паролей ───────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    return _ph.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return _ph.verify(hashed, plain)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


# ── Хелперы для JWT ───────────────────────────────────────────────────────────

def create_access_token(subject: str, role: str = "admin") -> str:
    expire = datetime.now(timezone.utc) + TOKEN_EXPIRE
    payload = {"sub": subject, "role": role, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def create_customer_token(user_id: int, email: str) -> str:
    expire = datetime.now(timezone.utc) + CUSTOMER_TOKEN_EXPIRE
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": "customer",
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_token(token: str) -> str:
    """Декодирует JWT администратора и возвращает username (sub). Бросает 401/403 при ошибке."""
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Недействительный или истёкший токен",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        if payload.get("role") == "customer":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Токен покупателя не может быть использован в панели управления",
            )
        username: str | None = payload.get("sub")
        if not username:
            raise credentials_exc
        return username
    except JWTError:
        raise credentials_exc


# ── Dependency: текущий администратор ────────────────────────────────────────

async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db:    AsyncSession = Depends(get_db),
) -> AdminUser:
    username = decode_token(token)
    result = await db.execute(select(AdminUser).where(AdminUser.username == username))
    admin = result.scalar_one_or_none()
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Администратор не найден",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return admin


# ── Dependency: текущий покупатель (строгая авторизация) ─────────────────────

async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    auth_header = request.headers.get("Authorization")
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Необходима авторизация покупателя",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not auth_header or not auth_header.startswith("Bearer "):
        raise credentials_exc

    token = auth_header[7:].strip()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        if payload.get("role") != "customer":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступ запрещён: токен администратора не может использоваться в личном кабинете покупателя",
            )
        sub = payload.get("sub")
        if not sub:
            raise credentials_exc
        user_id = int(sub)
    except (JWTError, ValueError):
        raise credentials_exc

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise credentials_exc
    return user


# ── Dependency: опциональный покупатель (для корзины и гостевого заказа) ─────

async def get_optional_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User | None:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    token = auth_header[7:].strip()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        if payload.get("role") != "customer":
            return None
        sub = payload.get("sub")
        if not sub:
            return None
        user_id = int(sub)
    except Exception:
        return None

    try:
        result = await db.execute(select(User).where(User.id == user_id, User.is_active.is_(True)))
        return result.scalar_one_or_none()
    except Exception:
        return None
