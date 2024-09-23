export class IDGenerator {
	usedIds: string[] = [];

	length: number = 7

	constructor(lenght?: number) {
		if (lenght) this.length = lenght
	}

	generate() {
		let id = Math.random().toString(36).substring(this.length);
		while (this.usedIds.includes(id))
			id = Math.random().toString(36).substring(this.length);
		this.usedIds.push(id);
		return id;
	}
}
