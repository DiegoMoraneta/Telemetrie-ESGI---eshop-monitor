import { createApp } from "vue";
import { createPinia } from "pinia";
import * as Sentry from "@sentry/vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const publicKey = import.meta.env.VITE_GLITCHTIP_PUBLIC_KEY;

Sentry.init({
	app,
	dsn: publicKey ? `http://${publicKey}@${window.location.host}/1` : undefined,
	tunnel: "/_telemetry_secure_ingest_/send", // Permet de contourné le blocage des adblockers.
	tracesSampleRate: 1.0, // Active le taux d'échantillonnage pour avoir toute les informations.
	trackComponents: true, // Active la mesure des performances de rendu des composants de l'application.
	sendDefaultPii: false, // Désactive la collecte d'IP et d'informations personnelles par défaut (RGPD).
	autoSessionTracking: false, // Désactive le suivi des sessions Sentry, car GlitchTip ne le supporte pas.

	// Désactive le filtre de déduplication pour avoir toutes les informations.
	// Par défaut, Sentry bloque l'envoi réseau des erreurs identiques successives sans rechargement de page.
	// La désactiver permet de recevoir toutes les occurrences lors de nos tests ou d'erreurs critiques.
	// Doc: https://docs.sentry.io/platforms/javascript/configuration/integrations/#removing-a-default-integration
	integrations: (integrations) => integrations.filter((i) => i.name !== "Dedupe"),

	// Filtre qui sert à retirer toutes les adresses email des erreurs.
	// On utilise une expression régulière qui match les adresses email et les remplace par "[EMAIL]".
	// Doc: https://docs.sentry.io/platforms/javascript/configuration/filtering/#using-before-send
	beforeSend(event) {

			// Parcourt de façon sécurisée les exceptions
			event.exception?.values?.forEach((val) => {

				// Si la valeur de l'exception est une chaîne de caractères,
				// Alors, on remplace toutes les chaines correspondant à des adresses email par "[EMAIL]"
				if (typeof val?.value === "string") val.value = val.value.replace(/\S+@\S+\.\S+/g, "[EMAIL]");
			});

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
