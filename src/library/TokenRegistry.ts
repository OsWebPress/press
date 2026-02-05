interface TokenMetadata {
	tag: string;
	findEnd: (str: string, match: string) => number;
	findBody: (str: string, size: number, match: string) => string;
	overwriteTag?: (str: string) => string;
}

interface Rule extends TokenMetadata {
	patternSource: string;
	tag: string;
}

class TokenRegistry {
  #rules: Rule[] = [];

  add(pattern: string | RegExp, metadata: TokenMetadata): void {
    this.#rules.push({
		...metadata,
      patternSource: pattern instanceof RegExp ? pattern.source : this.#escape(pattern),
    });
  }

  #escape(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getSortedRules(): Rule[] {
    return [...this.#rules].sort((a, b) => b.patternSource.length - a.patternSource.length);
  }

  getCombinedPattern(): string {
    const sorted = this.getSortedRules();
    return sorted.map(r => `(${r.patternSource})`).join('|');
  }
}

export default TokenRegistry;
export type { TokenMetadata, Rule };