import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TestSectionSectionProps {
  className?: string;
}

export const TestSectionSection: React.FC<TestSectionSectionProps> = ({ className = '' }) => {
  return (
    <section id="test-section" className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Test Section
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Welcome to the Test Section section. This is a placeholder that you can customize.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Feature 1</h3>
                <p className="text-muted-foreground">
                  Add your first feature description here.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Feature 2</h3>
                <p className="text-muted-foreground">
                  Add your second feature description here.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Feature 3</h3>
                <p className="text-muted-foreground">
                  Add your third feature description here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestSectionSection;
