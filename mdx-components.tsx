import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import { codeToHtml } from "shiki";
import React from "react";

function getCodeProps(children: React.ReactNode) {
  if (!React.isValidElement(children)) return null;
  const props = children.props as { children?: string; className?: string };
  return {
    code: typeof props.children === "string" ? props.children : null,
    lang: props.className?.replace("language-", ""),
  };
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 text-2xl font-medium text-gray-800">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 text-xl font-medium text-gray-700">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-5 leading-7 text-gray-700">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-gray-500 underline underline-offset-3 transition-colors hover:text-gray-900"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-5 ml-6 list-disc space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-5 ml-6 list-decimal space-y-2 text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-5 border-l-2 border-gray-300 pl-4 italic text-gray-500">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800">
        {children}
      </code>
    ),
    pre: async ({ children }: { children: React.ReactNode }) => {
      const codeProps = getCodeProps(children);
      if (codeProps?.code) {
        const codeString = codeProps.code;
        const lang = codeProps.lang;
        const html = await codeToHtml(codeString, {
          lang: lang || "text",
          theme: "github-dark",
        });
        return (
          <div
            className="mb-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
      return (
        <pre className="mb-5 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          {children}
        </pre>
      );
    },
    img: (props) => (
      <Image
        {...(props as ImageProps)}
        width={800}
        height={450}
        className="my-8 w-full rounded-lg shadow-sm"
        alt={props.alt || ""}
      />
    ),
    ...components,
  };
}
