'use client';
import Link from "next/link";
import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer"
import type { Token } from 'prism-react-renderer'

export default function Problem1() {
  const [n, setN] = useState(0);

  function sum_to_n_a(n: number) {
    return Array.from({ length: n }, (_, i) => i + 1).reduce((sum, num) => sum + num, 0);
  }

  function sum_to_n_b(n: number, acc: number = 0) {
    if (n === 0) return acc;
    return sum_to_n_b(n - 1, acc + n);
  }

  function sum_to_n_c(n: number) {
    function* generateNumbers(end: number) {
      for (let i = 1; i <= end; i++) {
        yield i;
      }
    }
    let sum = 0;
    for (const num of generateNumbers(n)) {
      sum += num;
    }
    return sum;
  };

  const code1 = `
function sum_to_n_a (n: number) {
      return Array.from({ length: n}, (_, i) => i + 1).reduce((sum, num) => sum + num, 0);
    }
`;

  const code2 = `
function sum_to_n_b (n: number, acc: number = 0) {
    if (n === 0) return acc;
    return sum_to_n_b(n - 1, acc + n);
}
`;

  const code3 = `
function sum_to_n_c (n: number) {
    function* generateNumbers(end: number) {
      for (let i = 1; i <= end; i++) {
        yield i;
      }
    }
    let sum = 0;
    for (const num of generateNumbers(n)) {
        sum += num;
    }
    return sum;
}
`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ← Back to home
          </Link>
          <button 
            onClick={() => setN(Math.floor(Math.random() * 100) + 1)} 
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Generate random n
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Problem 1: Sum to N</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Current n</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{n}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Method A Result</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{sum_to_n_a(n)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Method B Result</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{sum_to_n_b(n)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Method C Result</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-600">{sum_to_n_c(n)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Implementation A: Array Reduce</h2>
            <Highlight
              theme={themes.nightOwl}
              code={code1.trim()}
              language="typescript"
            >
              {({ style, tokens, getLineProps, getTokenProps }: {
                style: React.CSSProperties;
                tokens: Token[][];
                getLineProps: ({ line }: { line: Token[] }) => { key?: string; style?: React.CSSProperties };
                getTokenProps: ({ token }: { token: Token }) => { key?: string; style?: React.CSSProperties };
              }) => (
                <pre className="p-4 rounded-lg overflow-x-auto" style={style}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Implementation B: Recursive</h2>
            <Highlight
              theme={themes.nightOwl}
              code={code2.trim()}
              language="typescript"
            >
              {({ style, tokens, getLineProps, getTokenProps }: {
                style: React.CSSProperties;
                tokens: Token[][];
                getLineProps: ({ line }: { line: Token[] }) => { key?: string; style?: React.CSSProperties };
                getTokenProps: ({ token }: { token: Token }) => { key?: string; style?: React.CSSProperties };
              }) => (
                <pre className="p-4 rounded-lg overflow-x-auto" style={style}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Implementation C: Generator</h2>
            <Highlight
              theme={themes.nightOwl}
              code={code3.trim()}
              language="typescript"
            >
              {({ style, tokens, getLineProps, getTokenProps }: {
                style: React.CSSProperties;
                tokens: Token[][];
                getLineProps: ({ line }: { line: Token[] }) => { key?: string; style?: React.CSSProperties };
                getTokenProps: ({ token }: { token: Token }) => { key?: string; style?: React.CSSProperties };
              }) => (
                <pre className="p-4 rounded-lg overflow-x-auto" style={style}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      </div>
    </div>
  );
}