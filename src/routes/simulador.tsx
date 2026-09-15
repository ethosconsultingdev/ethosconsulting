import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

// This page is a personalised, purely interactive lead-magnet quiz: the
// result depends entirely on what the visitor clicks, there is nothing here
// worth crawling for SEO, and there is no data to fetch. That combination
// is exactly when `ssr: false` earns its keep — the server skips rendering
// (and would skip `loader`/`beforeLoad` too, if this route had them) and
// ships a lightweight shell instead, while `/` and `/contacto` stay fully
// server-rendered for indexing and fast first paint. Selective SSR lets
// that choice be made per route without changing how the rest of the app
// works.
export const Route = createFileRoute('/simulador')({
  ssr: false,
  head: () => ({
    meta: [{ title: 'Diagnóstico rápido — ETHOS CONSULTING' }],
  }),
  component: SimuladorPage,
})

interface Question {
  id: string
  prompt: string
  options: { label: string; points: 0 | 1 | 2 | 3 }[]
}

const questions: Question[] = [
  {
    id: 'criterios',
    prompt: 'Como são escolhidos os fornecedores atualmente?',
    options: [
      { label: 'Por hábito ou relação pessoal', points: 0 },
      { label: 'Por preço, sem outros critérios', points: 1 },
      { label: 'Por preço e prazo de entrega', points: 2 },
      {
        label: 'Por critérios formais de custo, risco e desempenho',
        points: 3,
      },
    ],
  },
  {
    id: 'auditoria',
    prompt:
      'Quando foi a última auditoria independente aos processos de compras?',
    options: [
      { label: 'Nunca houve', points: 0 },
      { label: 'Há mais de 2 anos', points: 1 },
      { label: 'No último ano', points: 2 },
      { label: 'É feita regularmente', points: 3 },
    ],
  },
  {
    id: 'stock',
    prompt:
      'Com que frequência há rupturas de stock ou atrasos na cadeia de abastecimento?',
    options: [
      { label: 'Frequentemente, e o motivo raramente é claro', points: 0 },
      { label: 'Ocasionalmente', points: 1 },
      { label: 'Raramente', points: 2 },
      { label: 'Quase nunca — há visibilidade sobre a cadeia', points: 3 },
    ],
  },
  {
    id: 'esg',
    prompt: 'Os critérios ESG estão presentes na escolha de fornecedores?',
    options: [
      { label: 'Não existem critérios ESG', points: 0 },
      { label: 'Existem no papel, não na prática', points: 1 },
      { label: 'Aplicam-se a alguns contratos', points: 2 },
      { label: 'Aplicam-se de forma consistente', points: 3 },
    ],
  },
]

const maxScore = questions.length * 3

function resultFor(score: number) {
  const ratio = score / maxScore
  if (ratio < 0.34) {
    return {
      tier: 'Risco elevado',
      text: 'Os processos de compras e fornecedores dependem sobretudo de hábito, não de critério. Um diagnóstico de Auditoria de Procurement é o ponto de partida mais útil.',
    }
  }
  if (ratio < 0.67) {
    return {
      tier: 'Em construção',
      text: 'Já existem alguns critérios, mas de forma inconsistente. Procurement Estratégico e Gestão de Fornecedores ajudariam a tornar isso sistemático.',
    }
  }
  return {
    tier: 'Maturidade sólida',
    text: 'Os fundamentos estão presentes. Vale a pena aprofundar ESG e Supply Chain para consolidar a vantagem competitiva.',
  }
}

function SimuladorPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const answeredAll = questions.every((q) => q.id in answers)
  const score = Object.values(answers).reduce((sum, n) => sum + n, 0)

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">
        Diagnóstico rápido
      </h1>
      <p className="mt-3 text-slate-600">
        Quatro perguntas para uma primeira leitura da maturidade dos seus
        processos de compras, fornecedores e ESG. Não substitui uma auditoria —
        é só um ponto de partida.
      </p>

      <div className="mt-8 space-y-8">
        {questions.map((q) => (
          <fieldset key={q.id}>
            <legend className="font-medium text-slate-900">{q.prompt}</legend>
            <div className="mt-3 space-y-2">
              {q.options.map((option) => (
                <label
                  key={option.label}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 p-3 text-sm text-slate-700 hover:border-slate-300"
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === option.points}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: option.points }))
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {answeredAll ? (
        <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            {resultFor(score).tier}
          </p>
          <p className="mt-2 text-slate-700">{resultFor(score).text}</p>
          <Link
            to="/contacto"
            className="mt-4 inline-block rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Marcar conversa de diagnóstico
          </Link>
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-400">
          Responda a todas as perguntas para ver o resultado.
        </p>
      )}
    </section>
  )
}
