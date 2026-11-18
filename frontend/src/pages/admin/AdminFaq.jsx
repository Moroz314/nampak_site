import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminApi } from '../../api/axios'

export default function AdminFaq() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState('')

  // Модалка создания / редактирования
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState({
    question: '',
    answer: '',
    sort_order: 0,
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // Модалка удаления
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const showToast = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 4000)
  }

  const loadFaq = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await adminApi.get('/admin/faq/')
      setItems(data || [])
    } catch (err) {
      console.error('Ошибка загрузки FAQ:', err)
      showToast('Не удалось загрузить вопросы')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFaq()
  }, [loadFaq])

  const openCreateModal = () => {
    setEditingItem(null)
    setForm({
      question: '',
      answer: '',
      sort_order: items.length > 0 ? Math.max(...items.map((i) => i.sort_order || 0)) + 1 : 1,
      is_active: true,
    })
    setFormError('')
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setForm({
      question: item.question,
      answer: item.answer,
      sort_order: item.sort_order ?? 0,
      is_active: item.is_active ?? true,
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.question.trim()) {
      setFormError('Укажите текст вопроса')
      return
    }
    if (!form.answer.trim()) {
      setFormError('Укажите текст ответа')
      return
    }

    setSaving(true)
    setFormError('')

    try {
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        sort_order: Number(form.sort_order) || 0,
        is_active: Boolean(form.is_active),
      }

      if (editingItem) {
        await adminApi.put(`/admin/faq/${editingItem.id}`, payload)
        showToast('Вопрос успешно обновлён')
      } else {
        await adminApi.post('/admin/faq/', payload)
        showToast('Новый вопрос успешно добавлен')
      }

      setModalOpen(false)
      loadFaq()
    } catch (err) {
      console.error('Ошибка сохранения FAQ:', err)
      setFormError(err.response?.data?.detail ?? 'Ошибка сохранения вопроса')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (item) => {
    try {
      await adminApi.put(`/admin/faq/${item.id}`, {
        is_active: !item.is_active,
      })
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, is_active: !it.is_active } : it))
      )
      showToast(item.is_active ? 'Вопрос скрыт с сайта' : 'Вопрос опубликован на сайте')
    } catch (err) {
      console.error('Ошибка переключения статуса:', err)
      showToast('Ошибка при изменении статуса')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminApi.delete(`/admin/faq/${deleteTarget.id}`)
      setItems((prev) => prev.filter((it) => it.id !== deleteTarget.id))
      showToast('Вопрос успешно удалён')
      setDeleteTarget(null)
    } catch (err) {
      console.error('Ошибка удаления FAQ:', err)
      showToast('Не удалось удалить вопрос')
    } finally {
      setDeleting(false)
    }
  }

  // Перемещение вверх / вниз
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= items.length) return

    const newItems = [...items]
    const current = newItems[index]
    const target = newItems[targetIndex]

    // Меняем местами
    newItems[index] = target
    newItems[targetIndex] = current

    // Обновляем sort_order
    const updatedWithOrder = newItems.map((item, idx) => ({
      ...item,
      sort_order: (idx + 1) * 10,
    }))

    setItems(updatedWithOrder)

    try {
      await adminApi.patch('/admin/faq/reorder', {
        items: updatedWithOrder.map((it) => ({
          id: it.id,
          sort_order: it.sort_order,
        })),
      })
      showToast('Порядок вопросов сохранён')
    } catch (err) {
      console.error('Ошибка сохранения порядка:', err)
      showToast('Не удалось сохранить порядок')
      loadFaq()
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Всплывающее уведомление */}
        {notification && (
          <div className="fixed top-5 right-5 z-50 bg-[#162330] text-white px-4 py-3 rounded-xl shadow-xl border border-[#C59B6D] text-xs font-bold flex items-center gap-2 animate-fade-in">
            <span className="text-[#C59B6D]">✓</span>
            <span>{notification}</span>
          </div>
        )}

        {/* Заголовок и панель действий */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF5EF] text-[#C59B6D] border border-[#E8D8C5] mb-2">
              <HelpCircle size={12} />
              <span>Частые вопросы на главной</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#162330] tracking-tight">
              Вопросы и ответы (FAQ)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Управление блоком «Частые вопросы покупателей» на главной странице НАМПАК
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#162330] hover:bg-[#1E2F40] active:scale-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} className="text-[#C59B6D]" />
            <span>Добавить вопрос</span>
          </button>
        </div>

        {/* Поиск */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по вопросам и ответам..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#C59B6D] focus:ring-1 focus:ring-[#C59B6D] outline-none transition-all shadow-2xs"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Список вопросов */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-slate-200 border-t-[#C59B6D] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Загружаем список вопросов...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <HelpCircle size={36} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              {search ? 'Ничего не найдено' : 'Вопросы FAQ ещё не созданы'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {search
                ? 'Попробуйте изменить поисковый запрос'
                : 'Добавьте первый вопрос для отображения на главной странице'}
            </p>
            {!search && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#162330] text-white rounded-xl text-xs font-bold"
              >
                <Plus size={14} />
                <span>Создать вопрос</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-2xs ${
                  item.is_active
                    ? 'border-slate-200/90 hover:border-slate-300'
                    : 'border-slate-200 bg-slate-50/70 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Порядок и основная информация */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Кнопки порядка */}
                    <div className="flex flex-col gap-1 items-center bg-slate-100 rounded-lg p-1 border border-slate-200 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0}
                        title="Поднять выше"
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <span className="text-[10px] font-bold text-slate-600 px-1">
                        {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 1)}
                        disabled={index === items.length - 1}
                        title="Опустить ниже"
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span>{item.is_active ? 'На сайте' : 'Скрыт'}</span>
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-sm sm:text-base text-[#162330]">
                        {item.question}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex items-center gap-1.5 sm:self-start flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      title={item.is_active ? 'Скрыть с сайта' : 'Показать на сайте'}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                        item.is_active
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                      }`}
                    >
                      {item.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span className="text-[11px] hidden md:inline">
                        {item.is_active ? 'Скрыть' : 'Показать'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      title="Редактировать"
                      className="p-2 text-slate-600 hover:text-[#C59B6D] hover:bg-[#FAF5EF] rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      title="Удалить вопрос"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            МОДАЛКА СОЗДАНИЯ / РЕДАКТИРОВАНИЯ
            ══════════════════════════════════════════════════════════ */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-xl border border-slate-200 shadow-2xl overflow-hidden animate-fade-in my-8">
              
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5EF] text-[#C59B6D] border border-[#E8D8C5] flex items-center justify-center font-bold">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#162330]">
                      {editingItem ? 'Редактировать вопрос' : 'Новый вопрос FAQ'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Будет опубликован в аккордеоне на главной странице
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    ⚠️ {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Вопрос покупателя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.question}
                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                    placeholder="Например: Как получить оптовую скидку?"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#C59B6D] focus:ring-1 focus:ring-[#C59B6D] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Развёрнутый ответ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={form.answer}
                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                    placeholder="Подробный ответ с условиями, сроками или контактами..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#C59B6D] focus:ring-1 focus:ring-[#C59B6D] outline-none transition-all leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Порядковый номер (сортировка)
                    </label>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#C59B6D] outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Чем меньше число, тем выше вопрос в списке
                    </span>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                        className="rounded border-slate-300 text-[#C59B6D] focus:ring-[#C59B6D]"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        Отображать на сайте
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[#162330] hover:bg-[#1E2F40] text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {saving ? 'Сохраняем...' : editingItem ? 'Сохранить изменения' : 'Создать вопрос'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ
            ══════════════════════════════════════════════════════════ */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 p-6 shadow-2xl animate-fade-in">
              <h3 className="font-heading font-black text-lg text-[#162330] mb-2">
                Удалить этот вопрос?
              </h3>
              <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                «{deleteTarget.question}»
              </p>
              <p className="text-xs text-rose-600 mb-6 font-semibold">
                Вопрос будет безвозвратно удален из базы данных и перестанет отображаться на сайте.
              </p>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {deleting ? 'Удаляем...' : 'Да, удалить'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
