import { Button } from "@/components/ui/button"
import { ArrowRight, Users, MessageCircle, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-50">
          Welcome to <span className="text-blue-600 dark:text-blue-500">ChatSync</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          A real-time multi-user messaging platform. Connect with multiple users, create group chats, and experience
          seamless real-time communication.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multi-User Support</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Chat with multiple users simultaneously with individual sessions
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
            <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-time Messaging</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Instant message delivery with live user presence indicators
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
            <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fast & Responsive</h3>
            <p className="text-slate-600 dark:text-slate-300">Built with Next.js and optimized for performance</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
