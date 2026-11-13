import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Tag, ChevronRight, FileText, BookOpen } from 'lucide-react'
import { api } from '../api/axios'

function decodeHtmlText(html) {
  if (!html) return ''
  const clean = html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ')
  try {
    const doc = new DOMParser().parseFromString(clean, 'text/html')
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
  } catch {
    return clean.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }
}

function cleanHtmlContent(html) {
  if (!html) return ''
  return html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ')
}

/* ── Карточка статьи ─────────────────────────────────────────────────────── */
function ArticleCard({ article }) {
  const [expanded, setExpanded] = useState(false)

  const date = new Date(article.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const plainText = decodeHtmlText(article.content)
  const isHtml = Boolean(article.content && /<[a-z][\s\S]*>/i.test(article.content))
  const preview = plainText.slice(0, 260)
  const hasMore = plainText.length > 260 || isHtml
  const formattedHtml = cleanHtmlContent(article.content)

  return (
    <article className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:shadow-md mb-8">
      {/* Обложка статьи */}
      {article.image_url && (
        <div
          onClick={() => setExpanded(e => !e)}
          className="overflow-hidden cursor-pointer group bg-slate-100 max-h-96"
        >
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-64 sm:h-80 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Метаданные: Дата и Раздел */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>

          {article.section && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF5EF] text-[#B08455] border border-[#E8D8C5]">
              {article.section.name}
            </span>
          )}
        </div>

        {/* Заголовок */}
        <h2
          onClick={() => setExpanded(e => !e)}
          className="text-xl sm:text-2xl font-bold text-[#162330] leading-snug mb-3 hover:text-[#C59B6D] transition-colors cursor-pointer"
        >
          {article.title}
        </h2>

        {/* Текст */}
        {expanded ? (
          isHtml ? (
            <div
              className="font-sans text-sm text-slate-700 leading-relaxed space-y-4 pt-2 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 [&_img]:my-4 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#162330] [&_h3]:text-base [&_h3]:font-bold"
              dangerouslySetInnerHTML={{ __html: formattedHtml }}
            />
          ) : (
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line pt-2">
              {formattedHtml}
            </div>
          )
        ) : (
          <div className="text-slate-600 text-sm leading-relaxed">
            {preview}
            {hasMore && <span className="text-slate-400">…</span>}
          </div>
        )}

        {/* Кнопка Развернуть / Свернуть */}
        {hasMore && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-xs font-bold text-[#162330] hover:text-[#C59B6D] transition-colors inline-flex items-center gap-1"
            >
              <span>{expanded ? 'Свернуть' : 'Читать полностью'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? '-rotate-90' : 'rotate-90'}`} />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default function ArticlesPage({ type = 'news', title, subtitle, emptyText }) {
  const [articles, setArticles] = useState([])
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([
      api.get(`/articles/?type=${type}`).catch(() => api.get(`/content/articles?type=${type}`)),
      api.get(`/articles/sections/training`).catch(() => api.get(`/content/sections?type=${type}`)),
    ])
      .then(([articlesRes, sectionsRes]) => {
        if (active) {
          setArticles(articlesRes?.data || [])
          setSections(sectionsRes?.data || [])
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [type])

  const filtered = selectedSection
    ? articles.filter(a => a.section_id === selectedSection)
    : articles

  const pageTitle = title || (type === 'news' ? 'Новости' : 'Обучение')
  const pageSubtitle = subtitle || (
    type === 'news'
      ? 'Новости производства НАМПАК, расширение ассортимента гофротары и анонсы.'
      : 'Стандарты коробов для Wildberries и Ozon, свойства картона и инструкции.'
  )

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#162330] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{pageTitle}</span>
        </nav>

        {/* Заголовок */}
        <div className="mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF5EF] text-[#B08455] border border-[#E8D8C5] mb-3">
            {type === 'news' ? 'Новости' : 'Обучение'}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#162330] tracking-tight mb-3">
            {pageTitle}
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Фильтр по разделам (если есть) */}
        {sections.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button
              onClick={() => setSelectedSection(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSection === null
                  ? 'bg-[#162330] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Все публикации ({articles.length})
            </button>
            {sections.map(s => {
              const count = articles.filter(a => a.section_id === s.id).length
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSection(s.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedSection === s.id
                      ? 'bg-[#162330] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s.name} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* Список статей */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse h-48" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {emptyText || 'Публикации скоро появятся'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Мы регулярно публикуем полезные материалы об упаковке и новости нашей компании.
            </p>
            <Link to="/" className="inline-flex px-5 py-2.5 rounded-xl bg-[#162330] text-white text-xs font-bold hover:bg-[#1E2F40]">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div>
            {filtered.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
