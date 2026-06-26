import { createApp } from "vue";
import { createPinia } from "pinia";
import * as Sentry from "@sentry/vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

Sentry.init({
	app,
	dsn: import.meta.env.VITE_GLITCHTIP_DSN || "",
	integrations: [Sentry.browserTracingIntegration({ router })],
	tracesSampleRate: 1.0,
	trackComponents: true, // Active la mesure des performances de rendu des composants de l'application
	sendDefaultPii: false, // Désactive la collecte d'IP et d'informations personnelles par défaut (RGPD)
	beforeSend(event) {
		// Nettoyage de sécurité additionnel : masquer les emails potentiels des messages d'erreur
		if (event.exception && event.exception.values) {
			event.exception.values.forEach((val) => {
				if (val.value) {
					val.value = val.value.replace(/\S+@\S+\.\S+/g, "[EMAIL]");
				}
			});
		}
		return event;
	},
});

// Chargement dynamique du script de tracking Umami via variables d'environnement
const umamiUrl = import.meta.env.VITE_UMAMI_URL;
const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;

if (umamiUrl && umamiWebsiteId) {
	const script = document.createElement("script");
	script.async = true;
	script.defer = true;
	script.src = `${umamiUrl}/script.js`;
	script.setAttribute("data-website-id", umamiWebsiteId);
	document.head.appendChild(script);
}

app.use(createPinia());
app.use(router);
app.mount("#app");
