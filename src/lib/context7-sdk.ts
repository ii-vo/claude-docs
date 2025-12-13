/**
 * Context7 SDK Wrapper
 *
 * Wraps the @upstash/context7-sdk with our internal interface.
 */

import { Context7 } from '@upstash/context7-sdk';
import type {
  SearchResult as UpstashSearchResult,
  SearchLibraryResponse,
  CodeDocsResponse,
  CodeSnippet
} from '@upstash/context7-sdk';

// Re-export types matching our internal interface
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  branch: string;
  totalSnippets: number;
  stars?: number;
}

export interface Documentation {
  id: string;
  title: string;
  content: string;
  snippets: CodeSnippet[];
  totalTokens: number;
}

export interface Context7Config {
  apiKey?: string;
}

export class Context7SDK {
  private client: Context7;

  constructor(config: Context7Config) {
    this.client = new Context7({ apiKey: config.apiKey });
  }

  async searchLibrary(query: string): Promise<SearchResult[]> {
    const response: SearchLibraryResponse = await this.client.searchLibrary(query);

    return response.results.map((r: UpstashSearchResult) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      branch: r.branch,
      totalSnippets: r.totalSnippets,
      stars: r.stars
    }));
  }

  async getDocs(libraryId: string, options?: { topic?: string; limit?: number }): Promise<Documentation> {
    const response: CodeDocsResponse = await this.client.getDocs(libraryId, {
      mode: 'code',
      format: 'json',
      topic: options?.topic,
      limit: options?.limit ?? 10
    });

    // Build content from code snippets
    const contentParts: string[] = [];
    for (const snippet of response.snippets) {
      contentParts.push(`## ${snippet.codeTitle}`);
      if (snippet.codeDescription) {
        contentParts.push('');
        contentParts.push(snippet.codeDescription);
      }
      for (const example of snippet.codeList) {
        contentParts.push('');
        contentParts.push(`\`\`\`${example.language}`);
        contentParts.push(example.code);
        contentParts.push('```');
      }
      contentParts.push('');
    }

    return {
      id: libraryId,
      title: `Documentation: ${libraryId}`,
      content: contentParts.join('\n'),
      snippets: response.snippets,
      totalTokens: response.totalTokens
    };
  }
}
