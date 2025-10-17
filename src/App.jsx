import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Heart, MapPin, Calendar, Clock, Send } from 'lucide-react'
import { supabase, db } from './lib/supabase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import './App.css'

function App() {
  const [guestName, setGuestName] = useState('')
  const [wishName, setWishName] = useState('')
  const [wishMessage, setWishMessage] = useState('')
  const [wishes, setWishes] = useState([])
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Wedding date: Saturday, October 25, 2025, 4:00 PM Central Time
  const weddingDate = new Date('2025-10-25T16:00:00-05:00')

  // Load guest name from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const nameParam = urlParams.get('name')
    if (nameParam) {
      setGuestName(decodeURIComponent(nameParam))
    }
  }, [])

  // Fetch wishes function using wrapper, with a Firestore fallback
  const fetchWishes = async (attempt = 1) => {
    try {
      const res = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false })

      if (!res || res.error) {
        throw res?.error || new Error('Supabase wrapper returned no data')
      }

      let data = res.data || []
      if ((!data || data.length === 0) && attempt <= 2) {
        // Try direct Firestore read as fallback
        const wishesRef = collection(db, 'wishes')
        const q = query(wishesRef, orderBy('created_at', 'desc'))
        const snap = await getDocs(q)
        data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      }

      setWishes(normalizeWishes(data || []))
    } catch (error) {
      console.error('Error fetching wishes (wrapper), falling back to direct read:', error)
      try {
        const wishesRef = collection(db, 'wishes')
        const q = query(wishesRef, orderBy('created_at', 'desc'))
        const snap = await getDocs(q)
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setWishes(normalizeWishes(data || []))
      } catch (err2) {
        console.error('Direct Firestore fallback failed:', err2)
        if (attempt < 3) setTimeout(() => fetchWishes(attempt + 1), 500)
      }
    }
  }

  // Normalize created_at to ISO strings to avoid runtime errors when rendering
  const normalizeWishes = (items) => {
    return items.map((it) => {
      const d = { ...it }
      let createdAt = d.created_at
      try {
        if (createdAt && typeof createdAt.toDate === 'function') {
          createdAt = createdAt.toDate().toISOString()
        } else if (typeof createdAt === 'string') {
          // already an ISO string
        } else {
          createdAt = new Date().toISOString()
        }
      } catch (e) {
        console.error('Error normalizing created_at', e)
        createdAt = new Date().toISOString()
      }
      d.created_at = createdAt
      return d
    })
  }

  const formatDate = (iso) => {
    try {
      const dt = new Date(iso)
      if (isNaN(dt)) return ''
      return dt.toLocaleDateString()
    } catch (e) {
      console.error('Error formatting date', e)
      return ''
    }
  }

  // Load wishes from Supabase database
  useEffect(() => {
    fetchWishes()
  }, [])

  // Autoplay Quran recitation
  const audioPlayerRef = useRef(null)
  const cleanupFns = useRef(null)
  const [audioReady, setAudioReady] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)

  const togglePlayPause = async () => {
    try {
      const el = audioPlayerRef.current || document.getElementById('recitation')
      if (!el) return
      if (el.paused) {
        await el.play().catch(e => console.error('Play failed', e))
      } else {
        el.pause()
      }
      setAudioPlaying(!el.paused)
    } catch (e) {
      console.error('togglePlayPause error', e)
    }
  }

  useEffect(() => {
    let mounted = true
    const remote = 'https://podcasts.qurancentral.com/noreen-muhammad-siddique-al-duri-via-abu-amr/055-ar-rahman.mp3'

    const tryPlayElement = async (elem) => {
      if (!elem) return false
      // First try unmuted play
      try {
        elem.muted = false
        elem.volume = 0.3
        await elem.play()
        return true
      } catch (err) {
        // Try muted autoplay then unmute
        try {
          elem.muted = true
          elem.volume = 0.3
          await elem.play()
          // attempt to unmute - may remain muted by browser
          try { elem.muted = false } catch (e) {}
          return true
        } catch (err2) {
          console.log('Autoplay failed (unmuted & muted attempts):', err, err2)
          return false
        }
      }
    }

    const setup = async () => {
      const elem = document.getElementById('recitation')
      if (!elem) return

      elem.setAttribute('playsinline', 'true')
      elem.setAttribute('autoplay', 'true')
      elem.setAttribute('muted', 'true')
      elem.preload = 'auto'

      // prefer local file if present
      try {
        const res = await fetch('/recitation.mp3', { method: 'HEAD' })
        elem.src = res.ok ? '/recitation.mp3' : remote
      } catch (e) {
        elem.src = remote
      }

      const ok = await tryPlayElement(elem)
      audioPlayerRef.current = elem

      // attach listeners so UI stays in sync
      const onPlay = () => { setAudioPlaying(true) }
      const onPause = () => { setAudioPlaying(false) }
      elem.addEventListener('play', onPlay)
      elem.addEventListener('pause', onPause)

      // If autoplay worked (muted or unmuted), attempt to unmute immediately (best-effort).
      if (ok) {
        try { elem.muted = false; elem.volume = 0.3 } catch (e) { console.log('unmute attempt failed', e) }
      }
      setAudioPlaying(!elem.paused)
      if (mounted) setAudioReady(true)

      cleanupFns.current = {
        onPlay,
        onPause
      }
    }

    setup()

    const onInteraction = async () => {
      const el = audioPlayerRef.current || document.getElementById('recitation')
      if (!el) return
      try {
        await el.play()
        el.muted = false
        setAudioPlaying(!el.paused)
        setAudioReady(true)
      } catch (e) {
        console.log('Interaction play failed', e)
      }
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('touchstart', onInteraction)
      document.removeEventListener('pointerdown', onInteraction)
    }

    document.addEventListener('click', onInteraction)
    document.addEventListener('touchstart', onInteraction)
    document.addEventListener('pointerdown', onInteraction)

    return () => {
      mounted = false
      try {
        const el = audioPlayerRef.current || document.getElementById('recitation')
        if (el) {
          el.pause()
          if (cleanupFns.current) {
            el.removeEventListener('play', cleanupFns.current.onPlay)
            el.removeEventListener('pause', cleanupFns.current.onPause)
          }
        }
      } catch (e) {}
      cleanupFns.current = null
      document.removeEventListener('click', onInteraction)
      document.removeEventListener('touchstart', onInteraction)
      document.removeEventListener('pointerdown', onInteraction)
      setAudioReady(false)
      setAudioPlaying(false)
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = weddingDate.getTime() - now

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmitWish = async (e) => {
    e.preventDefault()
    if (wishName.trim() && wishMessage.trim()) {
      try {
        console.log('Submitting wish:', { name: wishName, message: wishMessage })

        const { data, error } = await supabase
          .from('wishes')
          .insert([
            { name: wishName, message: wishMessage }
          ])
          .select()
        if (error) {
          console.error('Error submitting wish:', error)
          alert(`Failed to submit wish: ${typeof error === 'string' ? error : error.message || 'Unknown error'}`)
        } else {
          console.log('Wish submitted successfully:', data)
          setWishName('')
          setWishMessage('')
          // Normalize and set returned wishes
          setWishes(normalizeWishes(data || []))
          alert('Thank you! Your wish has been submitted successfully.')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        alert('An unexpected error occurred. Please check the console for details.')
      }
    } else {
      alert('Please fill in both your name and message.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-transparent"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Invitation Header */}
            <div className="space-y-4">
              <Heart className="w-16 h-16 mx-auto text-blue-500 animate-pulse" />
              {/* audio controls removed from header - only bottom-right button remains */}
              {guestName && (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-md mx-auto border-2 border-blue-200">
                  <p className="text-3xl md:text-4xl font-serif text-blue-600 font-semibold">
                    {guestName}
                  </p>
                </div>
              )}
              <h2 className="text-2xl md:text-3xl font-light text-gray-600 tracking-wide">
                You are invited to
              </h2>
            </div>

            {/* Main Title */}
            <div className="space-y-6 py-8">
              <h1 className="text-4xl md:text-6xl font-serif text-gray-800 tracking-tight">
                The Wedding Of
              </h1>
              {/* Individual photo placeholders will be shown above each name card */}
              
              {/* Bride and Groom Names */}
              <div className="space-y-8 max-w-4xl mx-auto">
                {/* Photo above Farid */}
                <div className="relative overflow-hidden rounded-2xl shadow-xl flex items-center justify-center p-2">
                  <img src="/photos/farid.png" alt="Farid" style={{maxWidth: '100%', maxHeight: '260px', height: 'auto', width: 'auto', display: 'block'}} onError={(e) => { e.target.onerror = null; e.target.src = '/photos/photo1.svg'; }} />
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
                  <h2 className="text-3xl md:text-5xl font-serif text-blue-700 mb-4 leading-relaxed">
                    Muhamad Farid Geonova, S.T.
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 font-light">
                    the sole son of (Alm.) Yunitan Teguh Santosa and Ibu Irna Zuraidah
                  </p>
                </div>

                <div className="text-5xl text-blue-400 font-light">&</div>

                {/* Photo above Irfi */}
                <div className="relative overflow-hidden rounded-2xl shadow-xl flex items-center justify-center p-2">
                  <img src="/photos/irfi.png" alt="Irfi" style={{maxWidth: '100%', maxHeight: '260px', height: 'auto', width: 'auto', display: 'block'}} onError={(e) => { e.target.onerror = null; e.target.src = '/photos/photo2.svg'; }} />
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
                  <h2 className="text-3xl md:text-5xl font-serif text-blue-700 mb-4 leading-relaxed">
                    Irfianti Nur Jannah, S.T., M.M.
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 font-light">
                    the first daughter of Bapak H. Akbp. Ansori, A. Md., S.H. and Ibu Dra. Ruyati
                  </p>
                </div>
              </div>
            </div>

            {/* Emphasized date and countdown moved up below names */}
            <div className="max-w-4xl mx-auto mt-6 space-y-6">
              {/* Emphasized date 251025 */}
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-extrabold tracking-[0.25em] text-blue-700 select-none">
                  251025
                </div>
                <div className="mt-2 text-sm text-gray-500">25 • October • 2025</div>
              </div>
              {/* Countdown Timer */}
              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl md:text-3xl font-serif mb-6">Counting Down To Our Special Day</h3>
                  <div className="grid grid-cols-4 gap-4 md:gap-8">
                    <div className="text-center">
                      <div className="text-4xl md:text-6xl font-bold">{countdown.days}</div>
                      <div className="text-sm md:text-base mt-2 opacity-90">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl md:text-6xl font-bold">{countdown.hours}</div>
                      <div className="text-sm md:text-base mt-2 opacity-90">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl md:text-6xl font-bold">{countdown.minutes}</div>
                      <div className="text-sm md:text-base mt-2 opacity-90">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl md:text-6xl font-bold">{countdown.seconds}</div>
                      <div className="text-sm md:text-base mt-2 opacity-90">Seconds</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date and Location */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Calendar className="w-6 h-6" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xl font-semibold text-gray-800">Saturday, October 25, 2025</p>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    4:00 PM Central US Time
                  </p>
                  <div className="text-center text-gray-500 text-sm my-2">or</div>
                  <p className="text-lg font-semibold text-gray-800">Sunday, October 26, 2025</p>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    04:00 AM WIB (Morning)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <MapPin className="w-6 h-6" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xl font-semibold text-gray-800">Masjid Istiqlal Houston</p>
                  <p className="text-gray-600">15303 Mc Kaskle Rd</p>
                  <p className="text-gray-600">Sugar Land, Texas 77498</p>
                  <p className="text-gray-600">United States</p>
                  <a 
                    href="https://maps.google.com/?q=15303+Mc+Kaskle+Rd,+Sugar+Land,+Texas+77498" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2"
                  >
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                      Open in Maps
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Virtual Attendance - Zoom Link */}
            <div className="max-w-4xl mx-auto mt-8">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 3C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H5M5 5H19V19H5V5M7 7V17H17V7H7Z"/>
                    </svg>
                    Join Us Virtually
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">Can't attend in person? Join us via Zoom!</p>
                  <a
                    href={`https://lsu.zoom.us/j/4906157210?omn=98375303152`} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Join Zoom Meeting
                    </Button>
                  </a>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Meeting ID: <span className="font-medium">{import.meta.env.VITE_ZOOM_MEETING_ID}</span></p>
                    <p className="text-red-500">Passcode: <span className="font-medium">Contact the host for passcode</span></p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Countdown moved above, under names */}

            {/* Quranic Verse */}
            <div className="max-w-3xl mx-auto mt-16">
              <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
                <CardContent className="p-8 md:p-12 space-y-6">
                  <div className="text-center">
                    <p className="text-lg md:text-xl font-semibold text-blue-700 mb-4">
                      QS Ar-Rum: 21
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mb-6"></div>
                    <p className="text-lg md:text-2xl text-gray-700 leading-relaxed italic font-serif">
                      "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hadith below Qur'an verse */}
            <div className="max-w-3xl mx-auto mt-8">
              <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center space-y-4">
                    <p className="text-lg md:text-2xl text-gray-700 leading-relaxed italic font-serif">
                      It was narrated from Aishah that: the Messenger of Allah said: “Marriage is part of my sunnah, and whoever does not follow my sunnah has nothing to do with me. Get married, for I will boast of your great numbers before the nations. Whoever has the means, let him get married, and whoever does not, then he should fast for it will diminish his desire.”
                    </p>
                    <p className="text-sm text-gray-500">(Sunan Ibn Majah 1846)</p>
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* Wedding Gift section removed as requested */}

            {/* Wishes Section */}
            <div className="max-w-4xl mx-auto mt-16 space-y-8">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800">Send Your Wishes</h2>
              
              {/* Wish Form */}
              <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmitWish} className="space-y-4">
                    <div>
                      <label htmlFor="wishName" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <Input
                        id="wishName"
                        type="text"
                        placeholder="Enter your name"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        required
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="wishMessage" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message
                      </label>
                      <Textarea
                        id="wishMessage"
                        placeholder="Share your wishes and prayers for the couple..."
                        value={wishMessage}
                        onChange={(e) => setWishMessage(e.target.value)}
                        required
                        rows={4}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Wishes
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Wishes Display */}
              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-gray-800">
                  Wishes from Friends & Family ({wishes.length})
                </h3>
                {wishes.length === 0 ? (
                  <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                    <CardContent className="p-8 text-center text-gray-500">
                      No wishes yet. Be the first to send your wishes!
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {wishes.map((wish) => (
                      <Card key={wish.id} className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                              {(wish?.name?.charAt?.(0) || '?').toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-800">{wish?.name || 'Anonymous'}</h4>
                                <span className="text-xs text-gray-500">
                                  {wish?.created_at ? formatDate(wish.created_at) : ''}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{wish?.message || ''}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pb-8 text-center text-gray-600">
              <Heart className="w-8 h-8 mx-auto mb-4 text-blue-400" />
              <p className="text-lg font-serif">
                We can't wait to celebrate with you!
              </p>
              <p className="mt-4 text-sm">
                Farid & Irfi
              </p>
            </div>
            {/* Floating audio control for mobile/autoplay-blocked */}
            {audioReady && (
              <div className="fixed bottom-6 right-6">
                <button
                  onClick={togglePlayPause}
                  className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border"
                  aria-label="Play or pause recitation"
                >
                  {audioPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.518-3.759A1 1 0 007 8.256v7.488a1 1 0 001.234.97l6.518-3.759A1 1 0 0016 11.512v-.224a1 1 0 00-.248-.12z" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
