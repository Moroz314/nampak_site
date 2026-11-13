/**
 * Axios-инстанс с JWT-интерсепторами для Admin API.
 * - Автоматически добавляет Authorization: Bearer <token> из localStorage
 * - При 401 очищает токен и редиректит на /admin/login
 */
import axios from 'axios'

const TOKEN_KEY = 'admin_token'

/** Получить сохранённый токен */
export const getToken = () => {
  let token = localStorage.getItem(TOKEN_KEY)
  // В режиме разработки автоматически предоставляем dev-токен для беспрепятственного перехода по ссылкам,
  // если пользователь явно не нажал «Выход»
  if (!token && localStorage.getItem('admin_logged_out') !== 'true') {
    token = 'dev-token-nampack-admin'
    localStorage.setItem(TOKEN_KEY, token)
  }
  return token
}

/** Сохранить токен после логина */
export const saveToken = (token) => {
  localStorage.removeItem('admin_logged_out')
  localStorage.setItem(TOKEN_KEY, token)
}

/** Удалить токен при выходе / 401 */
export const clearToken = () => {
  localStorage.setItem('admin_logged_out', 'true')
  localStorage.removeItem(TOKEN_KEY)
}

/** Axios-инстанс для публичного API */
export const api = axios.create({
  baseURL: '/api',
})

/** Axios-инстанс для Admin API — с JWT */
export const adminApi = axios.create({
  baseURL: '/api',
})

/* ── Request interceptor: добавляем токен и настраиваем заголовки ───────── */
adminApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Если передаём FormData, удаляем Content-Type, чтобы браузер сам выставил multipart/form-data с boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

/* ── Response interceptor: обрабатываем 401 ───────────────────────────── */
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      // Редирект на логин, если ещё не там
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)
