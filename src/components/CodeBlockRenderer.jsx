import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DOMPurify from 'dompurify';
import styles from 'styles/CodeBlock.module.css';

const CodeBlockRenderer = ({ htmlContent }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const parsedContent = useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = DOMPurify.sanitize(htmlContent);

    const parts = [];
    const children = Array.from(tempDiv.childNodes);

    children.forEach((node, index) => {
      if (node.nodeName === 'PRE') {
        // Convert <br> tags to newlines before extracting text
        const preClone = node.cloneNode(true);
        const brTags = preClone.querySelectorAll('br');
        brTags.forEach((br) => {
          br.replaceWith('\n');
        });

        const codeElement = preClone.querySelector('code');
        const codeText = codeElement ? codeElement.textContent : preClone.textContent;

        // Detect language
        let language = 'text';
        if (codeText.includes('def ') || codeText.includes('import ') || codeText.includes('print(')) {
          language = 'python';
        } else if (codeText.includes('//') && (codeText.includes('int ') || codeText.includes('void ') || codeText.includes('#include'))) {
          language = 'cpp';
        } else if (codeText.includes('function') || codeText.includes('const ') || codeText.includes('let ') || codeText.includes('=>')) {
          language = 'javascript';
        } else if (codeText.match(/^\s*#!/) || codeText.includes('echo ') || codeText.includes('export ') || codeText.includes('source ')) {
          language = 'bash';
        }

        parts.push({
          type: 'code',
          content: codeText,
          language,
          key: `code-${index}`,
        });
      } else if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        const html = node.outerHTML || node.textContent;
        if (html && html.trim()) {
          parts.push({
            type: 'html',
            content: html,
            key: `html-${index}`,
          });
        }
      }
    });

    return parts;
  }, [htmlContent]);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      // Failed to copy
    }
  };

  return (
    <div className={styles.content}>
      {parsedContent.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={part.key} className={styles.codeBlockWrapper}>
              <button
                type="button"
                className={`${styles.copyButton} ${copiedIndex === index ? styles.copied : ''}`}
                onClick={() => handleCopy(part.content, index)}
              >
                {copiedIndex === index ? '✅ Copied!' : '📋 Copy'}
              </button>
              <SyntaxHighlighter
                language={part.language}
                style={vs}
                customStyle={{
                  background: '#f5f7fa',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e1e4e8',
                  margin: 0,
                  fontSize: '13px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre',
                  overflowX: 'auto',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
                    whiteSpace: 'pre',
                  },
                }}
                PreTag="pre"
                useInlineStyles
              >
                {part.content}
              </SyntaxHighlighter>
            </div>
          );
        }
        return (
          <span
            key={part.key}
            /* eslint-disable-next-line react/no-danger */
            dangerouslySetInnerHTML={{ __html: part.content }}
          />
        );
      })}
    </div>
  );
};

CodeBlockRenderer.propTypes = {
  htmlContent: PropTypes.string.isRequired,
};

export default CodeBlockRenderer;
