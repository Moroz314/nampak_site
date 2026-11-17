/**
 * Axios-инстансы для работы с API:
 * - api: публичный API и корзина/заказ (подставляет токен покупателя при наличии)
 * - userApi: API личного кабинета покупателя (/api/user/*)
 * - adminApi: защищённый Admin API (/api/admin/*)
 */
import axios from 'axios'

/* ══════════════════════════════════════════════════════════════
   1. ADMIN TOKEN MANAGEMENT
   ══════════════════════════════════════════════════════════════ */
const ADMIN_TOKEN_KEY = 'admin_token'

export const getToken = () => {
  let token = localStorage.getItem(ADMIN_TOKEN_KEY)
  if (!token && localStorage.getItem('admin_logged_out') !== 'true') {
    token = 'dev-token-nampack-admin'
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
  }
  return token
}

export const saveToken = (token) => {
  localStorage.removeItem('admin_logged_out')
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export const clearToken = () => {
  localStorage.setItem('admin_logged_out', 'true')
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

/* ══════════════════════════════════════════════════════════════
   2. CUSTOMER (USER) TOKEN MANAGEMENT
   ══════════════════════════════════════════════════════════════ */
const USER_TOKEN_KEY = 'user_token'

export const getUserToken = () => {
  return localStorage.getItem(USER_TOKEN_KEY) || null
}

export const saveUserToken = (token) => {
  if (token) {
    localStorage.setItem(USER_TOKEN_KEY, token)
  }
}

export const clearUserToken = () => {
  localStorage.removeItem(USER_TOKEN_KEY)
  localStorage.removeItem('user_profile')
}

/* ══════════════════════════════════════════════════════════════
   3. AXIOS INSTANCES
   ══════════════════════════════════════════════════════════════ */

/** Axios-инстанс для публичного API (товары, категории, корзина, оформление) */
export const api = axios.create({
  baseURL: '/api',
})

/** Axios-инстанс для личного кабинета покупателя */
export const userApi = axios.create({
  baseURL: '/api',
})

/** Axios-инстанс для панели управления администратора */
export const adminApi = axios.create({
  baseURL: '/api',
})

/* ── Request Interceptors ────────────────────────────────────── */

// Публичный API: если покупатель авторизован, прикрепляем Bearer токен (для корзины и заказа)
api.interceptors.request.use((config) => {
  const token = getUserToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

// Личный кабинет покупателя: всегда подставляет токен покупателя
userApi.interceptors.request.use((config) => {
  const token = getUserToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

// Админ-панель: подставляет токен администратора
adminApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

/* ── Response Interceptors ───────────────────────────────────── */

// Обработка 401 для личного кабинета покупателя
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearUserToken()
      // Редирект на /login только если пользователь находится в защищённом разделе кабинета
      if (window.location.pathname.startsWith('/account')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Обработка 401 для админ-панели
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)
