"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Heart, Users, MessageCircle, Shield, Lightbulb, Target } from "lucide-react"
import { saveParentAssessmentResponse, type ParentAssessmentResponse } from "@/lib/save-responses"

type Answer = "A" | "B" | null
type Answers = Record<number, Answer>

interface Question {
  id: number
  pillar: string
  text: string
  optionA: string
  optionB: string
  correctAnswer: "A" | "B" // Which option gives the point (better answer)
}

interface DimensionResult {
  name: string
  score: number
  level: "Rendah" | "Tinggi"
  description: string
}

interface CoupleType {
  name: string
  description: string
  characteristics: string[]
  strengths: string[]
  challenges: string[]
}

export default function Assessment() {
  const [currentPage, setCurrentPage] = useState<number>(0) // 0 = intro, 1-12 = question pages, 13 = results
  const [answers, setAnswers] = useState<Answers>({})
  const [showResults, setShowResults] = useState<boolean>(false)
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null)

  const pillars = [
    { name: "Kesejahteraan Pribadi", icon: <Heart className="h-5 w-5" />, color: "text-red-500" },
    { name: "Kekompakan Pasangan", icon: <Users className="h-5 w-5" />, color: "text-blue-500" },
    { name: "Filosofi Pengasuhan", icon: <Lightbulb className="h-5 w-5" />, color: "text-yellow-500" },
    { name: "Lingkungan Keluarga", icon: <Shield className="h-5 w-5" />, color: "text-green-500" },
    { name: "Keintiman Hubungan", icon: <MessageCircle className="h-5 w-5" />, color: "text-purple-500" },
    { name: "Visi Bersama", icon: <Target className="h-5 w-5" />, color: "text-indigo-500" },
  ]

  // Questions with scoring logic - B is generally the better answer for most questions
  const questions: Question[] = [
    // Pilar 1: Kesejahteraan Pribadi (Questions 1-10)
    {
      id: 1,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika Anda merasa stres dengan pekerjaan dan tanggung jawab sebagai orang tua, apa yang biasanya Anda lakukan?",
      optionA: "Saya mencoba menyelesaikan semua tugas sendiri dan tidak ingin membebani orang lain",
      optionB: "Saya mencari bantuan dari pasangan atau keluarga untuk berbagi beban",
      correctAnswer: "B",
    },
    {
      id: 2,
      pillar: "Kesejahteraan Pribadi",
      text: "Bagaimana Anda mengelola waktu untuk diri sendiri di tengah kesibukan mengurus keluarga?",
      optionA: "Saya merasa egois jika mengambil waktu untuk diri sendiri",
      optionB: "Saya percaya bahwa merawat diri sendiri penting untuk menjadi orang tua yang baik",
      correctAnswer: "B",
    },
    {
      id: 3,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika Anda menghadapi masalah emosional, bagaimana cara Anda mengatasinya?",
      optionA: "Saya cenderung menyimpan perasaan untuk diri sendiri",
      optionB: "Saya terbuka berbagi perasaan dengan orang terdekat",
      correctAnswer: "B",
    },
    {
      id: 4,
      pillar: "Kesejahteraan Pribadi",
      text: "Bagaimana Anda memandang pentingnya hobi atau minat pribadi?",
      optionA: "Hobi adalah hal yang bisa ditunda demi keluarga",
      optionB: "Hobi membantu saya menjadi pribadi yang lebih seimbang",
      correctAnswer: "B",
    },
    {
      id: 5,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika merasa lelah secara fisik dan mental, apa prioritas utama Anda?",
      optionA: "Tetap menjalankan semua tanggung jawab meski lelah",
      optionB: "Mengambil waktu istirahat yang diperlukan",
      correctAnswer: "B",
    },
    {
      id: 6,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika di restoran dengan menu yang belum pernah kamu coba sebelumnya. Apa yang kamu pilih?",
      optionA: "Aku memilih sesuatu yang baru, tanpa meminta saran",
      optionB: "Aku menyanyakan rekomendasi kepada pelayan atau teman",
      correctAnswer: "B",
    },
    {
      id: 7,
      pillar: "Kesejahteraan Pribadi",
      text: "Saat kamu memasuki ruangan penuh dengan orang yang belum pernah kamu temui, bagaimana kamu biasanya merespons?",
      optionA: "Aku bersikap untuk mendekati orang lain, menyapa mereka dan memulai pembicaraan dengan mudah",
      optionB:
        "Aku cenderung mencari tempat duduk dan menunggu orang lain mendekati, terlalu malu untuk memulai percakapan",
      correctAnswer: "A",
    },
    {
      id: 8,
      pillar: "Kesejahteraan Pribadi",
      text: "Ketika berbicara di depan umum, bagaimana sikap tubuhmu?",
      optionA: "Aku berdiri dengan percaya diri saat orang lain memperhatikanku",
      optionB: "Aku sering kali mengerakkan badan",
      correctAnswer: "A",
    },
    {
      id: 9,
      pillar: "Kesejahteraan Pribadi",
      text: "Dalam sebuah diskusi kelompok, bagaimana kamu menunjukkan keterlibatan?",
      optionA: "Aku cenderung diam dan hanya mengiluti arus diskusinya",
      optionB: "Aku mengungkap jika setuju dan sesekali menyampaikan pendapat dengan suara yang jelas",
      correctAnswer: "B",
    },
    {
      id: 10,
      pillar: "Kesejahteraan Pribadi",
      text: "Saat berada di acara sosial, bagaimana kamu biasanya berdiri atau duduk di sekitar orang lain?",
      optionA: "Aku berdiri atau duduk dengan nyaman, aku juga mudah terlibat dalam percakapan dengan orang lain",
      optionB: "Aku seringkali duduk untuk menuhui diri dari orang lain",
      correctAnswer: "A",
    },

    // Pilar 2: Kekompakan Pasangan (Questions 11-20)
    {
      id: 11,
      pillar: "Kekompakan Pasangan",
      text: "Ketika Anda dan pasangan memiliki perbedaan pendapat tentang cara mendidik anak, bagaimana Anda menyelesaikannya?",
      optionA: "Kami berdiskusi secara pribadi dan mencari solusi bersama",
      optionB: "Salah satu dari kami biasanya mengalah untuk menghindari konflik",
      correctAnswer: "A",
    },
    {
      id: 12,
      pillar: "Kekompakan Pasangan",
      text: "Bagaimana Anda dan pasangan membagi tanggung jawab dalam mengurus rumah tangga?",
      optionA: "Kami memiliki pembagian tugas yang jelas dan konsisten",
      optionB: "Kami fleksibel dan saling membantu sesuai kebutuhan",
      correctAnswer: "B",
    },
    {
      id: 13,
      pillar: "Kekompakan Pasangan",
      text: "Ketika salah satu dari Anda sedang menghadapi masalah, bagaimana dukungan diberikan?",
      optionA: "Kami memberikan ruang untuk menyelesaikan masalah sendiri",
      optionB: "Kami aktif mendengarkan dan memberikan dukungan emosional",
      correctAnswer: "B",
    },
    {
      id: 14,
      pillar: "Kekompakan Pasangan",
      text: "Bagaimana Anda menangani situasi ketika anak mencoba mengadu domba orang tua?",
      optionA: "Kami langsung mengklarifikasi dan menunjukkan kesatuan",
      optionB: "Kami mendengarkan anak terlebih dahulu sebelum merespons",
      correctAnswer: "A",
    },
    {
      id: 15,
      pillar: "Kekompakan Pasangan",
      text: "Dalam hal pengambilan keputusan penting untuk keluarga, bagaimana prosesnya?",
      optionA: "Salah satu dari kami biasanya memimpin dalam pengambilan keputusan",
      optionB: "Kami selalu memutuskan bersama dengan konsensus",
      correctAnswer: "B",
    },
    {
      id: 16,
      pillar: "Kekompakan Pasangan",
      text: "Ketika ada perbedaan gaya komunikasi antara Anda dan pasangan, bagaimana mengatasinya?",
      optionA: "Kami berusaha menyesuaikan gaya komunikasi satu sama lain",
      optionB: "Kami menerima perbedaan dan mencari cara untuk saling memahami",
      correctAnswer: "B",
    },
    {
      id: 17,
      pillar: "Kekompakan Pasangan",
      text: "Bagaimana Anda menunjukkan apresiasi terhadap pasangan di depan anak-anak?",
      optionA: "Kami menunjukkan apresiasi melalui tindakan sehari-hari",
      optionB: "Kami secara verbal mengungkapkan rasa terima kasih dan pujian",
      correctAnswer: "B",
    },
    {
      id: 18,
      pillar: "Kekompakan Pasangan",
      text: "Ketika menghadapi tekanan dari keluarga besar, bagaimana Anda dan pasangan merespons?",
      optionA: "Kami memprioritaskan keharmonisan dengan keluarga besar",
      optionB: "Kami memprioritaskan kesepakatan internal keluarga inti",
      correctAnswer: "B",
    },
    {
      id: 19,
      pillar: "Kekompakan Pasangan",
      text: "Ketika menghadapi waktu berdua tanpa anak-anak?",
      optionA: "Kami jarang memiliki waktu khusus berdua",
      optionB: "Kami secara rutin menyediakan waktu untuk hubungan kami",
      correctAnswer: "B",
    },
    {
      id: 20,
      pillar: "Kekompakan Pasangan",
      text: "Dalam situasi krisis atau darurat keluarga, bagaimana Anda bekerja sama?",
      optionA: "Kami secara otomatis tahu peran masing-masing",
      optionB: "Kami berkomunikasi intensif untuk koordinasi",
      correctAnswer: "B",
    },

    // Pilar 3: Filosofi Pengasuhan (Questions 21-30)
    {
      id: 21,
      pillar: "Filosofi Pengasuhan",
      text: "Bagaimana Anda memandang peran disiplin dalam pengasuhan?",
      optionA: "Disiplin harus tegas dan konsisten untuk membentuk karakter anak",
      optionB: "Disiplin harus disesuaikan dengan kepribadian dan kebutuhan masing-masing anak",
      correctAnswer: "B",
    },
    {
      id: 22,
      pillar: "Filosofi Pengasuhan",
      text: "Ketika anak melakukan kesalahan, pendekatan apa yang Anda gunakan?",
      optionA: "Memberikan konsekuensi langsung agar anak belajar",
      optionB: "Berdiskusi dengan anak untuk memahami alasan dan mencari solusi bersama",
      correctAnswer: "B",
    },
    {
      id: 23,
      pillar: "Filosofi Pengasuhan",
      text: "Bagaimana Anda mengajarkan nilai-nilai kepada anak?",
      optionA: "Melalui aturan yang jelas dan contoh langsung",
      optionB: "Melalui cerita, diskusi, dan pengalaman sehari-hari",
      correctAnswer: "B",
    },
    {
      id: 24,
      pillar: "Filosofi Pengasuhan",
      text: "Dalam mengembangkan kemandirian anak, apa yang Anda prioritaskan?",
      optionA: "Mengajarkan tanggung jawab melalui tugas-tugas yang harus diselesaikan",
      optionB: "Memberikan pilihan dan membiarkan anak belajar dari pengalaman",
      correctAnswer: "B",
    },
    {
      id: 25,
      pillar: "Filosofi Pengasuhan",
      text: "Bagaimana Anda menangani emosi negatif anak (marah, sedih, frustrasi)?",
      optionA: "Mengalihkan perhatian anak atau menenangkan dengan cepat",
      optionB: "Memvalidasi perasaan anak dan membantu mereka memahami emosinya",
      correctAnswer: "B",
    },
    {
      id: 26,
      pillar: "Filosofi Pengasuhan",
      text: "Dalam hal prestasi akademik anak, apa fokus utama Anda?",
      optionA: "Hasil yang baik dan pencapaian target yang ditetapkan",
      optionB: "Proses belajar dan perkembangan minat anak",
      correctAnswer: "B",
    },
    {
      id: 27,
      pillar: "Filosofi Pengasuhan",
      text: "Bagaimana Anda mempersiapkan anak menghadapi kegagalan?",
      optionA: "Melindungi anak dari situasi yang berpotensi gagal",
      optionB: "Mengajarkan anak bahwa kegagalan adalah bagian dari pembelajaran",
      correctAnswer: "B",
    },
    {
      id: 28,
      pillar: "Filosofi Pengasuhan",
      text: "Dalam mengajarkan sopan santun, pendekatan apa yang Anda gunakan?",
      optionA: "Menetapkan aturan sopan santun yang harus diikuti",
      optionB: "Menjelaskan alasan di balik sopan santun dan memberikan contoh",
      correctAnswer: "B",
    },
    {
      id: 29,
      pillar: "Filosofi Pengasuhan",
      text: "Bagaimana Anda menangani konflik antar saudara?",
      optionA: "Menjadi penengah dan menentukan siapa yang benar atau salah",
      optionB: "Memfasilitasi mereka untuk menyelesaikan konflik sendiri",
      correctAnswer: "B",
    },
    {
      id: 30,
      pillar: "Filosofi Pengasuhan",
      text: "Dalam mengembangkan kreativitas anak, apa yang Anda lakukan?",
      optionA: "Menyediakan aktivitas terstruktur yang mengembangkan keterampilan",
      optionB: "Memberikan kebebasan bereksplorasi dan bereksperimen",
      correctAnswer: "B",
    },

    // Pilar 4: Lingkungan Keluarga (Questions 31-40)
    {
      id: 31,
      pillar: "Lingkungan Keluarga",
      text: "Bagaimana suasana rumah yang Anda ciptakan untuk keluarga?",
      optionA: "Teratur, tenang, dan memiliki rutinitas yang jelas",
      optionB: "Hangat, terbuka, dan fleksibel sesuai kebutuhan keluarga",
      correctAnswer: "B",
    },
    {
      id: 32,
      pillar: "Lingkungan Keluarga",
      text: "Dalam hal aturan rumah, bagaimana Anda menetapkannya?",
      optionA: "Aturan dibuat oleh orang tua dan harus dipatuhi semua anggota keluarga",
      optionB: "Aturan dibuat bersama dan dapat didiskusikan jika ada yang perlu diubah",
      correctAnswer: "B",
    },
    {
      id: 33,
      pillar: "Lingkungan Keluarga",
      text: "Bagaimana Anda menangani perbedaan pendapat dalam keluarga?",
      optionA: "Keputusan akhir ada di tangan orang tua sebagai kepala keluarga",
      optionB: "Semua pendapat didengar dan dicari solusi yang dapat diterima bersama",
      correctAnswer: "B",
    },
    {
      id: 34,
      pillar: "Lingkungan Keluarga",
      text: "Dalam mengatur waktu keluarga, apa prioritas Anda?",
      optionA: "Memastikan semua kegiatan terjadwal dengan baik",
      optionB: "Menyeimbangkan waktu terstruktur dengan waktu spontan bersama",
      correctAnswer: "B",
    },
    {
      id: 35,
      pillar: "Lingkungan Keluarga",
      text: "Bagaimana Anda menangani tamu atau kegiatan sosial di rumah?",
      optionA: "Mengatur dengan rapi dan memastikan rumah selalu siap menerima tamu",
      optionB: "Menyambut dengan hangat dan tidak terlalu khawatir dengan kesempurnaan",
      correctAnswer: "B",
    },
    {
      id: 36,
      pillar: "Lingkungan Keluarga",
      text: "Dalam hal teknologi dan media di rumah, bagaimana aturan Anda?",
      optionA: "Ada batasan waktu dan aturan ketat tentang penggunaan teknologi",
      optionB: "Aturan fleksibel dengan fokus pada penggunaan yang bertanggung jawab",
      correctAnswer: "B",
    },
    {
      id: 37,
      pillar: "Lingkungan Keluarga",
      text: "Bagaimana Anda menciptakan tradisi keluarga?",
      optionA: "Mempertahankan tradisi yang sudah ada dan memastikan konsistensi",
      optionB: "Menciptakan tradisi baru yang sesuai dengan kepribadian keluarga",
      correctAnswer: "B",
    },
    {
      id: 38,
      pillar: "Lingkungan Keluarga",
      text: "Dalam mengatur ruang pribadi anak, apa pendekatan Anda?",
      optionA: "Memastikan kamar anak rapi dan terorganisir sesuai standar",
      optionB: "Memberikan kebebasan anak menata ruang sesuai keinginan mereka",
      correctAnswer: "B",
    },
    {
      id: 39,
      pillar: "Lingkungan Keluarga",
      text: "Bagaimana Anda menangani masalah keuangan keluarga di depan anak?",
      optionA: "Tidak membahas masalah keuangan untuk melindungi anak dari kekhawatiran",
      optionB: "Menjelaskan secara sederhana dan melibatkan anak dalam solusi yang sesuai usia",
      correctAnswer: "B",
    },
    {
      id: 40,
      pillar: "Lingkungan Keluarga",
      text: "Dalam menciptakan suasana belajar di rumah, apa yang Anda lakukan?",
      optionA: "Menyediakan ruang belajar khusus dengan jadwal belajar yang teratur",
      optionB: "Menciptakan lingkungan yang mendukung rasa ingin tahu dan eksplorasi",
      correctAnswer: "B",
    },

    // Pilar 5: Keintiman Hubungan (Questions 41-50)
    {
      id: 41,
      pillar: "Keintiman Hubungan",
      text: "Bagaimana Anda mengekspresikan kasih sayang kepada anak?",
      optionA: "Melalui tindakan nyata seperti menyiapkan kebutuhan dan melindungi",
      optionB: "Melalui kata-kata, pelukan, dan waktu berkualitas bersama",
      correctAnswer: "B",
    },
    {
      id: 42,
      pillar: "Keintiman Hubungan",
      text: "Ketika anak bercerita tentang masalahnya, bagaimana respons Anda?",
      optionA: "Langsung memberikan solusi dan nasihat untuk menyelesaikan masalah",
      optionB: "Mendengarkan dengan penuh perhatian dan bertanya untuk memahami perasaannya",
      correctAnswer: "B",
    },
    {
      id: 43,
      pillar: "Keintiman Hubungan",
      text: "Dalam membangun kepercayaan dengan anak, apa yang Anda prioritaskan?",
      optionA: "Konsistensi dalam aturan dan janji yang diberikan",
      optionB: "Keterbukaan dalam komunikasi dan penerimaan tanpa syarat",
      correctAnswer: "B",
    },
    {
      id: 44,
      pillar: "Keintiman Hubungan",
      text: "Bagaimana Anda menangani rahasia atau privasi anak?",
      optionA: "Anak harus terbuka kepada orang tua dan tidak boleh menyimpan rahasia",
      optionB: "Menghormati privasi anak sambil tetap tersedia jika mereka butuh bicara",
      correctAnswer: "B",
    },
    {
      id: 45,
      pillar: "Keintiman Hubungan",
      text: "Dalam menghabiskan waktu berkualitas dengan anak, apa fokus Anda?",
      optionA: "Melakukan aktivitas yang bermanfaat untuk perkembangan anak",
      optionB: "Melakukan aktivitas yang dinikmati bersama tanpa agenda khusus",
      correctAnswer: "B",
    },
    {
      id: 46,
      pillar: "Keintiman Hubungan",
      text: "Bagaimana Anda merespons ketika anak mengungkapkan ketakutan atau kekhawatiran?",
      optionA: "Meyakinkan anak bahwa tidak ada yang perlu ditakutkan",
      optionB: "Memvalidasi perasaan anak dan membantu mereka menghadapi ketakutan",
      correctAnswer: "B",
    },
    {
      id: 47,
      pillar: "Keintiman Hubungan",
      text: "Dalam berbagi pengalaman pribadi dengan anak, bagaimana pendekatan Anda?",
      optionA: "Menjaga batas antara orang tua dan anak dengan tidak terlalu personal",
      optionB: "Berbagi pengalaman yang sesuai untuk membangun kedekatan dan pembelajaran",
      correctAnswer: "B",
    },
    {
      id: 48,
      pillar: "Keintiman Hubungan",
      text: "Bagaimana Anda menunjukkan bahwa Anda bangga dengan anak?",
      optionA: "Memuji pencapaian dan prestasi yang berhasil diraih anak",
      optionB: "Mengekspresikan kebanggaan atas usaha dan karakter anak",
      correctAnswer: "B",
    },
    {
      id: 49,
      pillar: "Keintiman Hubungan",
      text: "Dalam menghadapi fase perkembangan anak yang sulit, apa yang Anda lakukan?",
      optionA: "Tetap konsisten dengan aturan dan menunggu fase ini berlalu",
      optionB: "Beradaptasi dengan kebutuhan anak dan memberikan dukungan ekstra",
      correctAnswer: "B",
    },
    {
      id: 50,
      pillar: "Keintiman Hubungan",
      text: "Bagaimana Anda membangun komunikasi yang terbuka dengan anak remaja?",
      optionA: "Menetapkan waktu khusus untuk bicara dan membahas hal-hal penting",
      optionB: "Menciptakan suasana santai dimana anak merasa nyaman berbagi kapan saja",
      correctAnswer: "B",
    },

    // Pilar 6: Visi Bersama (Questions 51-60)
    {
      id: 51,
      pillar: "Visi Bersama",
      text: "Bagaimana Anda dan pasangan menyelaraskan tujuan pengasuhan?",
      optionA: "Salah satu memimpin dalam menentukan arah pengasuhan keluarga",
      optionB: "Berdiskusi secara rutin untuk memastikan visi yang sama",
      correctAnswer: "B",
    },
    {
      id: 52,
      pillar: "Visi Bersama",
      text: "Dalam merencanakan masa depan anak, apa yang Anda prioritaskan?",
      optionA: "Mempersiapkan anak untuk mencapai kesuksesan yang telah ditetapkan",
      optionB: "Membantu anak menemukan dan mengembangkan potensi unik mereka",
      correctAnswer: "B",
    },
    {
      id: 53,
      pillar: "Visi Bersama",
      text: "Bagaimana Anda menangani perbedaan nilai dengan pasangan dalam pengasuhan?",
      optionA: "Mencari kompromi atau mengikuti nilai yang lebih dominan",
      optionB: "Mendiskusikan secara mendalam untuk menemukan nilai bersama yang baru",
      correctAnswer: "B",
    },
    {
      id: 54,
      pillar: "Visi Bersama",
      text: "Dalam mengajarkan nilai-nilai keluarga kepada anak, bagaimana caranya?",
      optionA: "Menetapkan nilai-nilai yang harus dianut dan dipatuhi anak",
      optionB: "Melibatkan anak dalam diskusi tentang nilai-nilai dan maknanya",
      correctAnswer: "B",
    },
    {
      id: 55,
      pillar: "Visi Bersama",
      text: "Bagaimana Anda mempersiapkan anak untuk menjadi bagian dari masyarakat?",
      optionA: "Mengajarkan aturan dan norma sosial yang harus diikuti",
      optionB: "Mengembangkan empati dan kemampuan beradaptasi dengan lingkungan",
      correctAnswer: "B",
    },
    {
      id: 56,
      pillar: "Visi Bersama",
      text: "Bagaimana Anda mempersiapkan anak untuk menjadi bagian dari masyarakat?",
      optionA: "Memberikan stabilitas finansial dan materi untuk masa depan",
      optionB: "Menanamkan karakter dan nilai-nilai yang akan membimbing hidup mereka",
      correctAnswer: "B",
    },
    {
      id: 57,
      pillar: "Visi Bersama",
      text: "Bagaimana Anda mengukur keberhasilan sebagai orang tua?",
      optionA: "Melihat pencapaian dan prestasi yang diraih anak",
      optionB: "Melihat kebahagiaan dan kesejahteraan emosional anak",
      correctAnswer: "B",
    },
    {
      id: 58,
      pillar: "Visi Bersama",
      text: "Dalam menghadapi perubahan zaman, bagaimana Anda menyesuaikan pengasuhan?",
      optionA: "Mempertahankan nilai-nilai tradisional yang sudah terbukti baik",
      optionB: "Mengadaptasi pendekatan pengasuhan dengan perkembangan zaman",
      correctAnswer: "B",
    },
    {
      id: 59,
      pillar: "Visi Bersama",
      text: "Bagaimana Anda melibatkan anak dalam perencanaan keluarga?",
      optionA: "Anak mengikuti rencana yang sudah dibuat orang tua",
      optionB: "Anak dilibatkan dalam diskusi dan perencanaan sesuai usia mereka",
      correctAnswer: "B",
    },
    {
      id: 60,
      pillar: "Visi Bersama",
      text: "Dalam membangun legacy keluarga, apa yang paling penting bagi Anda?",
      optionA: "Menciptakan reputasi keluarga yang baik di mata masyarakat",
      optionB: "Membangun hubungan keluarga yang kuat dan saling mendukung",
      correctAnswer: "B",
    },
  ]

  // Couple Types Definition (8 types based on 3 dimensions)
  const coupleTypes: Record<string, CoupleType> = {
    RRR: {
      name: "The Struggling Survivors",
      description: "Pasangan yang sedang menghadapi tantangan besar dalam berbagai aspek hubungan",
      characteristics: [
        "Komunikasi internal yang terbatas",
        "Sumber daya dan resiliensi yang rendah",
        "Kurang memiliki visi dan perencanaan yang jelas",
      ],
      strengths: [
        "Masih bertahan bersama meski menghadapi kesulitan",
        "Memiliki potensi untuk berkembang dengan dukungan yang tepat",
      ],
      challenges: [
        "Perlu fokus pada perbaikan komunikasi dasar",
        "Membutuhkan strategi manajemen stres yang efektif",
        "Perlu mengembangkan visi bersama untuk masa depan",
      ],
    },
    RRT: {
      name: "The Visionary Dreamers",
      description: "Pasangan yang memiliki visi kuat namun terbatas dalam eksekusi dan sumber daya",
      characteristics: [
        "Memiliki visi dan rencana yang jelas untuk keluarga",
        "Terbatas dalam komunikasi dan keintiman",
        "Kapasitas untuk menghadapi tekanan masih rendah",
      ],
      strengths: ["Visi yang kuat untuk masa depan keluarga", "Kemampuan perencanaan yang baik"],
      challenges: [
        "Perlu memperkuat fondasi hubungan internal",
        "Membutuhkan peningkatan kapasitas dan resiliensi",
        "Perlu menjembatani gap antara visi dan realitas",
      ],
    },
    RTR: {
      name: "The Resilient Reactors",
      description: "Pasangan yang kuat dalam menghadapi tekanan namun kurang dalam perencanaan strategis",
      characteristics: [
        "Mampu bertahan dalam situasi sulit",
        "Komunikasi internal yang terbatas",
        "Cenderung reaktif daripada proaktif",
      ],
      strengths: ["Resiliensi tinggi dalam menghadapi krisis", "Kemampuan adaptasi yang baik"],
      challenges: [
        "Perlu mengembangkan komunikasi yang lebih dalam",
        "Membutuhkan visi jangka panjang yang lebih jelas",
        "Perlu beralih dari reaktif ke proaktif",
      ],
    },
    RTT: {
      name: "The Strategic Builders",
      description: "Pasangan yang memiliki resiliensi dan visi kuat namun perlu memperbaiki dinamika internal",
      characteristics: [
        "Kapasitas tinggi dalam menghadapi tantangan",
        "Visi dan perencanaan yang matang",
        "Komunikasi internal yang perlu diperkuat",
      ],
      strengths: ["Kombinasi resiliensi dan visi yang kuat", "Kemampuan perencanaan jangka panjang yang baik"],
      challenges: [
        "Fokus pada peningkatan kualitas hubungan internal",
        "Perlu menyeimbangkan pencapaian dengan keintiman",
        "Mengoptimalkan komunikasi untuk hasil yang lebih baik",
      ],
    },
    TRR: {
      name: "The Connected Strugglers",
      description: "Pasangan dengan hubungan internal yang kuat namun terbatas dalam sumber daya dan visi",
      characteristics: [
        "Komunikasi dan keintiman yang baik",
        "Terbatas dalam menghadapi tekanan eksternal",
        "Kurang memiliki perencanaan strategis",
      ],
      strengths: ["Fondasi hubungan yang solid", "Komunikasi dan empati yang baik"],
      challenges: [
        "Perlu meningkatkan kapasitas menghadapi stres",
        "Membutuhkan pengembangan visi jangka panjang",
        "Perlu memperkuat sumber daya eksternal",
      ],
    },
    TRT: {
      name: "The Intimate Planners",
      description: "Pasangan dengan hubungan internal dan visi yang kuat namun perlu meningkatkan resiliensi",
      characteristics: [
        "Komunikasi dan keintiman yang excellent",
        "Visi dan perencanaan yang matang",
        "Perlu memperkuat kapasitas menghadapi tekanan",
      ],
      strengths: ["Hubungan internal yang sangat kuat", "Perencanaan dan visi yang jelas"],
      challenges: [
        "Perlu meningkatkan resiliensi terhadap stres",
        "Membutuhkan strategi coping yang lebih baik",
        "Perlu memperkuat support system eksternal",
      ],
    },
    TTR: {
      name: "The Resilient Partners",
      description: "Pasangan yang kuat dalam hubungan dan resiliensi namun perlu mengembangkan visi jangka panjang",
      characteristics: [
        "Hubungan internal yang sangat solid",
        "Resiliensi tinggi dalam menghadapi tantangan",
        "Cenderung fokus pada present daripada future planning",
      ],
      strengths: ["Kombinasi hubungan kuat dan resiliensi tinggi", "Kemampuan mengatasi krisis dengan baik"],
      challenges: [
        "Perlu mengembangkan visi jangka panjang",
        "Membutuhkan perencanaan strategis yang lebih baik",
        "Perlu menyeimbangkan present dan future focus",
      ],
    },
    TTT: {
      name: "The Thriving Architects",
      description: "Pasangan yang unggul dalam semua aspek - hubungan internal, resiliensi, dan visi strategis",
      characteristics: [
        "Komunikasi dan keintiman yang excellent",
        "Resiliensi tinggi dalam menghadapi tantangan",
        "Visi dan perencanaan strategis yang matang",
      ],
      strengths: [
        "Model ideal untuk hubungan keluarga yang sehat",
        "Kemampuan mengoptimalkan semua aspek kehidupan keluarga",
        "Menjadi inspirasi bagi pasangan lain",
      ],
      challenges: [
        "Mempertahankan standar tinggi secara konsisten",
        "Berbagi pengalaman dan mentoring pasangan lain",
        "Terus berinovasi dan berkembang",
      ],
    },
  }

  const handleAnswerChange = (questionId: number, value: Answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const getCurrentPageQuestions = () => {
    if (currentPage === 0 || currentPage > 12) return []
    const startIndex = (currentPage - 1) * 5
    return questions.slice(startIndex, startIndex + 5)
  }

  const getCurrentPillarTitle = () => {
    if (currentPage === 0 || currentPage > 12) return ""
    const pageQuestions = getCurrentPageQuestions()
    if (pageQuestions.length > 0) {
      const pillarName = pageQuestions[0].pillar
      return `Pertanyaan ${pillarName}`
    }
    return ""
  }

  const areAllCurrentQuestionsAnswered = () => {
    const pageQuestions = getCurrentPageQuestions()
    return pageQuestions.every((q) => answers[q.id] !== null && answers[q.id] !== undefined)
  }

  const calculatePillarScores = () => {
    const scores: Record<string, number> = {}

    // Initialize scores for each pillar
    pillars.forEach((pillar) => {
      scores[pillar.name] = 0
    })

    // Calculate scores based on correct answers
    questions.forEach((question) => {
      const userAnswer = answers[question.id]
      if (userAnswer === question.correctAnswer) {
        scores[question.pillar] += 1
      }
    })

    return scores
  }

  const calculateDimensions = (pillarScores: Record<string, number>): DimensionResult[] => {
    // Convert pillar scores to percentages (0-100)
    const pillarPercentages = {
      "Kesejahteraan Pribadi": (pillarScores["Kesejahteraan Pribadi"] / 10) * 100,
      "Kekompakan Pasangan": (pillarScores["Kekompakan Pasangan"] / 10) * 100,
      "Filosofi Pengasuhan": (pillarScores["Filosofi Pengasuhan"] / 10) * 100,
      "Lingkungan Keluarga": (pillarScores["Lingkungan Keluarga"] / 10) * 100,
      "Keintiman Hubungan": (pillarScores["Keintiman Hubungan"] / 10) * 100,
      "Visi Bersama": (pillarScores["Visi Bersama"] / 10) * 100,
    }

    // Dimensi 1: KEMITRAAN INTERNAL
    // Formula: (Skor P2 * 50%) + (Skor P5 * 40%) + (Skor P3 * 10%)
    const kemitraanInternal =
      pillarPercentages["Kekompakan Pasangan"] * 0.5 +
      pillarPercentages["Keintiman Hubungan"] * 0.4 +
      pillarPercentages["Filosofi Pengasuhan"] * 0.1

    // Dimensi 2: KAPASITAS & RESILIENSI
    // Formula: ((100 - Skor P1) * 45%) + (Skor P4 * 45%) + (Skor P3 * 10%)
    const kapasitasResilensi =
      (100 - pillarPercentages["Kesejahteraan Pribadi"]) * 0.45 +
      pillarPercentages["Lingkungan Keluarga"] * 0.45 +
      pillarPercentages["Filosofi Pengasuhan"] * 0.1

    // Dimensi 3: INTENSIONALITAS & VISI
    // Formula: (Skor P6 * 75%) + (Skor P3 * 25%)
    const intensionalitasVisi =
      pillarPercentages["Visi Bersama"] * 0.75 + pillarPercentages["Filosofi Pengasuhan"] * 0.25

    return [
      {
        name: "Kekompakan Pasangan",
        score: Math.round(kemitraanInternal),
        level: kemitraanInternal >= 50 ? "Tinggi" : "Rendah",
        description: "Mengukur kesehatan interaksi internal pasangan",
      },
      {
        name: "Ketahanan Hubungan",
        score: Math.round(kapasitasResilensi),
        level: kapasitasResilensi >= 50 ? "Tinggi" : "Rendah",
        description: "Mengukur total sumber daya keluarga untuk menghadapi tekanan",
      },
      {
        name: "Arah Tujuan Keluarga",
        score: Math.round(intensionalitasVisi),
        level: intensionalitasVisi >= 50 ? "Tinggi" : "Rendah",
        description: "Mengukur tingkat kesadaran dan perencanaan proaktif keluarga",
      },
    ]
  }

  const getCoupleType = (dimensions: DimensionResult[]): CoupleType => {
    // Create type key based on dimension levels (T = Tinggi, R = Rendah)
    const typeKey = dimensions.map((d) => (d.level === "Tinggi" ? "T" : "R")).join("")
    return coupleTypes[typeKey] || coupleTypes["RRR"] // fallback to default
  }

  const handleNext = async () => {
    if (currentPage === 0) {
      setCurrentPage(1)
      // Use setTimeout to ensure state update happens first
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 100)
    } else if (currentPage < 12) {
      if (areAllCurrentQuestionsAnswered()) {
        setCurrentPage(currentPage + 1)
        // Use setTimeout to ensure state update happens first
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }, 100)
      }
    } else if (currentPage === 12) {
      if (areAllCurrentQuestionsAnswered()) {
        // Calculate results and save to database
        const pillarScores = calculatePillarScores()
        const dimensions = calculateDimensions(pillarScores)
        const coupleType = getCoupleType(dimensions)

        const responseData: ParentAssessmentResponse = {
          timestamp: new Date().toISOString(),
          answers: answers as Record<number, "A" | "B">,
          pillarScores,
          overallResult: coupleType.name,
        }

        try {
          const saveResult = await saveParentAssessmentResponse(responseData)
          setSaveStatus(saveResult)
        } catch (error) {
          setSaveStatus({ success: false, message: "Failed to save response" })
        }

        setShowResults(true)
        setCurrentPage(13)
        // Use setTimeout to ensure state update happens first
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }, 100)
      }
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      // Use setTimeout to ensure state update happens first
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 100)
    }
  }

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="/images/ollifant-bebe-logo.png" alt="OllieFam" className="h-8 w-auto" />
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">OllieFam Assessment</CardTitle>
            <CardDescription className="text-sm text-gray-600">Assessment Hubungan Keluarga</CardDescription>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <span>Mulai Tes</span>
          <span>Panduan Penggunaan</span>
          <span>Metodologi</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            Profil
          </Button>
        </div>
      </div>
    </div>
  )

  const renderIntro = () => (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <div className="max-w-5xl mx-auto py-8 md:py-16 px-4">
        {/* Main Title */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 md:mb-8">Kenali Pola Hubungan Anda</h1>

          {/* Blue subtitle box */}
          <div className="bg-blue-600 text-white rounded-3xl px-6 md:px-12 py-4 md:py-6 mx-auto max-w-4xl mb-8 md:mb-12">
            <p className="text-base md:text-lg leading-relaxed">
              Jawab 48 pertanyaan sederhana yang terdiri dari 6 pilar assessment untuk menemukan pola hubungan kamu
              dengan pasanganmu
            </p>
          </div>
        </div>

        {/* 6 Pilar Assessment Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6 md:mb-8">6 Pilar Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {pillars.map((pillar, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl p-4 md:p-6 flex items-center gap-3 md:gap-4">
                <span className={`${pillar.color} flex-shrink-0`}>{pillar.icon}</span>
                <span className="text-sm md:text-base font-medium text-gray-700">{pillar.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blue info box */}
        <div className="bg-blue-600 text-white rounded-3xl px-6 md:px-12 py-6 md:py-8 mx-auto max-w-4xl mb-8 md:mb-12">
          <ul className="space-y-3 md:space-y-4">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
              <span className="text-base md:text-lg">Waktu pengerjaan tes sekitar 10 - 15 menit</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
              <span className="text-base md:text-lg">Pilih opsi A atau B untuk setiap pertanyaan</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
              <span className="text-base md:text-lg">Perlu diingat bahwa tidak ada jawaban yang salah</span>
            </li>
          </ul>
        </div>

        {/* Tips section and image */}
        <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-12 max-w-6xl mx-auto mb-8 md:mb-12">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
              Cara Mendapatkan Hasil Terbaik dari Assessment
            </h3>
            <ol className="space-y-3 md:space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-gray-800 flex-shrink-0">1.</span>
                <span className="text-base md:text-lg">Jawablah dengan jujur, bukan seperti yang diharapkan</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-gray-800 flex-shrink-0">2.</span>
                <span className="text-base md:text-lg">
                  Pilih jawaban yang paling sesuai dengan realita kondisi hubungan
                </span>
              </li>
            </ol>
          </div>

          {/* Family illustration */}
          <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
            <div className="w-64 md:w-80 lg:w-96">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W1mDh7LmjuA0xNthPYtwaWZkH1NXGB.png"
                alt="Happy Family Illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Centered Mulai Tes Button */}
        <div className="text-center">
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl rounded-2xl font-semibold"
          >
            Mulai Tes
          </Button>
        </div>
      </div>
    </div>
  )

  const renderQuestionPage = () => {
    const pageQuestions = getCurrentPageQuestions()
    const pillarTitle = getCurrentPillarTitle()

    return (
      <div className="min-h-screen bg-blue-50">
        {renderHeader()}
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/images/ollifant-bebe-logo.png" alt="OllieFam" className="h-12 w-auto" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">OllieFam Assessment</h1>
              <p className="text-gray-600">Assessment Hubungan Keluarga</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / 12) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">Step {currentPage} of 12</p>
        </div>

        <Card className="border-gray-200 shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-8">
              {pageQuestions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Question {(currentPage - 1) * 5 + index + 1}</h3>
                  <p className="text-gray-700 leading-relaxed">{question.text}</p>

                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value as Answer)}
                    className="space-y-3"
                  >
                    <div
                      className={`flex items-start space-x-3 cursor-pointer transform transition-all duration-300 ease-out ${
                        answers[question.id] !== "A" ? "hover:scale-[1.02]" : ""
                      }`}
                      onClick={() => handleAnswerChange(question.id, "A")}
                    >
                      <div
                        className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all duration-300 flex-1 ${
                          answers[question.id] === "A"
                            ? "border-blue-500 bg-blue-100 shadow-lg ring-2 ring-blue-300 ring-opacity-50"
                            : "border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                        }`}
                      >
                        <RadioGroupItem
                          value="A"
                          id={`question-${question.id}-A`}
                          className={`${answers[question.id] === "A" ? "text-blue-600 border-blue-600" : "text-blue-600"}`}
                        />
                        <Label htmlFor={`question-${question.id}-A`} className="cursor-pointer flex-1">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                                answers[question.id] === "A" ? "bg-blue-600 shadow-lg scale-110" : "bg-blue-500"
                              }`}
                            >
                              A
                            </div>
                            <div
                              className={`transition-all duration-300 ${
                                answers[question.id] === "A" ? "text-blue-800 font-medium" : "text-gray-700"
                              }`}
                            >
                              {question.optionA}
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div
                      className={`flex items-start space-x-3 cursor-pointer transform transition-all duration-300 ease-out ${
                        answers[question.id] !== "B" ? "hover:scale-[1.02]" : ""
                      }`}
                      onClick={() => handleAnswerChange(question.id, "B")}
                    >
                      <div
                        className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all duration-300 flex-1 ${
                          answers[question.id] === "B"
                            ? "border-blue-500 bg-blue-100 shadow-lg ring-2 ring-blue-300 ring-opacity-50"
                            : "border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                        }`}
                      >
                        <RadioGroupItem
                          value="B"
                          id={`question-${question.id}-B`}
                          className={`${answers[question.id] === "B" ? "text-blue-600 border-blue-600" : "text-blue-600"}`}
                        />
                        <Label htmlFor={`question-${question.id}-B`} className="cursor-pointer flex-1">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                                answers[question.id] === "B" ? "bg-blue-600 shadow-lg scale-110" : "bg-blue-500"
                              }`}
                            >
                              B
                            </div>
                            <div
                              className={`transition-all duration-300 ${
                                answers[question.id] === "B" ? "text-blue-800 font-medium" : "text-gray-700"
                              }`}
                            >
                              {question.optionB}
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-8 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-transparent"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!areAllCurrentQuestionsAnswered()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {currentPage === 12 ? "Lihat Hasil" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const renderResults = () => {
    const pillarScores = calculatePillarScores()
    const dimensions = calculateDimensions(pillarScores)
    const coupleType = getCoupleType(dimensions)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {renderHeader()}
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Main Results Card */}
          <Card className="border-0 shadow-2xl bg-white rounded-3xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/images/ollifant-bebe-logo.png" alt="OllieFam" className="h-12 w-auto" />
                  <div>
                    <h1 className="text-2xl font-bold">OllieFam Assessment</h1>
                    <p className="text-blue-100">Hasil Analisis Hubungan Keluarga</p>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              {/* Couple Type Result */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-2 rounded-full mb-4">
                  <span className="text-2xl">🎯</span>
                  <span className="font-semibold text-gray-700">Tipe Pasangan Anda</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">{coupleType.name}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{coupleType.description}</p>
              </div>

              {/* Three Dimensions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {dimensions.map((dimension, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">{dimension.name}</h4>
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - dimension.score / 100)}`}
                            className={dimension.level === "Tinggi" ? "text-green-500" : "text-orange-500"}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-800">{dimension.score}%</span>
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          dimension.level === "Tinggi" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        <span>{dimension.level === "Tinggi" ? "✅" : "⚠️"}</span>
                        {dimension.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pillar Scores */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">📊 Skor Detail Berdasarkan Pilar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pillars.map((pillar) => {
                    const score = pillarScores[pillar.name]
                    const percentage = (score / 10) * 100

                    return (
                      <div key={pillar.name} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={pillar.color}>{pillar.icon}</span>
                            <h4 className="font-semibold text-gray-800">{pillar.name}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-800">{score}/10</div>
                            <div className="text-xs text-gray-500">
                              {score >= 9 ? "Sangat Baik" : score >= 6 ? "Baik" : "Perlu Perbaikan"}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Insights Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">🎯</span> Karakteristik
                  </h4>
                  <ul className="space-y-2">
                    {coupleType.characteristics.map((char, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1 text-xs">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">💪</span> Kekuatan
                  </h4>
                  <ul className="space-y-2">
                    {coupleType.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1 text-xs">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl">
                  <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">🚀</span> Area Pengembangan
                  </h4>
                  <ul className="space-y-2">
                    {coupleType.challenges.slice(0, 3).map((challenge, index) => (
                      <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                        <span className="text-orange-500 mt-1 text-xs">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-lg font-bold text-gray-800 mb-2">💡 Langkah Selanjutnya</h3>
                <p className="text-gray-600 mb-4">
                  Bagikan hasil ini dengan pasangan Anda dan diskusikan bersama untuk memperkuat hubungan keluarga.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setCurrentPage(0)
                      setShowResults(false)
                      setSaveStatus(null)
                      setAnswers({})
                    }}
                    variant="outline"
                    className="px-6 py-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Ulangi Assessment
                  </Button>
                  <Button
                    onClick={() => {
                      // Add share functionality here
                      if (navigator.share) {
                        navigator.share({
                          title: "Hasil Assessment OllieFam",
                          text: `Saya adalah tipe pasangan "${coupleType.name}" menurut OllieFam Assessment!`,
                          url: window.location.href,
                        })
                      }
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  >
                    📱 Bagikan Hasil
                  </Button>
                </div>
              </div>

              {saveStatus && (
                <div
                  className={`mt-6 p-4 rounded-xl border ${
                    saveStatus.success
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <p className="text-sm text-center">
                    {saveStatus.success ? "✅ Respons berhasil disimpan" : "⚠️ " + saveStatus.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>© 2024 OllieFam Assessment - Assessment Hubungan Keluarga</p>
          </div>
        </div>
      </div>
    )
  }

  return <div>{showResults ? renderResults() : currentPage === 0 ? renderIntro() : renderQuestionPage()}</div>
}
