import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Heart, MapPin, Calendar, Clock, Send } from 'lucide-react'
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

  // Wedding date: Saturday, October 25, 2025, 12:00 PM Central Time
  const weddingDate = new Date('2025-10-25T12:00:00-05:00')

  // Load guest name from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const nameParam = urlParams.get('name')
    if (nameParam) {
      setGuestName(decodeURIComponent(nameParam))
    }
  }, [])

  // Load wishes from localStorage
  useEffect(() => {
    const savedWishes = localStorage.getItem('weddingWishes')
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes))
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

  const handleSubmitWish = (e) => {
    e.preventDefault()
    if (wishName.trim() && wishMessage.trim()) {
      const newWish = {
        id: Date.now(),
        name: wishName,
        message: wishMessage,
        timestamp: new Date().toISOString()
      }
      const updatedWishes = [newWish, ...wishes]
      setWishes(updatedWishes)
      localStorage.setItem('weddingWishes', JSON.stringify(updatedWishes))
      setWishName('')
      setWishMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-100/50 to-transparent"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Invitation Header */}
            <div className="space-y-4">
              <Heart className="w-16 h-16 mx-auto text-rose-500 animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-light text-gray-600 tracking-wide">
                You are invited to
              </h2>
              {guestName && (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-md mx-auto border-2 border-rose-200">
                  <p className="text-3xl md:text-4xl font-serif text-rose-600 font-semibold">
                    {guestName}
                  </p>
                </div>
              )}
            </div>

            {/* Main Title */}
            <div className="space-y-6 py-8">
              <h1 className="text-4xl md:text-6xl font-serif text-gray-800 tracking-tight">
                The Wedding Of
              </h1>
              
              {/* Bride and Groom Names */}
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-rose-100">
                  <h2 className="text-3xl md:text-5xl font-serif text-rose-700 mb-4 leading-relaxed">
                    Muhamad Farid Geonova, S.T.
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 font-light">
                    bin (Alm.) Yunitan Teguh Santosa
                  </p>
                </div>

                <div className="text-5xl text-rose-400 font-light">&</div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-rose-100">
                  <h2 className="text-3xl md:text-5xl font-serif text-rose-700 mb-4 leading-relaxed">
                    Irfianti Nur Jannah, S.T., M.M.
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 font-light">
                    binti Bapak H. Akbp. Ansori, A. Md., S.H.
                  </p>
                </div>
              </div>
            </div>

            {/* Date and Location */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="bg-white/90 backdrop-blur-sm border-rose-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rose-700">
                    <Calendar className="w-6 h-6" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xl font-semibold text-gray-800">Saturday, October 25, 2025</p>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    12:00 PM Central US Time
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-rose-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rose-700">
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
                    <Button variant="outline" size="sm" className="text-rose-600 border-rose-300 hover:bg-rose-50">
                      Open in Maps
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Countdown Timer */}
            <div className="max-w-4xl mx-auto mt-12">
              <Card className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-2xl">
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

            {/* Quranic Verse */}
            <div className="max-w-3xl mx-auto mt-16">
              <Card className="bg-white/95 backdrop-blur-sm border-rose-200 shadow-xl">
                <CardContent className="p-8 md:p-12 space-y-6">
                  <div className="text-center">
                    <p className="text-lg md:text-xl font-semibold text-rose-700 mb-4">
                      QS Ar-Rum: 21
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent mb-6"></div>
                    <p className="text-lg md:text-2xl text-gray-700 leading-relaxed italic font-serif">
                      "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Photo Gallery */}
            <div className="max-w-6xl mx-auto mt-16">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 text-center mb-8">Our Moments</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Photo 1 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-rose-200 to-pink-200 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-rose-400" />
                      <p className="text-gray-600 font-medium">Photo 1</p>
                      <p className="text-sm text-gray-500 mt-2">Replace with your photo</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Photo 2 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-pink-400" />
                      <p className="text-gray-600 font-medium">Photo 2</p>
                      <p className="text-sm text-gray-500 mt-2">Replace with your photo</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Photo 3 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-purple-200 to-rose-200 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                      <p className="text-gray-600 font-medium">Photo 3</p>
                      <p className="text-sm text-gray-500 mt-2">Replace with your photo</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Photo 4 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-rose-200 to-orange-200 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                      <p className="text-gray-600 font-medium">Photo 4</p>
                      <p className="text-sm text-gray-500 mt-2">Replace with your photo</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Photo 5 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-rose-400" />
                      <p className="text-gray-600 font-medium">Photo 5</p>
                      <p className="text-sm text-gray-500 mt-2">Replace with your photo</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Photo 6 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-pink-400" />
                      <p className="text-gray-600 font-medium">Photo 6</p>
                      <p className="text-sm text-gray-500 mt-2">Replace with your photo</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            {/* Wishes Section */}
            <div className="max-w-4xl mx-auto mt-16 space-y-8">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800">Send Your Wishes</h2>
              
              {/* Wish Form */}
              <Card className="bg-white/95 backdrop-blur-sm border-rose-200 shadow-xl">
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
                        className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
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
                        className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white"
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
                  <Card className="bg-white/90 backdrop-blur-sm border-rose-100">
                    <CardContent className="p-8 text-center text-gray-500">
                      No wishes yet. Be the first to send your wishes!
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {wishes.map((wish) => (
                      <Card key={wish.id} className="bg-white/90 backdrop-blur-sm border-rose-100 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                              {wish.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-800">{wish.name}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(wish.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{wish.message}</p>
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
              <Heart className="w-8 h-8 mx-auto mb-4 text-rose-400" />
              <p className="text-lg font-serif">
                We can't wait to celebrate with you!
              </p>
              <p className="mt-4 text-sm">
                Farid & Jannah
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
