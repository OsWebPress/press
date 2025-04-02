export enum pressBlockType {
	TEXT,
	COMPONENT,
}

interface basePressBlock {
	type: pressBlockType;
}

interface textPressBlock extends basePressBlock {
	type: pressBlockType.TEXT;
	text: string;
}

interface componentPressBlock extends basePressBlock {
	type: pressBlockType.COMPONENT;
	name: string;
	arguments: string;
	slot: string;
}

type pressBlock = textPressBlock | componentPressBlock;

function extractPressComponentBlock(document: string, match: RegExpExecArray): {endIndex: number, block: pressBlock | undefined} {
	const regex = new RegExp(`</${match[1]}\\s*>`, "g");
	var slot: string = '';
	var endIndex: number;
	if (match[0][match[0].length - 2] !== '/') {
		// else seach closing tag.
		const closingTag = regex.exec(document.slice(match.index));
		const next_index = closingTag ? closingTag.index + match.index : -1;
		if(closingTag === undefined || next_index === -1)
			return {endIndex: -1, block: undefined};

		endIndex = match.index + closingTag!.index + closingTag![0].length;
		slot = document.substring(match.index + match[0].length, next_index);
		const tmpEndIndex = document.indexOf(">", next_index);
		// endIndex = tmpEndIndex !== -1 ? tmpEndIndex + 1 : -1;

		// <Info></Info>
		// <Info></Info>
		// 6 13 14 6
		console.log(next_index, endIndex, match.index, closingTag!.index);
	} else {
		const tmpEndIndex = document.indexOf('>', match.index);
		endIndex = tmpEndIndex == -1 ? -1 : tmpEndIndex + 1
	}

	return {endIndex: endIndex, block: {type: pressBlockType.COMPONENT, slot: slot, name: match[1], arguments: ''}}
}

export function parsePressBlocks(document: string): pressBlock[] {
	const regex = /^\s*<\/?(\w+)\s*\/?>/gm;
	var pressBlocks: pressBlock[] = [];
	var match;
	var lastIndex = 0;


	while (lastIndex != -1 && (match = regex.exec(document))) {
		if (match.index != lastIndex) {
			pressBlocks.push({
				type: pressBlockType.TEXT,
				text: document.slice(lastIndex, match.index)
			})
			// extract a text block
		}
		// isolate the component
		const res = extractPressComponentBlock(document, match);
		if (res.block === undefined)
			break;
		pressBlocks.push(res.block);
		lastIndex = res.endIndex; // for extracting text blocks.
		regex.lastIndex = res.endIndex; // jump forward so regex does not register anything in a captured body (slot).
	}
	// add potential last piece of text;
	pressBlocks.push({
		type: pressBlockType.TEXT,
		text: document.slice(lastIndex) // not sure if this is alright yet..
	})

	return pressBlocks;
}