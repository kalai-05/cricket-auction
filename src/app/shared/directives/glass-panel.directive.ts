import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[appGlassPanel]',
  host: {
    class: 'glass-panel',
    '[class.glass-panel--blue]': 'tint() === "blue"',
    '[class.glass-panel--strong]': 'strong()',
    '[class.glass-panel--interactive]': 'interactive()',
    '[class.glass-panel--glow]': 'glow() && tint() === "gold"',
    '[class.glass-panel--glow-blue]': 'glow() && tint() === "blue"',
  },
})
export class GlassPanelDirective {
  readonly tint = input<'gold' | 'blue'>('gold', { alias: 'appGlassTint' });
  readonly strong = input(false, { alias: 'appGlassStrong', transform: booleanAttribute });
  readonly interactive = input(false, {
    alias: 'appGlassInteractive',
    transform: booleanAttribute,
  });
  readonly glow = input(false, { alias: 'appGlassGlow', transform: booleanAttribute });
}
