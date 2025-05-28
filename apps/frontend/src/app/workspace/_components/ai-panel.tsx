'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  Code,
  AlertCircle,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Shield,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { AiAnalysis, AiTip } from '../types'

type Props = {
  aiAnalysis: AiAnalysis | undefined
  isLoading: boolean
}

type TipCategory = 'optimization' | 'security'

interface CategorizedTip extends AiTip {
  category: TipCategory
}

const categorizeTip = (tip: AiTip): CategorizedTip => {
  const title = tip.title.toLowerCase()
  const description = tip.description.toLowerCase()

  const securityKeywords = [
    'security',
    'authentication',
    'authorization',
    'rate limiting',
    'rate limit',
    'ddos',
    'denial-of-service',
    'attack',
    'vulnerability',
    'encryption',
    'ssl',
    'tls',
    'https',
    'token',
    'jwt',
    'oauth',
    'cors',
    'xss',
    'csrf',
    'injection',
    'sanitize',
    'validation',
    'firewall',
    'protect',
    'abuse',
    'malicious',
    'threat',
    'secure',
    'privacy',
  ]
  const isSecurityTip = securityKeywords.some(
    (keyword) => title.includes(keyword) || description.includes(keyword)
  )

  return {
    ...tip,
    category: isSecurityTip ? 'security' : 'optimization',
  }
}

const tipTypes = {
  optimization: {
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
  },
  security: {
    icon: Shield,
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
  },
}

export const AIPanel = ({ aiAnalysis, isLoading }: Props) => {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const categorizedTips: CategorizedTip[] =
    aiAnalysis?.aiTips?.map(categorizeTip) || []
  const optimizationTips = categorizedTips.filter(
    (tip) => tip.category === 'optimization'
  )
  const securityTips = categorizedTips.filter(
    (tip) => tip.category === 'security'
  )

  const renderTipCard = (
    tip: CategorizedTip,
    index: number,
    prefix: string
  ) => {
    const { icon: Icon, color, bg, border } = tipTypes[tip.category]

    return (
      <Card key={index} className={`${border} overflow-hidden`}>
        <CardHeader className={`pb-2 ${bg}`}>
          <CardTitle className="text-base flex items-center gap-2">
            <Icon size={16} className={color} />
            {tip.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
            {tip.description}
          </p>
          {tip.codeSnippet && (
            <div className="relative">
              <pre className="text-xs bg-zinc-800 text-zinc-100 p-3 rounded-md overflow-x-auto">
                {tip.codeSnippet}
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-6 w-6 bg-zinc-700 hover:bg-zinc-600"
                onClick={() =>
                  handleCopy(`${prefix}-${index}`, tip.codeSnippet || '')
                }
              >
                {copied === `${prefix}-${index}` ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} className="text-zinc-300" />
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">AI Suggestions</h2>
          <RefreshCw className="animate-spin h-5 w-5 text-primary" />
        </div>
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!aiAnalysis) {
    return (
      <div className="p-6 space-y-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">AI Suggestions</h2>
        </div>
        <Card className="border-dashed border-gray-300 dark:border-gray-700">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No AI analysis available
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">AI Suggestions</h2>
      </div>

      <Card className="border-primary/10">
        <CardHeader className="pb-2 bg-primary/5 rounded-t-lg">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            API Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {aiAnalysis.summary}
            {aiAnalysis.summary === 'Initial request created' &&
              '. You need to request 5 times to get an AI analysis.'}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Suggestions</TabsTrigger>
          <TabsTrigger value="optimization">
            Optimization
            <Badge
              variant="secondary"
              className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            >
              {optimizationTips.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="security">
            Security
            <Badge
              variant="secondary"
              className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
            >
              {securityTips.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[400px] pr-4">
          <TabsContent value="all" className="space-y-4 mt-0">
            {categorizedTips.map((tip, index) =>
              renderTipCard(tip, index, 'all')
            )}
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4 mt-0">
            {optimizationTips.map((tip, index) =>
              renderTipCard(tip, index, 'opt')
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-0">
            {securityTips.map((tip, index) => renderTipCard(tip, index, 'sec'))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
