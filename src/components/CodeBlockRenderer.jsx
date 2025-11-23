import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import DOMPurify from 'dompurify';
import styles from 'styles/CodeBlock.module.css';

const CodeBlockRenderer = ({ htmlContent }) => {
  const contentRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const processedRef = useRef(new Set());

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      // Failed to copy - silently ignore
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll('pre');

      codeBlocks.forEach((pre, index) => {
        const uniqueId = `code-${index}-${htmlContent.slice(0, 20)}`;

        // Skip if already processed
        if (processedRef.current.has(uniqueId)) {
          return;
        }

        processedRef.current.add(uniqueId);

        // Find or create code element
        let codeElement = pre.querySelector('code');
        if (!codeElement) {
          codeElement = document.createElement('code');
          // Preserve innerHTML to keep line breaks and formatting
          codeElement.innerHTML = pre.innerHTML;
          // eslint-disable-next-line no-param-reassign
          pre.innerHTML = '';
          pre.appendChild(codeElement);
        }

        // Add language class if not present (default to javascript)
        if (!codeElement.className || !codeElement.className.includes('language-')) {
          codeElement.className = 'language-javascript';
        }

        // Apply syntax highlighting only if language grammar exists
        try {
          const languageMatch = codeElement.className.match(/language-(\w+)/);
          const language = languageMatch ? languageMatch[1] : 'javascript';

          if (Prism.languages[language]) {
            Prism.highlightElement(codeElement);
          } else {
            // Fallback to plain styling if language not supported
            codeElement.className = 'language-none';
          }
        } catch (err) {
          // If highlighting fails, just skip it
        }

        // Wrap in container if not already wrapped
        if (!pre.parentElement || !pre.parentElement.classList.contains(styles.codeBlockWrapper)) {
          const wrapper = document.createElement('div');
          wrapper.className = styles.codeBlockWrapper;
          pre.parentNode.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);

          // Create copy button
          const copyButton = document.createElement('button');
          copyButton.className = styles.copyButton;
          copyButton.innerHTML = '📋 Copy';
          copyButton.setAttribute('data-index', index);
          copyButton.setAttribute('type', 'button');
          copyButton.onclick = () => handleCopy(codeElement.textContent, index);

          wrapper.appendChild(copyButton);
        }
      });

      // Handle inline code
      const inlineCodes = contentRef.current.querySelectorAll('code:not(pre code)');
      inlineCodes.forEach((code) => {
        if (!code.classList.contains(styles.inlineCode)) {
          code.classList.add(styles.inlineCode);
        }
      });
    }
  }, [htmlContent]);

  useEffect(() => {
    if (contentRef.current && copiedIndex !== null) {
      const button = contentRef.current.querySelector(`[data-index="${copiedIndex}"]`);
      if (button) {
        button.innerHTML = '✅ Copied!';
        button.classList.add(styles.copied);
        setTimeout(() => {
          button.innerHTML = '📋 Copy';
          button.classList.remove(styles.copied);
        }, 2000);
      }
    }
  }, [copiedIndex]);

  return (
    <div
      ref={contentRef}
      className={styles.content}
      /* eslint-disable-next-line react/no-danger */
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
    />
  );
};

CodeBlockRenderer.propTypes = {
  htmlContent: PropTypes.string.isRequired,
};

export default CodeBlockRenderer;
