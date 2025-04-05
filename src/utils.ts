// Helper to generate the layout
import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { marked } from "marked";

// This file mainly exists as a dumping ground for uninteresting html and CSS
// to remove clutter and noise from the auth logic. You likely do not need
// anything from this file.

export const layout = (content: HtmlEscapedString | string, title: string) => html`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0"
			/>
			<title>${title}</title>
			<script src="https://cdn.tailwindcss.com"></script>
			<script>
				tailwind.config = {
					theme: {
						extend: {
							colors: {
								primary: "#3498db",
								secondary: "#2ecc71",
								accent: "#f39c12",
							},
							fontFamily: {
								sans: ["Inter", "system-ui", "sans-serif"],
								heading: ["Roboto", "system-ui", "sans-serif"],
							},
						},
					},
				};
			</script>
			<style>
				@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap");
			</style>
		</head>
		<body
			class="bg-gray-50 text-gray-800 font-sans leading-relaxed flex flex-col min-h-screen"
		>
			<header class="bg-white shadow-sm mb-8">
				<div
					class="container mx-auto px-4 py-4 flex justify-between items-center"
				>
					<a
						href="/"
						class="text-xl font-heading font-bold text-primary hover:text-primary/80 transition-colors"
						>MCP Server</a
					>
				</div>
			</header>
			<main class="container mx-auto px-4 pb-12 flex-grow">
				${content}
			</main>
		</body>
	</html>
`;

export const homeContent = async (req: Request) => {
	return html`
		<div class="max-w-2xl mx-auto">
			<h1 class="text-3xl font-heading font-bold mb-6 text-gray-900">
				Welcome to MCP Server
			</h1>
			<p class="text-lg text-gray-600 mb-8">
				This is a simple MCP server implementation. The server is running and ready to handle requests.
			</p>
		</div>
	`;
};
