'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Check,
  Clock,
  Calendar,
  Filter,
  Edit2,
  X,
  Menu,
  ChevronDown,
  Zap,
  Database,
  CheckCircle,
  Server,
  ListTodo,
  Users,
  Bell,
  Code,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react'

interface Task {
  id: number
  title: string
  due_date: string | null
  completed: number
  completed_at: string | null
  created_at: string
}

type FilterType = 'all' | 'today' | 'overdue' | 'week'

function formatDateSpanish(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

function isThisWeek(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const today = new Date()
  const weekFromNow = new Date()
  weekFromNow.setDate(today.getDate() + 7)
  return date >= today && date <= weekFromNow
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactError, setContactError] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (e) {
      console.error('Error fetching tasks:', e)
    } finally {
      setLoading(false)
    }
  }

  async function addTask() {
    if (!newTitle.trim()) return
    setSaving(true)
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, due_date: newDueDate || null })
      })
      setNewTitle('')
      setNewDueDate('')
      setShowAddModal(false)
      await fetchTasks()
    } catch (e) {
      console.error('Error adding task:', e)
    } finally {
      setSaving(false)
    }
  }

  async function toggleComplete(task: Task) {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: task.completed ? 0 : 1 })
      })
      await fetchTasks()
    } catch (e) {
      console.error('Error toggling task:', e)
    }
  }

  async function updateTask() {
    if (!editingTask || !newTitle.trim()) return
    setSaving(true)
    try {
      await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, due_date: newDueDate || null })
      })
      setEditingTask(null)
      setNewTitle('')
      setNewDueDate('')
      await fetchTasks()
    } catch (e) {
      console.error('Error updating task:', e)
    } finally {
      setSaving(false)
    }
  }

  async function deleteTask(id: number) {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      await fetchTasks()
    } catch (e) {
      console.error('Error deleting task:', e)
    }
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setContactSubmitting(true)
    setContactError(false)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CONSTRUCTOR_API}/v1/forms/${process.env.NEXT_PUBLIC_PROJECT_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      })
      if (res.ok) {
        setContactSuccess(true)
      } else {
        setContactError(true)
      }
    } catch {
      setContactError(true)
    } finally {
      setContactSubmitting(false)
    }
  }

  const pendingTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  const filteredPending = pendingTasks.filter(task => {
    switch (filter) {
      case 'today': return isToday(task.due_date)
      case 'overdue': return isOverdue(task.due_date)
      case 'week': return isThisWeek(task.due_date)
      default: return true
    }
  })

  const stats = [
    { value: '0ms', label: 'latencia en guardado', icon: Zap },
    { value: '100%', label: 'datos persistentes', icon: Database },
    { value: '50,000+', label: 'tareas completadas', icon: CheckCircle },
    { value: '99.99%', label: 'disponibilidad', icon: Server }
  ]

  const navLinks = [
    { label: 'Tareas', href: '#tasks' },
    { label: 'Funciones', href: '#features' },
    { label: 'Testimonios', href: '#testimonials' },
    { label: 'Precios', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contacto', href: '#contact' }
  ]

  const features = [
    { icon: Plus, title: 'Crear nuevas tareas', desc: 'Agrega tareas rapidamente con el boton Agregar Tarea' },
    { icon: Edit2, title: 'Editar tareas', desc: 'Modifica titulos, fechas de vencimiento y detalles' },
    { icon: Check, title: 'Marcar completadas', desc: 'Usa el checkbox para marcar tareas como terminadas' },
    { icon: Filter, title: 'Filtros inteligentes', desc: 'Filtra por Todas, Por vencer hoy, Atrasadas y Esta semana' },
    { icon: Calendar, title: 'Fechas en espanol', desc: 'Formato legible como 15 enero 2025' },
    { icon: Database, title: 'Guardado automatico', desc: 'Cambios persistentes en la nube sin configuracion' },
    { icon: Zap, title: 'Sin login requerido', desc: 'Comienza a trabajar inmediatamente al abrir la app' },
    { icon: ListTodo, title: 'Listas diferenciadas', desc: 'Separa tareas pendientes y completadas visualmente' }
  ]

  const testimonials = [
    {
      quote: 'No pierdo tiempo en configuraciones innecesarias. Entro, creo tareas, y listo.',
      name: 'Maria Gonzalez',
      role: 'Gerente de Proyectos',
      company: 'TechStart Mexico'
    },
    {
      quote: 'Perfecto para equipos agiles que necesitan algo simple y confiable.',
      name: 'Carlos Rodriguez',
      role: 'CTO',
      company: 'InnovaLab'
    },
    {
      quote: 'Mi productividad aumento porque la herramienta no me distrae.',
      name: 'Ana Lopez',
      role: 'Freelancer',
      company: 'Diseno y Desarrollo'
    }
  ]

  const pricing = [
    {
      name: 'Gratuito',
      price: '$0',
      period: '/mes',
      features: ['Hasta 50 tareas', 'Filtros basicos', 'Guardado automatico'],
      cta: 'Comenzar gratis',
      highlighted: false
    },
    {
      name: 'Profesional',
      price: '$4.99',
      period: '/mes',
      features: ['Tareas ilimitadas', 'Filtros avanzados', 'Compartir con 3 miembros', 'Recordatorios por email'],
      cta: 'Elegir Profesional',
      highlighted: true
    },
    {
      name: 'Empresa',
      price: '$14.99',
      period: '/mes',
      features: ['Tareas ilimitadas', 'Miembros ilimitados', 'Acceso API', 'Soporte prioritario', 'Branding personalizado'],
      cta: 'Contactar ventas',
      highlighted: false
    }
  ]

  const faqs = [
    {
      q: 'Necesito crear una cuenta para usar Tareas Pendientes?',
      a: 'No, puedes comenzar a crear y gestionar tareas inmediatamente sin necesidad de registrarte. Tus datos se guardan automaticamente en la nube.'
    },
    {
      q: 'Mis tareas se guardan automaticamente?',
      a: 'Si, cada cambio que realizas se guarda instantaneamente en nuestra base de datos en la nube. No perderas informacion aunque cierres el navegador.'
    },
    {
      q: 'Puedo compartir mis tareas con mi equipo?',
      a: 'Con el plan Profesional puedes compartir tareas con hasta 3 miembros. El plan Empresa ofrece miembros ilimitados.'
    },
    {
      q: 'Que pasa si excedo el limite de 50 tareas en el plan gratuito?',
      a: 'Puedes actualizar al plan Profesional en cualquier momento para obtener tareas ilimitadas y funciones adicionales.'
    },
    {
      q: 'La aplicacion funciona en dispositivos moviles?',
      a: 'Si, Tareas Pendientes tiene un diseno responsive que se adapta perfectamente a escritorio, tablet y movil.'
    }
  ]

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[var(--color-accent)] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-[var(--color-foreground)]">Tareas Pendientes</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setShowAddModal(true)} className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white">
                <Plus className="w-4 h-4 mr-1" />
                Agregar Tarea
              </Button>
              <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="md:hidden p-2 text-[var(--color-muted)]">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileNavOpen ? 'opacity-100 translate-y-0 pointer-events-auto max-h-96' : 'opacity-0 -translate-y-4 pointer-events-none max-h-0'}`}>
          <div className="px-4 py-4 bg-white border-t border-[var(--color-border)]">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="block py-2 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all"
                style={{ transitionDelay: mobileNavOpen ? `${index * 60}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero / Header */}
      <section className="bg-[var(--color-surface)] py-8 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">Gestiona tus tareas sin complicaciones</h1>
          <p className="mt-2 text-[var(--color-muted)]">Crea, organiza, y completa tus tareas. Los cambios se guardan automaticamente.</p>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white py-4 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <stat.icon className="w-5 h-5 text-[var(--color-accent)]" />
                <div>
                  <div className="font-semibold text-[var(--color-foreground)]">{stat.value}</div>
                  <div className="text-xs text-[var(--color-muted)]">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Task Dashboard */}
      <section id="tasks" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'all' as FilterType, label: 'Todas' },
              { key: 'today' as FilterType, label: 'Por vencer hoy' },
              { key: 'overdue' as FilterType, label: 'Atrasadas' },
              { key: 'week' as FilterType, label: 'Esta semana' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filter === f.key ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[var(--color-border)]'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
            {/* Pending Tasks */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">Tareas Pendientes</h2>
              {loading ? (
                <div className="text-[var(--color-muted)] py-8 text-center">Cargando tareas...</div>
              ) : filteredPending.length === 0 ? (
                <div className="text-[var(--color-muted)] py-8 text-center bg-[var(--color-surface)] rounded-lg">
                  {filter === 'all' ? 'No hay tareas pendientes. Crea una nueva tarea para comenzar.' : 'No hay tareas que coincidan con este filtro.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPending.map(task => (
                    <Card key={task.id} className="border border-[var(--color-border)] shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleComplete(task)}
                            className="mt-1 w-5 h-5 rounded border-2 border-[var(--color-accent)] flex items-center justify-center hover:bg-[var(--color-accent)] hover:bg-opacity-10 transition-colors"
                          >
                            {task.completed ? <Check className="w-3 h-3 text-[var(--color-accent)]" /> : null}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-[var(--color-foreground)]">{task.title}</h3>
                              {task.due_date && (
                                <span className="text-xs text-[var(--color-muted)] whitespace-nowrap">
                                  {formatDateSpanish(task.due_date)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`text-xs ${isOverdue(task.due_date) ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-[var(--color-pending)]'}`}>
                                {isOverdue(task.due_date) ? 'Atrasada' : 'Pendiente'}
                              </Badge>
                              <button
                                onClick={() => {
                                  setEditingTask(task)
                                  setNewTitle(task.title)
                                  setNewDueDate(task.due_date || '')
                                }}
                                className="text-xs text-[var(--color-accent)] hover:underline"
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-muted)] mb-4">Tareas Completadas</h2>
              {completedTasks.length === 0 ? (
                <div className="text-[var(--color-muted)] py-8 text-center bg-[var(--color-surface)] rounded-lg text-sm">
                  Las tareas completadas apareceran aqui.
                </div>
              ) : (
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <div key={task.id} className="p-3 bg-[var(--color-surface)] rounded-lg">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleComplete(task)}
                          className="mt-0.5 w-5 h-5 rounded bg-[var(--color-completed)] flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--color-completed)] line-through">{task.title}</p>
                          {task.completed_at && (
                            <p className="text-xs text-[var(--color-muted)] mt-1">
                              Completada: {formatDateSpanish(task.completed_at.split('T')[0])}
                            </p>
                          )}
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-[var(--color-muted)] hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-foreground)] text-center mb-12">Funciones principales</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-[var(--color-border)]">
                <feature.icon className="w-8 h-8 text-[var(--color-accent)] mb-4" />
                <h3 className="font-semibold text-[var(--color-foreground)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-foreground)] text-center mb-12">Lo que dicen nuestros usuarios</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="border border-[var(--color-border)]">
                <CardContent className="p-6">
                  <p className="text-[var(--color-foreground)] italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] bg-opacity-10 flex items-center justify-center text-[var(--color-accent)] font-semibold">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-foreground)]">{t.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">{t.role}, {t.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-foreground)] text-center mb-4">Planes y precios</h2>
          <p className="text-[var(--color-muted)] text-center mb-12">Elige el plan que mejor se adapte a tus necesidades</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <Card key={i} className={`border ${plan.highlighted ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]' : 'border-[var(--color-border)]'}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-[var(--color-foreground)]">{plan.price}</span>
                    <span className="text-[var(--color-muted)]">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
                        <Check className="w-4 h-4 text-[var(--color-accent)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => document.getElementById('tasks')?.scrollIntoView({ behavior: 'smooth' })}
                    className={`w-full ${plan.highlighted ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white' : 'bg-white border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-surface)]'}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-foreground)] text-center mb-12">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[var(--color-surface)] transition-colors"
                >
                  <span className="font-medium text-[var(--color-foreground)]">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[var(--color-muted)] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="px-6 pb-4 text-[var(--color-muted)]">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 bg-[var(--color-surface)]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-foreground)] text-center mb-4">Contactanos</h2>
          <p className="text-[var(--color-muted)] text-center mb-8">Tienes preguntas? Escribenos y te responderemos pronto.</p>
          {contactSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-700 font-medium">Mensaje enviado — te contactaremos pronto</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Nombre</label>
                <Input
                  type="text"
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Email</label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Mensaje</label>
                <Textarea
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full"
                />
              </div>
              {contactError && (
                <p className="text-red-500 text-sm">Hubo un error al enviar. Intenta de nuevo.</p>
              )}
              <Button type="submit" disabled={contactSubmitting} className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white">
                {contactSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-foreground)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-[var(--color-accent)] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">Tareas Pendientes</span>
              </div>
              <p className="text-gray-400 text-sm">Gestiona tus tareas sin complicaciones. Simple, rapido y confiable.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funciones</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#contact" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="mailto:soporte@tasktrackerpro.com" className="hover:text-white transition-colors">Email de soporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#contact" className="hover:text-white transition-colors">Terminos de uso</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Tareas Pendientes. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Nueva tarea</CardTitle>
              <button onClick={() => { setShowAddModal(false); setNewTitle(''); setNewDueDate(''); }} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Titulo</label>
                <Input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Que necesitas hacer?"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Fecha limite</label>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => { setShowAddModal(false); setNewTitle(''); setNewDueDate(''); }} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={addTask} disabled={!newTitle.trim() || saving} className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white">
                  {saving ? 'Guardando...' : 'Crear tarea'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Editar tarea</CardTitle>
              <button onClick={() => { setEditingTask(null); setNewTitle(''); setNewDueDate(''); }} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Titulo</label>
                <Input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">Fecha limite</label>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => deleteTask(editingTask.id)} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                  Eliminar
                </Button>
                <Button onClick={() => { setEditingTask(null); setNewTitle(''); setNewDueDate(''); }} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={updateTask} disabled={!newTitle.trim() || saving} className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white">
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
