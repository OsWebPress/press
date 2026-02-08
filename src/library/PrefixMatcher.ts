import type TokenRegistry from './TokenRegistry';
import type { Rule } from './TokenRegistry';

class MatchResult {
  index: number;
  tag: string;
  match: string;
  body: string | null;
  size: number;
  props?: any;
}

class PrefixMatcher {
  #regex: RegExp;
  #rules: Rule[];

  constructor(registry: TokenRegistry) {
    this.#rules = registry.getSortedRules();
    this.#regex = new RegExp(`(${registry.getCombinedPattern()})`, 'g');
  }

  #pushText(results: MatchResult[], content: string, start: number, end: number): void {
    if (end <= start) return;

    const gapText = content.substring(start, end);

    if (gapText.length > 0) {
      results.push({
        index: start,
        tag: 'makedown/text', // tricky to have this dir hardcode here, we should maybe get the values from an item in the tokenRegistry instead of hardcoding it here
        match: '',
        body: gapText,
		size: gapText.length,
      });
    }
  }

  scanString(fileContent: string): MatchResult[] {
    const results: MatchResult[] = [];
    const regex = this.#regex;
    let match;
    let lastProcessedIndex = 0;

    regex.lastIndex = 0;

    while ((match = regex.exec(fileContent)) !== null) {
      this.#pushText(results, fileContent, lastProcessedIndex, match.index);

      const groupIndex = match.findIndex((val, idx) => idx > 1 && val !== undefined);
      if (groupIndex === -1) continue;

      const ruleIndex = groupIndex - 2;
      const rule = this.#rules[ruleIndex];
      if (!rule) continue;

      const remainingString = fileContent.slice(match.index);

      let size = rule.findEnd(remainingString, match[0]);
      let body: string | null = null;

      if (size <= match[0].length) {
        size = match[0].length;
      } else {
        body = rule.findBody ? rule.findBody(remainingString, size, match[0]) : null;
      }

	  // Make sure we are greedy on a newline at the end of the match
	  if (fileContent[match.index + size] === '\n') {
		size += 1;
	  }

	  let object = {
        index: match.index,
        tag: rule.tag,
        match: match[0],
        body: body,
        size: size,
        props: rule.propProcessing ? rule.propProcessing(match[0]) : undefined
      };
	  if (rule.overwriteTag) {
		object.tag = rule.overwriteTag(match[0]);
		console.log(`Overwriting tag for match: ${match[0]} to ${object.tag}`);
	  }
      results.push(object);

      regex.lastIndex = match.index + size;
      lastProcessedIndex = regex.lastIndex;
    }

    this.#pushText(results, fileContent, lastProcessedIndex, fileContent.length);

    return results;
  }
}

export default PrefixMatcher;
export type { MatchResult };
