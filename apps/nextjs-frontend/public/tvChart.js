"use strict";

(() => {
    // 工具函数
    const isNil = (s) => s == null;
    const isPresent = (s) => !isNil(s);

    //***********************【生产环境，不使用】*********************** */
    const logoPath = "/static/embed/moralisLogo-3JYAQUIJ.svg";

    //***********************【生产环境，不使用】*********************** */
    // 链ID映射
    const chainIdToName = {
        solana: "solana",
        "0x1": "ethereum",
        "0x38": "binance",
        "0x2105": "base",
        "0xa4b1": "arbitrum",
        "0x89": "polygon",
        "0xa86a": "avalanche",
        "0xa": "optimism",
        "0xe708": "linea",
        "0xfa": "fantom",
        "0x171": "pulse",
        "0x7e4": "ronin"
    };

    //***********************【生产环境，不使用】*********************** */
    // 背景色处理
    const getBackgroundColor = (options) => {
        if (options?.theme === "dark") return "#131722";
        if (options?.theme === "light") return "#FFFFFF";
        return options?.backgroundColor || "#071321";
        // return "#FFFFFF";
    };

    //***********************【生产环境，不使用】*********************** */
    // URL 参数拼接
    const buildUtm = (sourceParams) =>
        `?utm_source=${sourceParams.source}&utm_medium=${sourceParams.medium}`;

    //***********************【生产环境，不使用】*********************** */
    // 生成跳转链接（token 页面）
    const buildPoweredHref = (baseUrl, chainId, utmParams, widgetOptions) => {
        const normalize = (addr) =>
            chainId !== "solana" ? addr.toLowerCase() : addr;
        const chain = chainIdToName[chainId];

        if (widgetOptions.pairAddress) {
            return fetch(
                `${baseUrl}/api/widgets/pair-to-token-address?chainId=${chainId}&pairAddress=${widgetOptions.pairAddress}`
            )
                .then((res) => res.json())
                .then((res) => {
                    const tokenAddress = normalize(res.tokenAddress);
                    return `${baseUrl}/chain/${chain}/token/price/${tokenAddress}${buildUtm(
                        utmParams
                    )}`;
                })
                .catch(() => `${baseUrl}${buildUtm(utmParams)}`);
        }

        if (widgetOptions.tokenAddress) {
            const tokenAddress = normalize(widgetOptions.tokenAddress);
            return Promise.resolve(
                `${baseUrl}/chain/${chain}/token/price/${tokenAddress}${buildUtm(
                    utmParams
                )}`
            );
        }

        return Promise.resolve(`${baseUrl}${buildUtm(utmParams)}`);
    };

    //***********************【生产环境，不使用】*********************** */
    // 构建 Powered by Moralis 链接元素
    const createPoweredByLink = (
        baseUrl,
        chainId,
        utmParams,
        widgetOptions
    ) => {
        const link = document.createElement("a");
        Object.assign(link.style, {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            transition: "filter 0.3s ease",
            padding: "12px",
            backgroundColor: getBackgroundColor(widgetOptions)
        });
        link.target = "_blank";

        // 添加版本logo和链接
        const logo = document.createElement("img");
        Object.assign(logo.style, { width: "21.15px", height: "16.26px" });
        logo.src = `${baseUrl}/${logoPath}`;
        logo.alt = "Moralis";

        const span = document.createElement("span");
        Object.assign(span.style, {
            marginLeft: "6px",
            fontSize: "12px",
            color: "#68738D",
            fontFamily: "Arial, sans-serif",
            lineHeight: "14.4px"
        });
        span.textContent = "Powered by Moralis";

        link.appendChild(logo);
        link.appendChild(span);

        link.addEventListener("mouseenter", () => {
            link.style.filter = "brightness(1.2)";
        });

        link.addEventListener("mouseleave", () => {
            link.style.filter = "brightness(1)";
        });

        buildPoweredHref(baseUrl, chainId, utmParams, widgetOptions).then(
            (url) => {
                link.href = url;
            }
        );

        return link;
    };//end createPoweredByLink

    // 主函数：创建图表组件
    function createMyWidget(containerId, options) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const baseUrl = "https://moralis.com";
        container.innerHTML = "";

        const fullOptions = {
            ...options,
            pageUrl: window.location.href
        };

        // 清理无效参数
        const cleanedOptions = Object.fromEntries(
            Object.entries(fullOptions)
                .filter(([, val]) => isPresent(val))
                .map(([key, val]) => [
                    key,
                    typeof val === "string" ? val : JSON.stringify(val)
                ])
        );

        const width = options.autoSize ? "100%" : options.width || "100%";
        const height = options.autoSize ? "100%" : options.height || "100%";

        const wrapper = document.createElement("div");
        wrapper.style.width = width;
        wrapper.style.height = height;
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";

        const queryString = new URLSearchParams(cleanedOptions).toString();

        const iframe = document.createElement("iframe");
        iframe.id = "my-widget-iframe";
        iframe.src = `${baseUrl}/widgets/embed/price-chart?${queryString}`;
        Object.assign(iframe.style, {
            width: "100%",
            height: "100%",
            border: "none",
            overflow: "hidden"
        });

        wrapper.appendChild(iframe);

        const utm = {
            source: window.location.hostname || "localhost",
            medium: "chart_widget"
        };

        /* const poweredBy = createPoweredByLink(
            baseUrl,
            options.chainId,
            utm,
            options
        );

        wrapper.appendChild(poweredBy); */
        container.appendChild(wrapper);
    }

    // 全局暴露
    window.createMyWidget = createMyWidget;
})();
