import { buildStaticSite } from 'rinojs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFile, readdir, writeFile } from 'fs/promises';
import rinoConfig from './rino-config.js';

async function findInsertedPages(directory, relativeDirectory = "") {
    const entries = await readdir(directory, { withFileTypes: true });
    const pages = [];

    for (const entry of entries) {
        const relativePath = path.posix.join(relativeDirectory, entry.name);
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            pages.push(...await findInsertedPages(absolutePath, relativePath));
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            const fallbackName = path.basename(entry.name, ".html")
                .replace(/[-_]+/g, " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase());
            const html = await readFile(absolutePath, "utf8");
            const title = html
                .match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
                ?.replace(/<[^>]*>/g, "")
                .replace(/\s+/g, " ")
                .trim();

            pages.push({ name: title || fallbackName, path: `inserted/${relativePath}` });
        }
    }

    return pages;
}

async function generate ()
{
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const projectDirectory = path.resolve(__dirname, "./");
    await buildStaticSite(projectDirectory);

    const insertedPages = await findInsertedPages(path.join(projectDirectory, "pages", "inserted"));
    const insertedPageRegistry = {
        config: rinoConfig.extension?.insertedPages ?? {},
        pages: insertedPages,
    };
    await writeFile(
        path.join(projectDirectory, "www", "inserted-pages.json"),
        JSON.stringify(insertedPageRegistry, null, 2),
    );
    await writeFile(
        path.join(projectDirectory, "www", "inserted-pages.js"),
        `globalThis.__RINO_INSERTED_PAGES__ = ${JSON.stringify(insertedPageRegistry)};\n`,
    );
}

generate();
