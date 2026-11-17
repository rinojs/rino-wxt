export default {
    dist: "./www",
    port: 3000,
    site: {
        url: "https://example.com"
    },
    sitemap: [
    ],
    i18n: {
        defaultLocale: "",
        locales: []
    },
    extension: {
        insertedPages: {
            width: "320px",
            height: "360px",
            position: "bottom-right",
            offset: "16px",
            margin: "0px",
            fixed: true,
            zIndex: 2147483600,
            borderRadius: "14px",
            boxShadow: "0 8px 24px rgb(15 23 42 / 18%)",
            closable: true,
            launcher: {
                enabled: true,
                size: "48px",
                position: "bottom-right",
                offset: "16px",
                margin: "0px",
                borderRadius: "14px",
                menuWidth: "260px",
                menuMaxHeight: "280px"
            },
            pages: {
                "activity.html": {
                    width: "330px",
                    height: "340px",
                    position: "top-right",
                    borderRadius: "20px",
                    enabled: true
                },
                "overview.html": {
                    width: "300px",
                    height: "360px",
                    position: "bottom-left",
                    borderRadius: "8px",
                    enabled: true
                },
                "document-note.html": {
                    width: "320px",
                    height: "300px",
                    position: "top-left",
                    offset: "24px",
                    fixed: false,
                    borderRadius: "0px",
                    enabled: true
                }
            }
        }
    }
}
