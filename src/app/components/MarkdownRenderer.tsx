'use client';

import React from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = React.useState('');

  React.useEffect(() => {
    const processMarkdown = async () => {
      try {
        const processedContent = await remark()
          .use(remarkHtml, { sanitize: false })
          .process(content);
        
        setHtmlContent(processedContent.toString());
      } catch (error) {
        console.error('Error processing markdown:', error);
        setHtmlContent(content);
      }
    };

    processMarkdown();
  }, [content]);

  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
