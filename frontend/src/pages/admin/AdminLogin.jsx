import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, User, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react'
import { api, saveToken } from '../../api/axios'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin/products'

  const [form,    setForm]    = useState({ username: 'admin', password: 'admin' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      saveToken(data.access_token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Ошибка входа. Проверьте логин и пароль.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Карточка входа */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-8 sm:p-10">
          
          {/* Логотип */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#162330] text-[#C59B6D] flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-sm">
              Н
            </div>
            <div className="text-2xl font-black text-[#162330] tracking-tight">
              НАМ<span className="text-[#C59B6D]">ПАК</span>
            </div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Панель управления
            </div>
          </div>

          {/* Подсказка для демо-доступа */}
          <div className="mb-5 bg-[#FAF5EF] border border-[#E8D8C5] rounded-xl p-3 text-xs text-[#B08455] flex items-center justify-between">
            <div className="leading-snug">
              <span className="font-bold text-[#162330]">Демо-вход:</span> логин <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8D8C5] font-mono font-bold text-[#162330]">admin</code>, пароль <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8D8C5] font-mono font-bold text-[#162330]">admin</code>
            </div>
            <button
              type="button"
              onClick={() => setForm({ username: 'admin', password: 'admin' })}
              className="font-bold underline hover:text-[#162330] ml-2 text-[11px] whitespace-nowrap"
            >
              Заполнить
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Имя пользователя
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                  autoComplete="username"
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-sm text-[#162330] focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Пароль
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-sm text-[#162330] focus:border-[#C59B6D] focus:ring-2 focus:ring-[#C59B6D]/20 outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {error && (
              <p className="text-rose-600 text-xs bg-rose-50 rounded-xl p-3 border border-rose-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#162330] hover:bg-[#1E2F40] text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Shield className="w-4 h-4 text-[#C59B6D]" />
              <span>{loading ? 'Вход в систему...' : 'Войти в панель управления'}</span>
            </button>
          </form>

        </div>

        {/* Ссылка на сайт */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#162330] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться на сайт</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
