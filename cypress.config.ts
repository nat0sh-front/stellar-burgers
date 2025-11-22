import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:4000",
        viewportWidth: 1440,
        viewportHeight: 900,
        video: false,
        setupNodeEvents(on, config) {},
        supportFile: false,
    },
});
