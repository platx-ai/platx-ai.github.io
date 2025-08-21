import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface AITierCardProps {
  tier: number;
  title: string;
  description: string;
  formula: string;
  delay?: number;
}

const AITierCard: React.FC<AITierCardProps> = ({ 
  tier, 
  title, 
  description, 
  formula, 
  delay = 0 
}) => {
  return (
    <Card 
      className="group relative border-border/20 bg-card hover:bg-card/80 transition-all duration-300 hover:border-border/40"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-8">
        <div className="mb-6">
          <span className="text-sm font-mono text-muted-foreground/60 tracking-wider">
            TIER {tier}
          </span>
        </div>

        <h3 className="text-2xl font-semibold mb-8 text-foreground">
          {title}
        </h3>

        <div className="mb-8 p-6 rounded-lg bg-muted/30 border border-border/20">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children }) => <div className="text-center text-xl">{children}</div>
            }}
          >
            {`$$${formula}$$`}
          </ReactMarkdown>
        </div>

        <p className="text-muted-foreground leading-relaxed text-base">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default AITierCard;
