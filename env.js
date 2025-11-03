async function loadEnv() {
  const response = await fetch('.env');
  const text = await response.text();
  const lines = text.split('\n');
  const ENV = {};

  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      ENV[key.trim()] = value.trim();
    }
  }

  window.ENV = ENV;
  console.log("Environment Loaded:", ENV);
}

loadEnv();
