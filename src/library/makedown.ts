import TokenRegistry from '@/library/TokenRegistry';

const dir = "makedown/";

// Helper: Extracts everything after the match until the specified size
const getBodyAfterMatch = (str: string, match: string, size: number): string => {
  return str.substring(match.length, size).trim();
};

// Helper: Finds the end of the current line (Reverted to your original)
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

const selfClosingRule = {
  findEnd: (str: string, match: string) => match.length,
  findBody: (str, match) => match
};

// Register Headers
registry.add("# ",     { tag: `${dir}h1`, ...lineRule });
registry.add("## ",    { tag: `${dir}h2`, ...lineRule });
registry.add("### ",   { tag: `${dir}h3`, ...lineRule });
registry.add("#### ",  { tag: `${dir}h4`, ...lineRule });
registry.add("##### ", { tag: `${dir}h5`, ...lineRule });
registry.add("###### ", { tag: `${dir}h6`, ...lineRule });

// Register Lists & Formatting
registry.add(/ ?(?:- )?\[[ xX]\]/, {
	tag: `${dir}checkbox`,
	propProcessing: (str: string) => {
		const checked = str.toLowerCase().includes("[x]");
		const label = str.replace(/(?: - )?\[[ xX]\]/, '').trim();
		return { checked, label };
	},
	 ...lineRule
	}
);
registry.add(/ ?[-*+] /, { tag: `${dir}unorderedListItem`, ...lineRule });
registry.add(/\d+\. /,       { tag: `${dir}orderedListItem`, ...lineRule });
registry.add("> ",           { tag: `${dir}blockquote`, ...lineRule });

// Dividers
registry.add("---", {
  tag: `${dir}horizontalRule`,
  findEnd: (str) => getEndOfLine(str),
  findBody: () => ""
});
registry.add("***", {
  tag: `${dir}horizontalRule`,
  findEnd: (str) => getEndOfLine(str),
  findBody: () => ""
});

// 2. Code Blocks
registry.add("```", {
  tag: `${dir}codeBlock`,
  findEnd: (str: string) => {
    const closeIndex = str.indexOf("```", 3);
    return closeIndex !== -1 ? closeIndex + 3 : str.length;
  },
  findBody: (str: string, size: number) => {
    return str.substring(3, size - 3).trim();
  }
});

registry.add(/<!--.*?-->/, {
  tag: `${dir}comment`,
  findEnd: (str, match) => match.length,
  findBody: (str, size, match) => match.substring(4, size - 3)
});

registry.add(/!\[.*?\]\([^)]+\)/, {
  tag: `${dir}image`,
  propProcessing: (str: string) => {
	const altMatch = str.match(/!\[(.*?)\]/);
	const urlMatch = str.match(/\(([^)]+)\)/);
	return {
		alt: altMatch ? altMatch[1] : "",
		url: urlMatch ? urlMatch[1] : ""
	};
  },
  ...selfClosingRule
});

registry.add(/\[.*?\]\([^)]+\)/, {
  tag: `${dir}link`,
    propProcessing: (str: string) => {
	const textMatch = str.match(/\[(.*?)\]/);
	const urlMatch = str.match(/\(([^)]+)\)/);
	return {
		text: textMatch ? textMatch[1] : "",
		url: urlMatch ? urlMatch[1] : ""
	};
  },
  ...selfClosingRule
});

// 3. Vue Components
registry.add(/<[A-Z][^\s>]*[^>]*\/>/, {
  tag: `vue_custom_self_closing`,
  findEnd: (str, match) => match.length,
  findBody: () => "",
  overwriteTag: (str: string) => {
	const tagMatch = str.match(/<([A-Z][^\s>]*)/);
	return tagMatch ? tagMatch[1] : "vue_custom_no_matching_tag";
  }
});

registry.add(/<[A-Z][^\s>]*[^>]*[^/]>/, {
  tag: `vue_custom_open`,
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
	return tagMatch ? tagMatch[1] : "vue_custom_no_matching_tag"; // don't use dir as prefix so your unique components do not have to be under makedown
  }
});

export default registry;