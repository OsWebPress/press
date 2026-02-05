import TokenRegistry from '@/library/TokenRegistry';

// Helper: Extracts everything after the match until the specified size
const getBodyAfterMatch = (str: string, match: string, size: number): string => {
  return str.substring(match.length, size).trim();
};

// Helper: Finds the end of the current line
const getEndOfLine = (str: string): number => {
  const nextNewline = str.indexOf('\n');
  return nextNewline;
};

const registry = new TokenRegistry();

// 1. Line Rules (Shared logic for Headers, Lists, Blockquotes)
const lineRule = {
  findEnd: (str: string) => getEndOfLine(str),
  findBody: (str: string, size: number, match: string) => getBodyAfterMatch(str, match, size)
};

// Register Headers
registry.add("# ",     { tag: "h1", ...lineRule });
registry.add("## ",    { tag: "h2", ...lineRule });
registry.add("### ",   { tag: "h3", ...lineRule });
registry.add("#### ",  { tag: "h4", ...lineRule });
registry.add("##### ", { tag: "h5", ...lineRule });
registry.add("###### ", { tag: "h6", ...lineRule });

// Register Lists & Formatting
registry.add(/[-*+] /,       { tag: "unordered_list", ...lineRule });
registry.add(/\d+\. /,       { tag: "ordered_list", ...lineRule });
registry.add("> ",           { tag: "blockquote", ...lineRule });
registry.add(/(?: - )?\[[ xX]\]/, { tag: "checkbox", ...lineRule });

// Dividers
registry.add("---", {
  tag: "horizontal_rule",
  findEnd: (str) => getEndOfLine(str),
  findBody: () => ""
});
registry.add("***", {
  tag: "horizontal_rule",
  findEnd: (str) => getEndOfLine(str),
  findBody: () => ""
});

// 2. Code Blocks
registry.add("```", {
  tag: "code_block",
  findEnd: (str: string) => {
    const closeIndex = str.indexOf("```", 3);
    return closeIndex !== -1 ? closeIndex + 3 : str.length;
  },
  findBody: (str: string, size: number) => {
    return str.substring(3, size - 3).trim();
  }
});

// 3. Vue Components
registry.add(/<[A-Z][^\s>]*[^>]*\/>/, {
  tag: "vue_custom_self_closing",
  findEnd: (str, match) => match.length,
  findBody: () => "",
  overwriteTag: (str: string) => {
	const tagMatch = str.match(/<([A-Z][^\s>]*)/);
	return tagMatch ? tagMatch[1] : "vue_custom_no_matching_tag";
  }
});

registry.add(/<[A-Z][^\s>]*[^>]*[^/]>/, {
  tag: "vue_custom_open",
  findEnd: (str: string, match: string) => {
    const tagMatch = match.match(/<([A-Z][^\s>]*)/);
    if (!tagMatch) return match.length;
    const tagName = tagMatch[1];
    const closeTag = `</${tagName}>`;
    const closeIndex = str.indexOf(closeTag);
    return closeIndex !== -1 ? closeIndex + closeTag.length : str.length;
  },
  findBody: (str: string, size: number, match: string) => {
    const tagMatch = match.match(/<([A-Z][^\s>]*)/);
    if (!tagMatch) return "";
    const tagName = tagMatch[1];
    const closeTag = `</${tagName}>`;
    return str.substring(match.length, size - closeTag.length).trim();
  },
  overwriteTag: (str: string) => {
	const tagMatch = str.match(/<([A-Z][^\s>]*)/);
	return tagMatch ? tagMatch[1] : "vue_custom_no_matching_tag";
  }
});

export default registry;