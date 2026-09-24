/// <reference lib="webworker" />
import { DotFieldEngine, type DotFieldMessage } from './dot-field-engine';

let engine: DotFieldEngine | undefined;
const queue: DotFieldMessage[] = [];

self.addEventListener('message', (e: MessageEvent<DotFieldMessage>) => {
	const m = e.data;
	if (m.type === 'init') {
		engine = new DotFieldEngine(m.canvas, m.density, m.options, m.running);
		queue.splice(0).forEach((q) => engine!.handle(q));
	} else if (engine) engine.handle(m);
	else queue.push(m);
});
