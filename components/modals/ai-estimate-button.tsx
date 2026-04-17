"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Loader2 } from "lucide-react"

type Estimate = {
  hours: number
  confidence: "low" | "medium" | "high"
  reasoning: string
  breakdown: { phase: string; hours: number }[]
}

const PRIORITY_MULT: Record<string, number> = {
  baixa: 0.8,
  normal: 1,
  alta: 1.2,
  critica: 1.5,
}

const KEYWORDS = [
  { words: ["motor", "mecanic", "mecanica"], hours: 16, phase: "Mecanica" },
  { words: ["soldadura", "soldar"], hours: 12, phase: "Soldadura" },
  { words: ["pintura", "pintar"], hours: 8, phase: "Pintura" },
  { words: ["electric", "electricitat", "cablejat"], hours: 10, phase: "Electricitat" },
  { words: ["hidraulic", "aigua", "canonada"], hours: 6, phase: "Hidraulica" },
  { words: ["inspeccio", "revisio", "revisar"], hours: 4, phase: "Revisio" },
  { words: ["instalacio", "instalar", "muntar"], hours: 8, phase: "Instalacio" },
  { words: ["disseny", "planol", "plan"], hours: 12, phase: "Disseny" },
  { words: ["proba", "test", "testing"], hours: 4, phase: "Proves" },
  { words: ["reparacio", "reparar", "arreglar"], hours: 6, phase: "Reparacio" },
  { words: ["documentacio", "manual"], hours: 3, phase: "Documentacio" },
  { words: ["casc", "estructura"], hours: 20, phase: "Estructura" },
  { words: ["neteja", "polir"], hours: 4, phase: "Acabats" },
]

function estimate(title: string, description: string, priority: string): Estimate {
  const text = (title + " " + description).toLowerCase()
  const breakdown: { phase: string; hours: number }[] = []
  let baseHours = 2

  KEYWORDS.forEach((k) => {
    if (k.words.some((w) => text.includes(w))) {
      breakdown.push({ phase: k.phase, hours: k.hours })
      baseHours += k.hours
    }
  })

  if (breakdown.length === 0) {
    breakdown.push({ phase: "Treball general", hours: 4 })
    baseHours = 4
  }

  // Apply complexity: length of description
  const complexity = Math.min(2, Math.max(0.8, description.length / 200))
  const priorityMult = PRIORITY_MULT[priority] || 1

  const finalHours = Math.round(baseHours * complexity * priorityMult)

  let confidence: "low" | "medium" | "high" = "medium"
  if (breakdown.length >= 2 && description.length > 50) confidence = "high"
  else if (breakdown.length === 0 || description.length < 20) confidence = "low"

  const reasoning = `L&apos;estimacio es basa en ${breakdown.length} ${breakdown.length === 1 ? "area tecnica" : "arees tecniques"} identificades${description.length > 50 ? ", la complexitat de la descripcio" : ""} i la prioritat ${priority}.`

  return { hours: finalHours, confidence, reasoning, breakdown }
}

type Props = {
  title: string
  description: string
  priority: string
  onEstimate: (hours: number) => void
}

export function AIEstimateButton({ title, description, priority, onEstimate }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Estimate | null>(null)

  const handleEstimate = () => {
    if (!title.trim()) return
    setLoading(true)
    setTimeout(() => {
      const est = estimate(title, description, priority)
      setResult(est)
      setLoading(false)
    }, 900)
  }

  const apply = () => {
    if (result) {
      onEstimate(result.hours)
      setResult(null)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleEstimate}
        disabled={loading || !title.trim()}
        className={cn(
          "flex items-center gap-2 w-full justify-center px-3 py-2 rounded-lg border text-sm font-medium transition-all",
          loading || !title.trim()
            ? "bg-muted/30 border-border text-muted-foreground cursor-not-allowed"
            : "bg-gradient-to-r from-primary/15 to-accent/15 border-primary/30 text-primary hover:from-primary/25 hover:to-accent/25"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analitzant tasca...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Suggereix estimacio amb IA
          </>
        )}
      </button>

      {result && (
        <div className="border border-primary/30 bg-primary/5 rounded-lg p-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">{result.hours}h estimades</span>
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] rounded font-medium uppercase",
                  result.confidence === "high" && "bg-success/15 text-success",
                  result.confidence === "medium" && "bg-warning/20 text-warning",
                  result.confidence === "low" && "bg-destructive/15 text-destructive"
                )}
              >
                Confian&ccedil;a {result.confidence === "high" ? "alta" : result.confidence === "medium" ? "mitja" : "baixa"}
              </span>
            </div>
            <button
              type="button"
              onClick={apply}
              className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:opacity-90"
            >
              Aplicar
            </button>
          </div>

          <div className="space-y-1">
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{b.phase}</span>
                <span className="text-foreground font-medium">{b.hours}h</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground italic border-t border-border pt-2">
            {result.reasoning}
          </p>
        </div>
      )}
    </div>
  )
}
