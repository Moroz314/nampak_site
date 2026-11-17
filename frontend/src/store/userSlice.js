import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userApi, getUserToken, saveUserToken, clearUserToken } from '../api/axios'
import { fetchCart } from './cartSlice'

const getStoredProfile = () => {
  try {
    const raw = localStorage.getItem('user_profile')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/* ══════════════════════════════════════════════════════════════
   ASYNC THUNKS
   ══════════════════════════════════════════════════════════════ */

/** Вход покупателя */
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password, sessionId }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await userApi.post('/user/login', {
        email,
        password,
        session_id: sessionId,
      })
      saveUserToken(data.access_token)
      localStorage.setItem('user_profile', JSON.stringify(data.user))
      // Обновляем корзину, чтобы подтянуть объединённые товары
      if (sessionId) {
        dispatch(fetchCart(sessionId))
      }
      return data
    } catch (err) {
      const msg = err.response?.data?.detail ?? 'Неверный email или пароль'
      return rejectWithValue(msg)
    }
  }
)

/** Регистрация покупателя */
export const registerUser = createAsyncThunk(
  'user/register',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await userApi.post('/user/register', formData)
      saveUserToken(data.access_token)
      localStorage.setItem('user_profile', JSON.stringify(data.user))
      if (formData.session_id) {
        dispatch(fetchCart(formData.session_id))
      }
      return data
    } catch (err) {
      const msg = err.response?.data?.detail ?? 'Ошибка при регистрации. Проверьте введённые данные.'
      return rejectWithValue(msg)
    }
  }
)

/** Загрузка профиля текущего пользователя */
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userApi.get('/user/me')
      localStorage.setItem('user_profile', JSON.stringify(data))
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? 'Не удалось загрузить профиль')
    }
  }
)

/** Обновление профиля или смена пароля */
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updateData, { rejectWithValue }) => {
    try {
      const { data } = await userApi.patch('/user/me', updateData)
      localStorage.setItem('user_profile', JSON.stringify(data))
      return data
    } catch (err) {
      const msg = err.response?.data?.detail ?? 'Ошибка при обновлении профиля'
      return rejectWithValue(msg)
    }
  }
)

/* ══════════════════════════════════════════════════════════════
   SLICE
   ══════════════════════════════════════════════════════════════ */

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: getUserToken(),
    user: getStoredProfile(),
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      clearUserToken()
      state.token = null
      state.user = null
      state.error = null
    },
    clearUserError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    /* ── loginUser ─────────────────────────────────────────────── */
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.token = payload.access_token
        state.user = payload.user
        state.error = null
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

    /* ── registerUser ──────────────────────────────────────────── */
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.token = payload.access_token
        state.user = payload.user
        state.error = null
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

    /* ── fetchUserProfile ──────────────────────────────────────── */
    builder
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        state.user = payload
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        // Если токен протух, очищаем
        state.token = null
        state.user = null
        clearUserToken()
      })

    /* ── updateUserProfile ─────────────────────────────────────── */
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
  },
})

export const { logoutUser, clearUserError } = userSlice.actions
export default userSlice.reducer

export const selectCurrentUser = (state) => state.user.user
export const selectIsAuthenticated = (state) => !!state.user.token
export const selectUserLoading = (state) => state.user.loading
export const selectUserError = (state) => state.user.error
