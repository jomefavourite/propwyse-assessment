export async function register() {
  const unmocked = [
    'localhost:3000',
    'googleapis.com',
    'gstatic.com',
    'github.com/mona.png',
  ];

  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.APP_ENV === 'test') {
    const { server } = await import('./mocks/node');

    server.listen({
      onUnhandledRequest(request, print) {
        const url = new URL(request.url);
        if (unmocked.some((host) => url.hostname.includes(host))) {
          return;
        }

        // Print the regular MSW unhandled request warning otherwise.
        print.warning();
      },
    });
  }
}
