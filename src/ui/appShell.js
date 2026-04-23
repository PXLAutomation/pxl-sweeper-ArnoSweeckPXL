export const APP_SHELL_STATE = Object.freeze({
  appName: 'PXL Sweeper',
  statusMessage: 'Ready.',
});

export function createAppShellMarkup(shellState = APP_SHELL_STATE) {
  return `
    <main class="app-shell" aria-labelledby="app-title">
      <section class="app-shell__masthead">
        <p class="app-shell__eyebrow">Static app foundation</p>
        <h1 id="app-title">${shellState.appName}</h1>
        <p class="app-shell__status" role="status">${shellState.statusMessage}</p>
      </section>
    </main>
  `;
}

export function mountAppShell(root, shellState = APP_SHELL_STATE) {
  if (!root) {
    throw new Error('App root #app was not found.');
  }

  root.innerHTML = createAppShellMarkup(shellState);
}
