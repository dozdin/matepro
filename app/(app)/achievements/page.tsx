"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  Trophy,
  Flame,
  Zap,
  Award,
  CheckCircle2,
  Anchor,
  Sunrise,
  Users,
  Medal,
  Crown,
  Target,
  Lock,
  TrendingUp,
} from "lucide-react"

const ICON_MAP: Record<string, React.ReactNode> = {
  "check-circle": <CheckCircle2 className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  award: <Award className="h-6 w-6" />,
  flame: <Flame className="h-6 w-6" />,
  trophy: <Trophy className="h-6 w-6" />,
  anchor: <Anchor className="h-6 w-6" />,
  sunrise: <Sunrise className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
}

const CURRENT_USER_ID = "user_marc"

export default function AchievementsPage() {
  const users = useAppStore((s) => s.users)
  const achievements = useAppStore((s) => s.achievements)
  const tasks = useAppStore((s) => s.tasks)

  // Current user - in a real app, would come from session
  const me = useMemo(
    () => users.find((u) => u.id === CURRENT_USER_ID) || users[0],
    [users]
  )

  const ranking = useMemo(() => {
    return [...users]
      .filter((u) => u.status === "active")
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
  }, [users])

  const myRank = useMemo(() => {
    if (!me) return 0
    return ranking.findIndex((u) => u.id === me.id) + 1
  }, [ranking, me])

  const myStats = useMemo(() => {
    if (!me) return null
    const completed = tasks.filter(
      (t) => t.assigneeId === me.id && t.status === "completat"
    ).length
    const inProgress = tasks.filter(
      (t) => t.assigneeId === me.id && t.status === "en_curs"
    ).length
    return { completed, inProgress }
  }, [me, tasks])

  const unlocked = me?.achievements ?? []
  const nextLevel = Math.ceil(((me?.points ?? 0) + 1) / 500) * 500
  const currentLevel = Math.floor((me?.points ?? 0) / 500) + 1
  const levelProgress = Math.round((((me?.points ?? 0) % 500) / 500) * 100)

  if (!me) {
    return <div className="text-muted-foreground">Carregant...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assoliments</h1>
        <p className="text-muted-foreground mt-1">La teva progressio i ranking del equip</p>
      </div>

      {/* My Progress Card */}
      <div className="bg-gradient-to-br from-primary/20 via-card to-card border border-primary/30 rounded-2xl p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10">
          <Trophy className="h-48 w-48 text-primary" />
        </div>
        <div className="relative grid md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {me.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{me.roleLabel}</div>
              <div className="text-xl font-bold text-foreground">{me.name}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-primary">
                <Crown className="h-3.5 w-3.5" />
                Nivell {currentLevel}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progres al nivell {currentLevel + 1}</span>
              <span className="text-foreground font-semibold">
                {me.points} / {nextLevel} pts
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {nextLevel - (me.points ?? 0)} punts mes per pujar de nivell
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-10 w-10 mx-auto rounded-lg bg-accent/20 mb-1">
                <Flame className="h-5 w-5 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">{me.streak ?? 0}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Ratxa</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-10 w-10 mx-auto rounded-lg bg-primary/20 mb-1">
                <Medal className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">#{myRank}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Rank</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-10 w-10 mx-auto rounded-lg bg-success/15 mb-1">
                <Trophy className="h-5 w-5 text-success" />
              </div>
              <div className="text-2xl font-bold text-foreground">{unlocked.length}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Assolits</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Achievements grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Tots els assoliments
            <span className="text-sm font-normal text-muted-foreground">
              ({unlocked.length}/{achievements.length})
            </span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {achievements.map((ach) => {
              const isUnlocked = unlocked.includes(ach.id)
              return (
                <div
                  key={ach.id}
                  className={cn(
                    "border rounded-xl p-4 transition-all",
                    isUnlocked
                      ? "bg-card border-primary/30 hover:border-primary/50"
                      : "bg-card/50 border-border opacity-60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl",
                        isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isUnlocked ? ICON_MAP[ach.icon] || <Trophy className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{ach.name}</h3>
                        <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent font-semibold">
                          +{ach.points}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{ach.description}</p>
                      {isUnlocked && (
                        <div className="mt-2 text-xs text-success flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Desbloquejat
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Ranking */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Ranking
          </h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {ranking.map((u, i) => (
              <div
                key={u.id}
                className={cn(
                  "flex items-center gap-3 p-3 border-b border-border last:border-b-0",
                  u.id === me.id && "bg-primary/10"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 border",
                    i === 0 && "bg-warning/20 text-warning border-warning/40",
                    i === 1 && "bg-muted text-foreground border-border",
                    i === 2 && "bg-[color:var(--chart-4)]/20 text-[color:var(--chart-4)] border-[color:var(--chart-4)]/40",
                    i > 2 && "bg-muted text-muted-foreground border-transparent"
                  )}
                >
                  {i + 1}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground flex-shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{u.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {(u.streak ?? 0) > 0 && (
                      <span className="flex items-center gap-0.5 text-accent">
                        <Flame className="h-3 w-3" />
                        {u.streak}
                      </span>
                    )}
                    <span>{(u.achievements ?? []).length} badges</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">{u.points ?? 0}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
              </div>
            ))}
          </div>

          {myStats && (
            <div className="mt-4 bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Les teves estadistiques</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tasques completades</span>
                  <span className="font-semibold text-foreground">{myStats.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">En curs</span>
                  <span className="font-semibold text-foreground">{myStats.inProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Punts totals</span>
                  <span className="font-semibold text-primary">{me.points ?? 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
