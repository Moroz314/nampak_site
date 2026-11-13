import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, X, ExternalLink, Image as ImageIcon, Video, Filter } from 'lucide-react'
import { api } from '../api/axios'

function getEmbedInfo(videoUrl) {
  if (!videoUrl) return null

  const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      previewUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
      originalUrl: videoUrl,
    }
  }

  const vkExtMatch = videoUrl.match(/vk\.com\/video_ext\.php\?oid=([-\d]+)&id=([-\d]+)(?:&hash=([a-f0-9]+))?/)
  if (vkExtMatch) {
    return {
      type: 'vk',
      embedUrl: videoUrl,
      originalUrl: videoUrl,
    }
  }

  const vkDirectMatch = videoUrl.match(/vk\.com\/video([-\d]+)_([-\d]+)/)
  if (vkDirectMatch) {
    const oid = vkDirectMatch[1]
    const vid = vkDirectMatch[2]
    return {
      type: 'vk',
      embedUrl: `https://vk.com/video_ext.php?oid=${oid}&id=${vid}`,
      originalUrl: videoUrl,
    }
  }

  return {
    type: 'generic',
    embedUrl: null,
    originalUrl: videoUrl,
  }
}

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | 'photo' | 'video'
  const [selectedMedia, setSelectedMedia] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    api.get('/gallery/')
      .then(({ data }) => {
        if (active) setItems(data)
      })
      .catch(() => {
        if (active) setError('Не удалось загрузить галерею.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const filteredItems = items.filter(item => {
    if (filter === 'photo') return Boolean(item.image_url)
    if (filter === 'video') return Boolean(item.video_url)
    return true
  })

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#162330] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Галерея образцов</span>
        </nav>

        {/* Заголовок */}
        <div className="mb-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF5EF] text-[#B08455] border border-[#E8D8C5] mb-3">
            Производство и образцы
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#162330] tracking-tight mb-3">
            Галерея продукции «НАМПАК»
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Фотографии готовых тиражей упаковки, примеры брендирования и печати логотипов на коробках, пакетах и фирменном скотче.
          </p>
        </div>

        {/* Фильтры */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#162330] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Все материалы ({items.length})
          </button>
          <button
            onClick={() => setFilter('photo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'photo'
                ? 'bg-[#162330] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Фотографии</span>
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'video'
                ? 'bg-[#162330] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Видео производства</span>
          </button>
        </div>

        {/* Сетка медиа */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl h-64 border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Материалы скоро появятся</h3>
            <p className="text-xs text-slate-500 mb-6">
              Мы загружаем свежие фотографии изготовленных партий коробок и пакетов.
            </p>
            <Link to="/" className="inline-flex px-5 py-2.5 rounded-xl bg-[#162330] text-white text-xs font-bold hover:bg-[#1E2F40]">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => {
              const embed = item.video_url ? getEmbedInfo(item.video_url) : null
              const isVideo = Boolean(item.video_url)
              const previewSrc = item.image_url || embed?.previewUrl

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt={item.title || 'Образец упаковки'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}

                    {isVideo && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#162330] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {item.title && (
                        <h3 className="font-bold text-sm text-[#162330] line-clamp-1 mb-1">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Lightbox модалка */}
        {selectedMedia && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[75vh] flex items-center justify-center bg-black">
                {selectedMedia.video_url ? (
                  (() => {
                    const embed = getEmbedInfo(selectedMedia.video_url)
                    return embed?.embedUrl ? (
                      <iframe
                        src={embed.embedUrl}
                        title={selectedMedia.title}
                        className="w-full aspect-video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="p-12 text-center text-white">
                        <p className="mb-4 text-sm">Воспроизведение видео доступно по внешней ссылке:</p>
                        <a
                          href={selectedMedia.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C59B6D] text-white font-bold text-xs"
                        >
                          <span>Смотреть видео</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )
                  })()
                ) : (
                  <img
                    src={selectedMedia.image_url}
                    alt={selectedMedia.title}
                    className="max-h-[75vh] w-auto object-contain"
                  />
                )}
              </div>

              {(selectedMedia.title || selectedMedia.description) && (
                <div className="p-6 bg-white">
                  {selectedMedia.title && (
                    <h3 className="text-lg font-bold text-[#162330] mb-1">{selectedMedia.title}</h3>
                  )}
                  {selectedMedia.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedMedia.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
