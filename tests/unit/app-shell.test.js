import { describe, expect, it } from 'vitest';
import { createAppShellMarkup, mountAppShell } from '../../src/ui/appShell.js';

describe('app shell', () => {
  it('renders the app name', () => {
    expect(createAppShellMarkup()).toContain('PXL Sweeper');
  });

  it('renders the locked initial status copy', () => {
    expect(createAppShellMarkup()).toContain('Ready.');
  });

  it('mounts shell markup into the app root', () => {
    const root = { innerHTML: '' };

    mountAppShell(root);

    expect(root.innerHTML).toContain('app-shell');
  });

  it('throws when the app root is missing', () => {
    expect(() => mountAppShell(null)).toThrow('App root #app was not found.');
  });
});
