const usedIds: string[] = [];

export function UIGenerateId() {
	let id = Math.random().toString(36).substring(7);
	while (usedIds.includes(id)) id = Math.random().toString(36).substring(7);
	usedIds.push(id);
	return id;
}