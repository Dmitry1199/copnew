"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dumbbell, Eye, EyeOff, Mail, Lock, User, Loader2, Check } from "lucide-react"

export default function SignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [agreeToMarketing, setAgreeToMarketing] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signup, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Будь ласка, заповніть всі поля")
      return false
    }

    if (password !== confirmPassword) {
      setError("Паролі не співпадають")
      return false
    }

    if (password.length < 6) {
      setError("Пароль має містити щонайменше 6 символів")
      return false
    }

    if (!agreeToTerms) {
      setError("Необхідно погодитися з умовами використання")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Введіть дійсний email адрес")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const success = await signup(firstName, lastName, email, password)
      if (success) {
        router.push('/')
      } else {
        setError("Виникла помилка при реєстрації. Спробуйте ще раз.")
      }
    } catch (err) {
      setError("Виникла помилка. Спробуйте ще раз.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: "" }
    if (password.length < 6) return { strength: 1, label: "Слабкий", color: "bg-red-500" }
    if (password.length < 10) return { strength: 2, label: "Середній", color: "bg-yellow-500" }
    return { strength: 3, label: "Надійний", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-10 w-10 text-green-600" />
            <h1 className="text-3xl font-bold text-slate-900">TrainerPro</h1>
          </div>
          <p className="text-slate-600">
            Створіть ваш аккаунт тренера
          </p>
        </div>

        {/* Signup Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Реєстрація</CardTitle>
            <CardDescription className="text-center">
              Заповніть форму для створення аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ім'я</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Олексій"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Прізвище</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Тренеренко"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email адреса</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="trainer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Мінімум 6 символів"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password Strength */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 w-full rounded ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600">
                      Надійність паролю: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Підтвердження паролю</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Повторіть пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-1">
                    {password === confirmPassword ? (
                      <>
                        <Check className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Паролі співпадають</span>
                      </>
                    ) : (
                      <span className="text-xs text-red-600">Паролі не співпадають</span>
                    )}
                  </div>
                )}
              </div>

              {/* Terms and Marketing */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    disabled={isSubmitting}
                    className="mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    Я погоджуюся з{" "}
                    <Link href="/terms" className="text-green-600 hover:text-green-500">
                      умовами використання
                    </Link>{" "}
                    та{" "}
                    <Link href="/privacy" className="text-green-600 hover:text-green-500">
                      політикою конфіденційності
                    </Link>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={agreeToMarketing}
                    onCheckedChange={(checked) => setAgreeToMarketing(checked as boolean)}
                    disabled={isSubmitting}
                    className="mt-0.5"
                  />
                  <Label htmlFor="marketing" className="text-sm">
                    Хочу отримувати новини та пропозиції від TrainerPro
                  </Label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Створення аккаунта...
                  </>
                ) : (
                  "Створити аккаунт"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                Вже маєте аккаунт?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-500 font-medium"
                >
                  Увійти
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center text-xs text-slate-500">
          <p>© 2024 TrainerPro. Професійна платформа для тренерів.</p>
        </div>
      </div>
    </div>
  )
}
